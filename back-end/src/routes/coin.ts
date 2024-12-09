import express from "express";
import Coin from "../models/Coin";
import { TOKEN_LIST_QUERY_LIMIT } from "../utils/constants";
import { AuthRequest, auth } from "../middleware/authorization";
import { Types } from "mongoose";
import { Keypair, PublicKey } from "@solana/web3.js";
import CoinStatus from "../models/CoinsStatus";
import { io } from "../sockets";
import { coinKing } from "../controller/coinController";


const router = express.Router();

// @route   GET /coin/
// @desc    Get all created coins
// @access  Public
router.get('/', async (req, res) => {
    const coins = await Coin.find({}).populate('creator')
    return res.status(200).send(coins)
})

router.post('/king', async (req, res) => {
    const data = coinKing();
})
