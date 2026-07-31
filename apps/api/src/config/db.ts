import mongoose from 'mongoose';
import env from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error instanceof Error ? error.message : error}`);
    console.warn(`API Server is running on port 5000 in fault-tolerant mode.`);
  }
};

export default connectDB;
