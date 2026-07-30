import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to this file in development
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    console.warn(`[WARNING]: Environment variable ${envName} is not set!`);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hommiespace',
  JWT_SECRET: process.env.JWT_SECRET || 'fallbacksecretkey',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
export default env;
