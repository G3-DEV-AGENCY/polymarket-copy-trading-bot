// models/User.ts
import mongoose, { Types } from 'mongoose';

const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
const defualtImg = process.env.DEFAULT_IMG_HASH

const userSchema = new mongoose.Schema({
  
});

const User = mongoose.model('User', userSchema);

export default User;