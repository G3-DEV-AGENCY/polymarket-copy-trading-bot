import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import fs from "fs";

import { Keypair, Connection, PublicKey } from "@solana/web3.js";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

import { Pumpfun } from "../target/types/pumpfun";
import {
  createConfigTx,
  launchTokenTx,
  migrateTx,
  swapTx,
  withdrawTx,
} from "../lib/scripts";
import { execTx } from "../lib/util";
import {
  TEST_DECIMALS,
  TEST_INIT_BONDING_CURVE,
  TEST_NAME,
  TEST_SYMBOL,
  TEST_TOKEN_SUPPLY,
  TEST_URI,
  TEST_VIRTUAL_RESERVES,
} from "../lib/constant";
import { createMarket } from "../lib/create-market";

let solConnection: Connection = null;
let program: Program<Pumpfun> = null;
let payer: NodeWallet = null;

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
  cluster: web3.Cluster,
  keypair: string,
  rpc?: string
) => {
  if (!rpc) {
    solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
  } else {
    solConnection = new web3.Connection(rpc);
  }

  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(keypair, "utf-8"))),
    { skipValidation: true }
  );
  payer = new NodeWallet(walletKeypair);

  console.log("Wallet Address: ", payer.publicKey.toBase58());

  anchor.setProvider(
    new anchor.AnchorProvider(solConnection, payer, {
      skipPreflight: true,
      commitment: "confirmed",
    })
  );

  // Generate the program client from IDL.
  program = anchor.workspace.Pumpfun as Program<Pumpfun>;

  console.log("ProgramId: ", program.programId.toBase58());
};

export const configProject = async () => {
  // Create a dummy config object to pass as argument.
  const newConfig = {
    authority: payer.publicKey,
    pendingAuthority: PublicKey.default,

    teamWallet: payer.publicKey,

    initBondingCurve: TEST_INIT_BONDING_CURVE,
    platformBuyFee: 0.5, // Example fee: 5%
    platformSellFee: 0.5, // Example fee: 5%
    platformMigrationFee: 0.5, //  Example fee: 5%

    curveLimit: new BN(6_000_000_000), //  Example limit: 6 SOL

    lamportAmountConfig: new BN(TEST_VIRTUAL_RESERVES),
    tokenSupplyConfig: new BN(TEST_TOKEN_SUPPLY),
    tokenDecimalsConfig: new BN(TEST_DECIMALS),
  };

  const tx = await createConfigTx(
    payer.publicKey,
    newConfig,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const launchToken = async () => {
  const tx = await launchTokenTx(
    //  metadata
    TEST_NAME,
    TEST_SYMBOL,
    TEST_URI,

    payer.publicKey,

    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const swap = async (
  token: PublicKey,

  amount: number,
  style: number
) => {
  const tx = await swapTx(
    payer.publicKey,
    token,
    amount,
    style,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const migrate = async (token: PublicKey) => {
  const market = await createMarket(payer, token, solConnection);
  // const market = new PublicKey("8GrKmcQ6rhCNVW4FoKKVLUayduiuNsf9gJ9G1VN4UEEH");

  const tx = await migrateTx(
    payer.publicKey,
    token,
    market,
    solConnection,
    program
  );

  await execTx(tx, solConnection, payer);
};

export const withdraw = async (token: PublicKey) => {
  const tx = await withdrawTx(payer.publicKey, token, solConnection, program);

  await execTx(tx, solConnection, payer);
};
