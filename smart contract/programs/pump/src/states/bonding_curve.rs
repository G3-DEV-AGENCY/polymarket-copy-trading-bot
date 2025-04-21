use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::errors::PumpError;
use crate::utils::{sol_transfer_from_user, sol_transfer_with_signer, token_transfer_user, token_transfer_with_signer};

#[account]
pub struct BondingCurve {
    //  vitual balances on the curve
    pub virtual_token_reserves: u64,
    pub virtual_sol_reserves: u64,

    //  real balances on the curve
    pub real_token_reserves: u64,
    pub real_sol_reserves: u64,

    //  token supply
    pub token_total_supply: u64,

    //  true - if the curve reached the limit
    pub is_completed: bool,
}

impl<'info> BondingCurve {
    pub const SEED_PREFIX: &'static str = "bonding-curve";
    pub const LEN: usize = 8 * 5 + 1;

    //  get signer for bonding curve PDA
    pub fn get_signer<'a>(mint: &'a Pubkey, bump: &'a u8) -> [&'a [u8]; 3] {
        [
            Self::SEED_PREFIX.as_bytes(),
            mint.as_ref(),
            std::slice::from_ref(bump),
        ]
    }

    //  update reserve balance on the curve PDA
    pub fn update_reserves(&mut self, reserve_lamport: u64, reserve_token: u64) -> Result<bool> {
        self.virtual_sol_reserves = reserve_lamport;
        self.virtual_token_reserves = reserve_token;

        Ok(false)
    }

    //  swap sol for token
    pub fn buy(
        &mut self,
        token_mint: &Account<'info, Mint>, //  token mint address
        curve_limit: u64,                  //  bonding curve limit
        user: &Signer<'info>,              //  user address

        curve_pda: &mut AccountInfo<'info>,     //  bonding curve PDA
        fee_recipient: &mut AccountInfo<'info>, //  team wallet address to get fee

        user_ata: &mut AccountInfo<'info>, //  associated toke accounts for user
        curve_ata: &mut AccountInfo<'info>, //  associated toke accounts for curve

        amount_in: u64,      //  sol amount to pay
        min_amount_out: u64, //  minimum amount out
        fee_percent: f64,    //  buy fee

        curve_bump: u8, // bump for signer

        system_program: &AccountInfo<'info>, //  system program
        token_program: &AccountInfo<'info>,  //  token program
    ) -> Result<bool> {
        
        let (amount_out, fee_lamports) =
            self.calc_amount_out(amount_in, token_mint.decimals, 0, fee_percent)?;

        //  check min amount out
        require!(
            amount_out >= min_amount_out,
            PumpError::ReturnAmountTooSmall
        );

        //  transfer fee to team wallet
        sol_transfer_from_user(&user, fee_recipient, system_program, fee_lamports)?;
        //  transfer adjusted amount to curve
        sol_transfer_from_user(&user, curve_pda, system_program, amount_in - fee_lamports)?;
        //  transfer token from PDA to user
        token_transfer_with_signer(
            curve_ata,
            curve_pda,
            user_ata,
            token_program,
            &[&BondingCurve::get_signer(&token_mint.key(), &curve_bump)],
            amount_out,
        )?;

        //  calculate new reserves
        let new_token_reserves = self
            .virtual_token_reserves
            .checked_sub(amount_out)
            .ok_or(PumpError::OverflowOrUnderflowOccurred)?;

        let new_sol_reserves = self
            .virtual_sol_reserves
            .checked_add(amount_in - fee_lamports)
            .ok_or(PumpError::OverflowOrUnderflowOccurred)?;

        msg! {"Reserves:: Token: {:?} SOL: {:?}", new_token_reserves, new_sol_reserves};

        //  update reserves on the curve
        self.update_reserves(new_sol_reserves, new_token_reserves)?;

        //  return true if the curve reached the limit
        if new_sol_reserves >= curve_limit {
            self.is_completed = true;
            return Ok(true);
        }

        //  return false, curve is not reached the limit
        Ok(false)
    }

    //  swap token for sol
    pub fn sell(
        &mut self,
        token_mint: &Account<'info, Mint>, //  token mint address
        user: &Signer<'info>,              //  user address

        curve_pda: &mut AccountInfo<'info>, //  bonding curve PDA
        fee_recipient: &mut AccountInfo<'info>, //  team wallet address to get fee

        user_ata: &mut AccountInfo<'info>, //  associated toke accounts for user
        curve_ata: &mut AccountInfo<'info>, //  associated toke accounts for curve

        amount_in: u64,      //  sol amount to pay
        min_amount_out: u64, //  minimum amount out
        fee_percent: f64,    //  sell fee

        curve_bump: u8, // bump for signer
        
        system_program: &AccountInfo<'info>, //  system program
        token_program: &AccountInfo<'info>,  //  token program
    ) -> Result<()> {
        let (amount_out, fee_lamports) =
            self.calc_amount_out(amount_in, token_mint.decimals, 1, fee_percent)?;

        //  check min amount out
        require!(
            amount_out >= min_amount_out,
            PumpError::ReturnAmountTooSmall
        );

        let token = token_mint.key();
        let signer_seeds: &[&[&[u8]]] = &[&BondingCurve::get_signer(&token, &curve_bump)];
        //  transfer fee to team wallet
        sol_transfer_with_signer(
            &user,
            fee_recipient,
            system_program,
            signer_seeds,
            fee_lamports,
        )?;
        //  transfer SOL to curve PDA
        sol_transfer_with_signer(
            &user,
            curve_pda,
            &system_program,
            signer_seeds,
            amount_in - fee_lamports,
        )?;
        //  transfer token from user to PDA
        token_transfer_user(
            user_ata,
            user,
            curve_ata,
            token_program,
            amount_out,
        )?;

        //  calculate new reserves
        let new_token_reserves = self
            .virtual_token_reserves
            .checked_add(amount_in)
            .ok_or(PumpError::OverflowOrUnderflowOccurred)?;

        let new_sol_reserves = self
            .virtual_sol_reserves
            .checked_sub(amount_out + fee_lamports)
            .ok_or(PumpError::OverflowOrUnderflowOccurred)?;

        msg! {"Reserves:: Token: {:?} SOL: {:?}", new_token_reserves, new_sol_reserves};

        //  update reserves on the curve
        self.update_reserves(new_sol_reserves, new_token_reserves)?;

        Ok(())
    }

    //  calculate amount out and fee lamports
    fn calc_amount_out(
        &mut self,
        _amount_in: u64,
        _token_decimal: u8, //  decimal for token
        _direction: u8,     //  0 - buy, 1 - sell
        _fee_percent: f64,
    ) -> Result<(u64, u64)> {
        //  implement your curve fomula
        let amount_out = 0;
        let fee_lamports = 0;

        Ok((amount_out, fee_lamports))
    }
}
