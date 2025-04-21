
import {
  PublicKey,
} from "@solana/web3.js";

import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const getAssociatedTokenAccount = (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): PublicKey => {
  let associatedTokenAccountPubkey = (PublicKey.findProgramAddressSync(
    [
      ownerPubkey.toBytes(),
      TOKEN_PROGRAM_ID.toBytes(),
      mintPk.toBytes(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];

  return associatedTokenAccountPubkey;
}

export function convertToFloat(value: number, decimals: number): number {
  return value / Math.pow(10, decimals);
}

export function convertFromFloat(value: number, decimals: number): number {
  return value * Math.pow(10, decimals);
}

export function calculateAmountOutBuy(
  reserveLamport: number,
  adjustedAmount: number,
  tokenOneDecimals: number,
  reserveToken: number
): number {
  // Calculate the denominator sum which is (y + dy)
  const denominatorSum = reserveLamport + adjustedAmount;

  // Convert to float for division
  const denominatorSumFloat = convertToFloat(denominatorSum, tokenOneDecimals);
  const adjustedAmountFloat = convertToFloat(adjustedAmount, tokenOneDecimals);

  // (y + dy) / dy
  const divAmt = denominatorSumFloat / (adjustedAmountFloat);

  // Convert reserveToken to float with 9 decimals
  const reserveTokenFloat = convertToFloat(reserveToken, 9);

  // Calculate dx = xdy / (y + dy)
  const amountOutInFloat = reserveTokenFloat / (divAmt);

  // Convert the result back to the original decimal format
  const amountOut = convertFromFloat(amountOutInFloat, 9);

  return amountOut;
}