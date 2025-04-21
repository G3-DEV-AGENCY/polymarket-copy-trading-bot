import { MAINNET_PROGRAM_ID, DEVNET_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { Cluster, PublicKey } from "@solana/web3.js";

export const SEED_CONFIG = "config";
export const SEED_BONDING_CURVE = "bonding_curve";

export const TEST_NAME = "test spl token";
export const TEST_SYMBOL = "TEST";
export const TEST_URI =
  "https://ipfs.io/ipfs/QmWVzSC1ZTFiBYFiZZ6QivGUZ9awPJwqZECSFL1UD4gitC";
export const TEST_VIRTUAL_RESERVES = 2_000_000_000;
export const TEST_TOKEN_SUPPLY = 1_000_000_000_000;
export const TEST_DECIMALS = 6;
export const TEST_INIT_BONDING_CURVE = 95;
