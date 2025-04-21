use crate::{
    consts::TOKEN_DECIMAL,
    states::{BondingCurve, Config},
};
use anchor_lang::{prelude::*, solana_program::sysvar::SysvarId, system_program};
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    metadata::{self, mpl_token_metadata::types::DataV2, Metadata},
    token::{self, spl_token::instruction::AuthorityType, Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct Launch<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        seeds = [Config::SEED_PREFIX.as_bytes()],
        bump,
    )]
    global_config: Box<Account<'info, Config>>,

    #[account(
        init,
        payer = creator,
        mint::decimals = TOKEN_DECIMAL,
        mint::authority = global_config.key(),
    )]
    token_mint: Box<Account<'info, Mint>>,

    ////////////////////////////////////////////////////////////////////////////
    //  move the below to swap ix if you want the first buyer to pays this fee
    ////////////////////////////////////////////////////////////////////////////
    #[account(
        init,
        payer = creator,
        space = 8 + BondingCurve::LEN,
        seeds = [BondingCurve::SEED_PREFIX.as_bytes(), &token_mint.key().to_bytes()],
        bump
    )]
    bonding_curve: Box<Account<'info, BondingCurve>>,
    #[account(
        init,
        payer = creator,
        associated_token::mint = token_mint,
        associated_token::authority = bonding_curve
    )]
    curve_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: initialized by token metadata program
    #[account(mut)]
    token_metadata_account: UncheckedAccount<'info>,

    #[account(address = token::ID)]
    token_program: Program<'info, Token>,
    #[account(address = associated_token::ID)]
    associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = metadata::ID)]
    metadata_program: Program<'info, Metadata>,
    #[account(address = system_program::ID)]
    system_program: Program<'info, System>,
    #[account(address = Rent::id())]
    rent: Sysvar<'info, Rent>,
}

impl<'info> Launch<'info> {
    pub fn process(
        &mut self,

        //  metadata
        name: String,
        symbol: String,
        uri: String,

        bump_config: u8,
    ) -> Result<()> {
        let bonding_curve = &mut self.bonding_curve;
        let global_config = &self.global_config;

        // init bonding curve pda
        bonding_curve.virtual_token_reserves = global_config.initial_virtual_token_reserves;
        bonding_curve.virtual_sol_reserves = global_config.initial_virtual_sol_reserves;
        bonding_curve.real_token_reserves = global_config.initial_real_token_reserves;
        bonding_curve.real_sol_reserves = 0;
        bonding_curve.token_total_supply = global_config.total_token_supply;
        bonding_curve.is_completed = false;

        ////////////////////////////////////////////////////////////////////////////////
        //  move the below to swap ix if you want the first buyer to pays the other fee
        ////////////////////////////////////////////////////////////////////////////////

        let signer_seeds: &[&[&[u8]]] = &[&[Config::SEED_PREFIX.as_bytes(), &[bump_config]]];

        //  mint token to bonding curve
        token::mint_to(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                token::MintTo {
                    mint: self.token_mint.to_account_info(),
                    to: self.curve_token_account.to_account_info(),
                    authority: global_config.to_account_info(),
                },
                signer_seeds,
            ),
            global_config.total_token_supply,
        )?;

        //  create metadata
        metadata::create_metadata_accounts_v3(
            CpiContext::new_with_signer(
                self.metadata_program.to_account_info(),
                metadata::CreateMetadataAccountsV3 {
                    metadata: self.token_metadata_account.to_account_info(),
                    mint: self.token_mint.to_account_info(),
                    mint_authority: global_config.to_account_info(),
                    payer: self.creator.to_account_info(),
                    update_authority: global_config.to_account_info(),
                    system_program: self.system_program.to_account_info(),
                    rent: self.rent.to_account_info(),
                },
                signer_seeds,
            ),
            DataV2 {
                name: name.clone(),
                symbol: symbol.clone(),
                uri: uri.clone(),
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            false,
            true,
            None,
        )?;

        //  revoke mint authority
        token::set_authority(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                token::SetAuthority {
                    current_authority: global_config.to_account_info(),
                    account_or_mint: self.token_mint.to_account_info(),
                },
                signer_seeds,
            ),
            AuthorityType::MintTokens,
            None,
        )?;

        Ok(())
    }
}
