// routes/users.js
import express from "express";
import User from "../models/User";
import PendingUser from "../models/PendingUser";
import crypto from "crypto";
import Joi from "joi";
import base58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey, Transaction } from "@solana/web3.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// @route   POST api/users
// @desc    Resgister user
// @access  Public


export default router;

export interface UserInfo {
  name: string;
  wallet: string;
  avatar?: string;
}

export interface PendingUserInfo {
  name: string;
  wallet: string;
  nonce: string;
}
