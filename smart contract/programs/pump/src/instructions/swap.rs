use crate::{
    errors::PumpError, states::{BondingCurve, Config}
};
use anchor_lang::{prelude::*, system_program};
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    token::{self, Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(
        seeds = [Config::SEED_PREFIX.as_bytes()],
        bump,
    )]
    global_config: Box<Account<'info, Config>>,
    /// CHECK: should be same with the address in the global_config
    #[account(
        mut,
        constraint = global_config.fee_recipient == fee_recipient.key() @PumpError::IncorrectFeeRecipient
    )]
    fee_recipient: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [BondingCurve::SEED_PREFIX.as_bytes(), &token_mint.key().to_bytes()],
        bump
    )]
    bonding_curve: Box<Account<'info, BondingCurve>>,
    
    token_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = bonding_curve
    )]
    curve_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(address = token::ID)]
    token_program: Program<'info, Token>,
    #[account(address = associated_token::ID)]
    associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = system_program::ID)]
    system_program: Program<'info, System>,
}

impl<'info> Swap<'info> {
    pub fn process(
        &mut self,

        amount: u64,
        direction: u8,
        min_out: u64,

        bump_bonding_curve: u8,
    ) -> Result<()> {
        let bonding_curve = &mut self.bonding_curve;

        //  check curve is not completed
        require!(
            bonding_curve.is_completed == false,
            PumpError::CurveAlreadyCompleted
        );

        let curve_pda = &mut bonding_curve.to_account_info();
        let global_config: &Box<Account<'info, Config>> = &self.global_config;

        if direction == 0 {
            //  buy - swap sol for token
            bonding_curve.buy(
                &self.token_mint,
                global_config.curve_limit,
                &self.user,
                curve_pda,
                &mut self.fee_recipient,
                &mut self.user_token_account.to_account_info(),
                &mut self.curve_token_account.to_account_info(),
                amount,
                min_out,
                global_config.buy_fee_percent,
                bump_bonding_curve,
                &self.system_program.to_account_info(),
                &self.token_program.to_account_info()
            )?;
        } else if direction == 1 {
            //  sell - swap token for sol
            bonding_curve.sell(
                &self.token_mint,
                &self.user,
                curve_pda,
                &mut self.fee_recipient,
                &mut self.user_token_account.to_account_info(),
                &mut self.curve_token_account.to_account_info(),
                amount,
                min_out,
                global_config.sell_fee_percent,
                bump_bonding_curve,
                &self.system_program.to_account_info(),
                &self.token_program.to_account_info()
            )?;
        }

        Ok(())
    }
}
