import mongoose from "mongoose";
import dotenv from "dotenv";
import { envConfig } from "./config.js";

dotenv.config();

export async function connectDB() {
    try{
        await mongoose.connect(envConfig.MONGO_URL);
        console.log("Connected to DB");
    } catch(err){
        console.log('error connecting DB', err);
    }
}