// models/Coin.ts
import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    ticker: { type: String, required: true },
    description: { type: String },
    decimals: { type: Number, required: true },
    token: { type: String, unique: true, required: true },
    tokenReserves: { type: Number, required: true },
    lamportReserves: { type: Number, required: true },
    url: { type: String, requried: true },
    progressMcap: { type: Number, required: true },
    date: { type: Date, default: new Date() },
    limit: { type: Number, required: true },
    bondingCurve: {type: Boolean, default: false }
});

const Coin = mongoose.model("Coin", coinSchema);

export default Coin;
