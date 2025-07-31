// config/connectDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connected.connection.host}`);
    } catch (error) {
        console.error(`Database Connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;