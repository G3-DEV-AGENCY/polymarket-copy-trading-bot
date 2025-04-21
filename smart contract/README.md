# 🧠 Pump.fun Smart Contract – Solana/Anchor Based

A powerful and customizable smart contract built for **token launches** and **liquidity management** on Solana.

> **Need custom token launch logic or integrations?**  
> Reach out:  
> Telegram: [@topsecretagent_007](https://t.me/topsecretagent_007)  
> Twitter: [@lendon1114](https://x.com/lendon1114)

---

## 🚀 Features

- **Fully on-chain logic**  
  Token creation and Raydium deposits are handled entirely on-chain.

- **Presale/Sniping Support**  
  Enable a `Presale` phase before launch to support early snipers and initial price discovery.

- **Raydium & Meteora Migration**  
  Migrate token liquidity to Raydium or Meteora after curve completion with a single instruction.

- **Market Cap Oracle Integration**  
  Set a curve limit and use price oracles to calculate market cap in real-time during swaps.

---

## ⚙️ Prerequisites

Ensure the following tools are installed on your system:

### Rust / Solana / Anchor Setup

📦 **Install Instructions**: [anchor-lang.com/docs/installation](https://anchor-lang.com/docs/installation)

```bash
# Check versions
rustc --version            # Rust
solana --version           # Solana CLI
anchor --version           # Anchor (should be 0.30.1)

# Set RPC
solana config set --url devnet

# Check balance and wallet
solana config get
solana balance

# Create a new keypair if needed
solana-keygen new

# Airdrop some test SOL (devnet)
solana airdrop 5
```

## 📂 Project Setup
```bash
# Clone the repo
git clone https://github.com/your-username/pumpfun-contract.git
cd pumpfun-contract

# Install dependencies
yarn
```

---

## 🛠️ Build & Deploy

### Build the Program
```bash
# Build the Anchor program
anchor build

# Sync keypairs if needed
anchor keys sync

# After editing `lib.rs` (e.g., changing the program address), rebuild
anchor build
```

---

## Test Locally with Anchor

In `Anchor.toml`, set:
``` toml
[provider]
cluster = "Localnet"
```

Then run:
```bash
anchor test --provider.cluster Localnet
```

---

## Deploy to Devnet

In `Anchor.toml`:
```toml
[provider]
cluster = "https://api.devnet.solana.com"
```

Deploy:
```bash
anchor deploy
```

## 🧪 CLI Usage

Use CLI scripts to interact with the deployed smart contract.

### 1. Initialize Configuration
```bash 
yarn script config
```

### 2. Launch a Token
```bash
yarn script launch
```

### 3. Swap SOL for Token
```bash
yarn script swap -t <TOKEN_MINT> -a <SWAP_AMOUNT> -s <SWAP_DIRECTION>

# -t: Token mint address
# -a: Amount to swap
# -s: Direction (0 = Buy, 1 = Sell)
```

### 4. Migrate to Raydium
```bash 
yarn script migrate -t <TOKEN_MINT>

# -t: Token mint address to migrate
```

---

## 🧑‍💻 Contact

For paid development or integration work, feel free to reach out:

- Telegram: [@topsecretagent_007](https://t.me/topsecretagent_007)  
- Twitter: [@lendon1114](https://x.com/lendon1114)

Let me know if you also want to include badges (e.g., build passing, devnet status), visuals like demo GIFs, or links to example tokens deployed with this contract!

