import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/forms",
  PORT: Number(process.env.PORT) || 3000,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/default"
};
