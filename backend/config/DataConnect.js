// backend/config/connectDB.js or backend/utils/connectDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("❌ Please provide MONGODB_URI in the .env file");
}

const DataConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    console.log("MongoDB URI:", process.env.MONGO_URI); // Log the MongoDB URI
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default DataConnect; // ✅ use default export