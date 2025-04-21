use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Migrate<'info> {
    #[account(mut)]
    payer: Signer<'info>,
}

impl<'info> Migrate<'info> {
    pub fn process(&mut self, _nonce: u8) -> Result<()> {
        ////////////////////    DM if you want full implementation    ////////////////////
        // telegram - https://t.me/microgift88
        // discord - https://discord.com/users/1074514238325927956
        
        Ok(())
    }
}
