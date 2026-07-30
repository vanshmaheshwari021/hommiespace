import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function test() {
  console.log('Testing connection to:', MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Success! Connected to MongoDB Atlas.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
