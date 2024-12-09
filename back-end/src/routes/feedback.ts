import express from "express";
import Message from "../models/Feedback";
import { Date, Types } from "mongoose";
import { AuthRequest, auth } from "../middleware/authorization";
import { io } from "../sockets";

const router = express.Router();

// @route   GET /message/:
// @desc    Get messages about this coin
// @access  Public


export default router;