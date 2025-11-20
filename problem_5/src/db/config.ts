
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/defaultdb";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI).then(() => {
            console.log("MongoDB connected successfully");
        });
        return connection;
    } catch (error) {
        throw error;
    }
};