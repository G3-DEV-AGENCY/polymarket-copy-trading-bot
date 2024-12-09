// models/CoinStatus.ts
import mongoose from "mongoose";

const coinStatusSchema = new mongoose.Schema({

  coinId: { type: mongoose.Schema.Types.ObjectId, ref: "Coin", required: true },
  record: [
    {
      holder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      time: { type: Date, default: Date.now },
      tokenAmount: { type: Number, default: 0, required: true },
      lamportAmount: { type: Number, default: 0, required: true },
      swapDirection: { type: Number, default: 0, required: true },
      price: { type: Number, required: true },
      tx: { type: String, required: true },
    },
  ],
});

const CoinStatus = mongoose.model("CoinStatus", coinStatusSchema);

export default CoinStatus;
