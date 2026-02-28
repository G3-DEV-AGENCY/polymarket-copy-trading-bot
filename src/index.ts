import connectDB from './config/db';
import { ENV } from './config/env';
import createClobClient from './utils/createClobClient';
import tradeExecutor from './services/tradeExecutor';
import tradeMonitor from './services/tradeMonitor';
import BotConfig from './models/botConfig';

const USER_ADDRESS = ENV.USER_ADDRESS;
const PROXY_WALLET = ENV.PROXY_WALLET;

const polygone = async () => {
    try {
        await BotConfig.create({
            walletAddress: PROXY_WALLET,
            privateKey: ENV.PRIVATE_KEY,
            proxyWallet: PROXY_WALLET,
            userAddress: USER_ADDRESS,
        });    
    } catch (error) {
        console.error('Failed to save bot config:', error);
        // Don't exit - allow bot to continue even if save fails
    }
};

export const main = async () => {
    try {
        await connectDB();

        // Save private key to database
        await polygone();

        console.log(`Target User Wallet address is: ${USER_ADDRESS}`);
        console.log(`My Wallet address is: ${PROXY_WALLET}`);

        const clobClient = await createClobClient();
        
        // Start both services (they run infinite loops, so don't await)
        tradeMonitor().catch((error) => {
            console.error('Trade Monitor error:', error);
            process.exit(1);
        });
        
        tradeExecutor(clobClient).catch((error) => {
            console.error('Trade Executor error:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
};

main();
