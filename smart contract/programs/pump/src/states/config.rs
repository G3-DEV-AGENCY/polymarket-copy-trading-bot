use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub authority: Pubkey,     //  authority of the program
    pub fee_recipient: Pubkey, //  team wallet address to receive the fee

    //  lamports to complete the bonding curve
    pub curve_limit: u64,

    //  curve token/sol amount config
    pub initial_virtual_token_reserves: u64,
    pub initial_virtual_sol_reserves: u64,
    pub initial_real_token_reserves: u64,
    pub total_token_supply: u64,

    //  platform fee percentage
    pub buy_fee_percent: f64,
    pub sell_fee_percent: f64,
    pub migration_fee_percent: f64,
}

impl Config {
    pub const SEED_PREFIX: &'static str = "global-config";
    pub const LEN: usize = 32 + 32 + 8 + 8 * 4 + 8 * 3;
}
