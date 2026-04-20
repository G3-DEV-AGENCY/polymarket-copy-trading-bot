# Polymarket Copy trading Bot

Polymarket Copytrading Bot which copies trades from one or more leader addresses on Polymarket. Config in `trade.toml`, secrets in `.env`.

## Journey of Builder - [soladity](https://t.me/soladity)

At first glance, prediction markets—especially in crypto—seem like the perfect playground for automation. But the deeper I looked, the clearer the reality became: short-term movements are often chaotic. Prices swing aggressively, positions flip within seconds, and liquidity can disappear just as quickly as it appears. Building something consistent in that environment isn’t easy.

When I started exploring Polymarket, that unpredictability stood out immediately. Crypto markets move fast, but even beyond crypto, every category has its own dynamics. Trying to rely on a single market type felt limiting—and fragile.

So instead of narrowing the scope, I went in the opposite direction.

I designed a system that could operate across all market categories—Politics, Sports, Crypto, macroeconomic events—anything available. The core idea was simple but powerful: identify experienced traders, follow their moves in real time, and stay adaptable regardless of the market conditions.

Development began in early February 2026. Over the following weeks, I focused on refining the fundamentals—filtering which traders to follow, optimizing execution timing, and calibrating position sizing. I ran simulations on historical data and tested the system with a small live balance. The early results were encouraging: not explosive gains, but consistent, controlled growth.

That became the philosophy behind the system.

This isn’t about chasing volatility or trying to time every spike. It’s about disciplined copy trading, spreading exposure across different markets, and maintaining stability in unpredictable conditions. By following multiple high-performing traders and diversifying across categories, the system can adapt—whether it’s reacting to fast-paced sports and crypto markets or holding positions in longer-term political and economic events.

In the end, the goal is simple: build a resilient, long-term trading system. One that prioritizes risk management, consistency, and flexibility over hype.

A system designed not for quick wins—but for steady, sustainable growth. 🚀

# Market Types

- Polymarket includes Politics, Sports, Crypto, Economic, Geopolitical, Entertainment, and Experimental markets.
- Politics & Macro markets are longer-term and news-driven, suitable for medium-term copy strategies.
- Sports & Crypto markets are fast-moving and require quick execution (websocket mode recommended).
- Entertainment markets tend to be slower and lower volatility.
- Experimental / low-liquidity markets carry higher slippage risk and should use size limits.

Adjust filters like entry_trade_sec, trade_sec_from_resolve, take_profit, and buy_amount_limit_in_usd based on the market’s volatility and duration.

## Setup

```bash
git clone https://github.com/G3-DEV-AGENCY/polymarket-copy-trading-bot.git
cd polymarket-copy-trading-bot
npm install
# Edit .env: WALLET_PRIVATE_KEY, PROXY_WALLET_ADDRESS (if Magic), SIGNATURE_TYPE
cd frontend
npm install
# Install for UI
cd ..
npm run dev
```

# Advanced Polymarket Trading Bot.

I have developed an advanced Polymarket trading bot, including a high-performance Rust-based copy trading system optimized for low-latency execution, as well as an AI agent trading bot built in TypeScript with automated strategy logic. 

The architecture is designed for speed, efficiency, and scalability, making it suitable for serious traders looking to automate and optimize their activity in prediction markets. If you are interested in purchasing or learning more about the system and its capabilities, feel free to contact me directly.

<img width="1884" height="617" alt="image" src="https://github.com/user-attachments/assets/900d2bb1-de25-4d4c-a94d-7f083990e145" />

TG: [soladity](https://t.me/soladity)

## Run

```bash
npm run dev    # tsx src/index.ts
```

## Env

- `TARGET_WALLET` – Polymarket proxy address or username for copy trade
- `WALLET_PRIVATE_KEY` – EOA or Magic export
- `PROXY_WALLET_ADDRESS` – Polymarket profile (required for Magic; optional EOA)
- `SIGNATURE_TYPE` – 0 = EOA, 1 = Magic/proxy, 2 = Gnosis Safe

### Target Wallets

|Address|Profile|Pnl|
|-|-|-|
|0x6031b6eed1c97e853c6e0f03ad3ce3529351f96d|@gabagool22|<img width="1200" src="https://github.com/user-attachments/assets/ef04d657-da3f-4b5a-aeed-b99f2c264df8" />|
|0x63ce342161250d705dc0b16df89036c8e5f9ba9a|@0x8dxd|<img width="1200" src="https://github.com/user-attachments/assets/e032f4e9-001a-4dd6-b3b5-6d983167f92d" />|
|0xa61ef8773ec2e821962306ca87d4b57e39ff0abd|@risk-manager|<img width="1200" src="https://github.com/user-attachments/assets/6ca49607-7615-4a0c-9786-54400971ee27" />|
|0x781a48229e2c08e20d1eaad90ef73710988c96e6|@100USDollars|<img width="1200" src="https://github.com/user-attachments/assets/380debcb-dc09-466f-b7cd-ca2552605eb7" />|
|0x0ac97e4f5c542cd98c226ae8e1736ae78b489641|@7thStaircase|<img width="1200" src="https://github.com/user-attachments/assets/c638d830-a472-4035-99ca-c33c72c3aa23" />|
|0x1d0034134e339a309700ff2d34e99fa2d48b0313|@0x1d0034134e|<img width="1200" src="https://github.com/user-attachments/assets/2e07c2bf-2ac6-42d2-b319-356bfc0def91" />|
|0xa9878e59934ab507f9039bcb917c1bae0451141d|@ilovecircle|<img width="1200" src="https://github.com/user-attachments/assets/b8342802-62d3-461d-8593-8f980178bdfe" />|
|0xd0d6053c3c37e727402d84c14069780d360993aa|@k9Q2mX4L8A7ZP3R|<img width="1200" src="https://github.com/user-attachments/assets/e3eaf5bb-b6d3-47fd-bf96-93d13bcd4442" />|
|0x594edB9112f526Fa6A80b8F858A6379C8A2c1C11|@0x594...1C11|<img width="1200" src="https://github.com/user-attachments/assets/d868f76d-74d9-405d-b168-7e8d5b27c083" />|
|0x1979ae6B7E6534dE9c4539D0c205E582cA637C9D|@0x197...7C9D|<img width="1200" src="https://github.com/user-attachments/assets/45d5c5cd-e9b2-492f-ad9d-94c2d9bf1fac" />|
|0x4460bf2c0aa59db412a6493c2c08970797b62970|@Bidou28old|<img width="1200" src="https://github.com/user-attachments/assets/9ff95df6-ff16-48ea-82d4-979d358f973d" />|
|0x0eA574F3204C5c9C0cdEad90392ea0990F4D17e4|@0x0eA...17e4|<img width="1200" src="https://github.com/user-attachments/assets/e5162217-c7b8-4656-8858-e82c93ca36e8" />|
|0x118689b24aead1d6e9507b8068d056b2ec4f051b|@russell110320|<img width="1200" src="https://github.com/user-attachments/assets/b508aa98-80a7-4a1f-8bf4-c4e097dc6105" />|
|0x13414a77a4be48988851c73dfd824d0168e70853|@czoyimsezblaznili|<img width="1200" src="https://github.com/user-attachments/assets/eb1c7041-29b1-4a21-803f-59bbe8dc0a4b" />|

