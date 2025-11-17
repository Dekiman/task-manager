import mongoose from 'mongoose';
import { ENV } from '../lib/env.js';

export const connectDB = async () => {
    try {
        const MONGO_URI  = ENV.MONGO_URI;
        if (!MONGO_URI) throw new Error('MONGO_URI is not set');
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

export default connectDB;