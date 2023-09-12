import dotenv from 'dotenv';
dotenv.config();

export const {
  ACCESS_TOKEN,
  SECRET_TOKEN,
  MONGO_URI,
  FRONTEND_URL,
} = process.env;