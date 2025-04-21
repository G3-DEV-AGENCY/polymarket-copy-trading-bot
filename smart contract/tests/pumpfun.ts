import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Pumpfun } from "../target/types/pumpfun";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import * as assert from "assert";
import {
  SEED_CONFIG,
  SEED_BONDING_CURVE,
  TEST_DECIMALS,
  TEST_NAME,
  TEST_SYMBOL,
  TEST_TOKEN_SUPPLY,
  TEST_URI,
  TEST_VIRTUAL_RESERVES,
  TEST_INIT_BONDING_CURVE,
  SEED_GLOBAL,
} from "./constant";
import {
  calculateAmountOutBuy,
  convertFromFloat,
  convertToFloat,
  getAssociatedTokenAccount,
} from "./utils";
require("dotenv").config();

describe("pumpfun", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Pumpfun as Program<Pumpfun>;

  const adminKp = Keypair.generate();
  const userKp = Keypair.generate();
  const user2Kp = Keypair.generate();
  const tokenKp = Keypair.generate();

  console.log("admin: ", adminKp.publicKey.toBase58());
  console.log("user: ", userKp.publicKey.toBase58());
  console.log("user2: ", user2Kp.publicKey.toBase58());

  const connection = provider.connection;

  before(async () => {
    console.log("airdrop SOL to admin");

    const airdropTx = await connection.requestAirdrop(
      adminKp.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction({
      signature: airdropTx,
      abortSignal: AbortSignal.timeout(1000),
    } as TransactionConfirmationStrategy);

    console.log("airdrop SOL to user");
    const airdropTx2 = await connection.requestAirdrop(
      userKp.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction({
      signature: airdropTx2,
      abortSignal: AbortSignal.timeout(1000),
    } as TransactionConfirmationStrategy);

    console.log("airdrop SOL to user2");
    const airdropTx3 = await connection.requestAirdrop(
      user2Kp.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction({
      signature: airdropTx3,
      abortSignal: AbortSignal.timeout(1000),
    } as TransactionConfirmationStrategy);
  });

  it("Is correctly configured", async () => {
    // Create a dummy config object to pass as argument.
    const newConfig = {
      authority: adminKp.publicKey,
      pendingAuthority: PublicKey.default,
      platformMigrationFee: 0,
      teamWallet: adminKp.publicKey,

      initBondingCurve: TEST_INIT_BONDING_CURVE,

      platformBuyFee: 5.0, // Example fee: 5%
      platformSellFee: 5.0, // Example fee: 5%

      curveLimit: new BN(400_000_000_000), //  Example limit: 400 SOL

      lamportAmountConfig: new BN(TEST_VIRTUAL_RESERVES),
      tokenSupplyConfig: new BN(TEST_TOKEN_SUPPLY),
      tokenDecimalsConfig: TEST_DECIMALS,
    };

    // Send the transaction to configure the program.
    const tx = await program.methods
      .configure(newConfig)
      .accounts({
        payer: adminKp.publicKey,
      })
      .signers([adminKp])
      .rpc();

    console.log("tx signature:", tx);

    // get PDA for the config account using the seed "config".
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );

    // Log PDA details for debugging.
    console.log("config PDA:", configPda.toString());

    // Fetch the updated config account to validate the changes.
    const configAccount = await program.account.config.fetch(configPda);

    // Assertions to verify configuration
    assert.equal(
      configAccount.authority.toString(),
      adminKp.publicKey.toString()
    );
    assert.equal(configAccount.platformBuyFee, 5);
    assert.equal(configAccount.platformSellFee, 5);
    assert.equal(configAccount.lamportAmountConfig, TEST_VIRTUAL_RESERVES);

    assert.equal(configAccount.tokenSupplyConfig, TEST_TOKEN_SUPPLY);

    assert.equal(configAccount.tokenDecimalsConfig, TEST_DECIMALS);

    assert.equal(configAccount.initBondingCurve, TEST_INIT_BONDING_CURVE);
  });

  it("Is the token created", async () => {
    console.log("token: ", tokenKp.publicKey.toBase58());
    // get PDA for the config account using the seed "config".
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    // Send the transaction to launch a token

    const tx = await program.methods
      .launch(
        //  metadata
        TEST_NAME,
        TEST_SYMBOL,
        TEST_URI
      )
      .accounts({
        creator: userKp.publicKey,
        token: tokenKp.publicKey,
        teamWallet: configAccount.teamWallet,
      })
      .signers([userKp, tokenKp])
      .rpc();

    console.log("tx signature:", tx);

    // get token detailed info
    const supply = await connection.getTokenSupply(tokenKp.publicKey);

    // Assertions to verify configuration
    assert.equal(supply.value.amount, TEST_TOKEN_SUPPLY);

    // check launch phase is 'Presale'
    const [bondingCurvePda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_BONDING_CURVE), tokenKp.publicKey.toBytes()],
      program.programId
    );

    console.log("bonding curve PDA:", bondingCurvePda.toString());

    const curveAccount = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );

    // Assertions to verify configuration
    assert.equal(curveAccount.creator.toBase58(), userKp.publicKey.toBase58());

    // assertions balances
    const teamTokenAccount = getAssociatedTokenAccount(
      adminKp.publicKey,
      tokenKp.publicKey
    );
    const [global_vault] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_GLOBAL)],
      program.programId
    );
    const globalVaultTokenAccount = getAssociatedTokenAccount(
      global_vault,
      tokenKp.publicKey
    );
    const teamTokenBalance = await connection.getTokenAccountBalance(
      teamTokenAccount
    );
    const globalVaultBalance = await connection.getTokenAccountBalance(
      globalVaultTokenAccount
    );
    assert.equal(
      teamTokenBalance.value.amount,
      (TEST_TOKEN_SUPPLY * (100 - TEST_INIT_BONDING_CURVE)) / 100
    );
    assert.equal(
      globalVaultBalance.value.amount,
      (TEST_TOKEN_SUPPLY * TEST_INIT_BONDING_CURVE) / 100
    );
  });

  // trade SOL for token
  it("Is user1's simulate swap SOL for token completed", async () => {
    // get PDA for the config account using the seed "config".
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );

    // Log PDA details for debugging.
    console.log("config PDA:", configPda.toString());

    // Fetch the updated config account to validate the changes.
    const configAccount = await program.account.config.fetch(configPda);

    const amount = new BN(5_000_000);
    const tx = await program.methods
      .simulateSwap(amount, 0)
      .accounts({
        tokenMint: tokenKp.publicKey,
      })
      .view();
    const actualAmountOut = new BN(tx).toNumber();

    // amount after minus fees
    const adjustedAmount = convertFromFloat(
      (convertToFloat(amount.toNumber(), TEST_DECIMALS) *
        (100 - configAccount.platformBuyFee)) /
        100,
      TEST_DECIMALS
    );

    const reserveToken = (TEST_TOKEN_SUPPLY * TEST_INIT_BONDING_CURVE) / 100;
    console.log(reserveToken);
    const amountOut = calculateAmountOutBuy(
      TEST_VIRTUAL_RESERVES,
      adjustedAmount,
      TEST_DECIMALS,
      reserveToken
    );

    console.log("expected amount out: ", amountOut);
    console.log("actual amount out: ", actualAmountOut);
    assert.equal(actualAmountOut, Math.floor(amountOut));
  });

  it("Is user1's swap SOL for token completed", async () => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    // case 1: failed because minimum receive is too high because of slippage
    try {
      await program.methods
        .swap(new BN(5_000_000), 0, new BN(5_000_000_0))
        .accounts({
          teamWallet: configAccount.teamWallet,
          user: userKp.publicKey,
          tokenMint: tokenKp.publicKey,
        })
        .signers([userKp])
        .rpc();
    } catch (error) {
      assert.match(
        JSON.stringify(error),
        /Return amount is too small compared to the minimum received amount./
      );
    }

    // case 2: happy case. Send the transaction to launch a token
    const tx = await program.methods
      .swap(new BN(5_000_000), 0, new BN(0))
      .accounts({
        teamWallet: configAccount.teamWallet,
        user: userKp.publicKey,
        tokenMint: tokenKp.publicKey,
      })
      .signers([userKp])
      .rpc();

    console.log("tx signature:", tx);

    //  check user1's balance
    const tokenAccount = getAssociatedTokenAccount(
      userKp.publicKey,
      tokenKp.publicKey
    );
    const balance = await connection.getBalance(userKp.publicKey);
    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);

    console.log("buyer: ", userKp.publicKey.toBase58());
    console.log("lamports: ", balance);
    console.log("token amount: ", tokenBalance.value.uiAmount);
  });

  it("Is user1's swap Token for SOL completed", async () => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    // Send the transaction to launch a token
    const tx = await program.methods
      .swap(new BN(22_000_000), 1, new BN(0))
      .accounts({
        teamWallet: configAccount.teamWallet,
        user: userKp.publicKey,
        tokenMint: tokenKp.publicKey,
      })
      .signers([userKp])
      .rpc();

    console.log("tx signature:", tx);

    //  check user1's balance
    const tokenAccount = getAssociatedTokenAccount(
      userKp.publicKey,
      tokenKp.publicKey
    );
    const balance = await connection.getBalance(userKp.publicKey);
    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);

    console.log("buyer: ", userKp.publicKey.toBase58());
    console.log("lamports: ", balance);
    console.log("token amount: ", tokenBalance.value.uiAmount);
  });

  it("Is the curve reached the limit", async () => {
    const [configPda, _] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_CONFIG)],
      program.programId
    );
    const configAccount = await program.account.config.fetch(configPda);

    // Send the transaction to launch a token
    const tx = await program.methods
      .swap(new BN(4_000_000_000), 0, new BN(0))
      .accounts({
        teamWallet: configAccount.teamWallet,
        user: user2Kp.publicKey,
        tokenMint: tokenKp.publicKey,
      })
      .signers([user2Kp])
      .rpc();

    console.log("tx signature:", tx);

    //  check user2's balance
    const tokenAccount = getAssociatedTokenAccount(
      user2Kp.publicKey,
      tokenKp.publicKey
    );
    const balance = await connection.getBalance(user2Kp.publicKey);
    const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);

    console.log("buyer: ", user2Kp.publicKey.toBase58());
    console.log("lamports: ", balance);
    console.log("token amount: ", tokenBalance.value.uiAmount);

    // check launch phase is 'completed'
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SEED_BONDING_CURVE), tokenKp.publicKey.toBytes()],
      program.programId
    );

    const curveAccount = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );

    // Assertions to verify configuration
    assert.equal(curveAccount.isCompleted, true);
    assert.equal(
      curveAccount.reserveLamport.toNumber(),
      configAccount.curveLimit.toNumber()
    );
  });
});
