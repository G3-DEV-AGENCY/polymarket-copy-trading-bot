use anchor_lang::prelude::*;

#[error_code]
pub enum PumpError {
    #[msg("Not authorized address")]
    NotAuthorized,

    #[msg("Fee recipient address is not match with the one in the config")]
    IncorrectFeeRecipient,

    #[msg("The value is not in the expected range")]
    IncorrectValue,

    #[msg("Amount out is smaller than required amount")]
    ReturnAmountTooSmall,

    #[msg("An overflow or underflow occurred during the calculation")]
    OverflowOrUnderflowOccurred,

    #[msg("Curve is already completed")]
    CurveAlreadyCompleted,
}
