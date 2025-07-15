import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import DataConnect from "./config/DataConnect.js"; // Ensure this path is correct
dotenv.config();
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { connectCloudinary } from "./config/cloudinary.js";

import { scheduleDailyUpdates } from "./cronJobs/dailyUpdater.js";

const app = express();

await connectCloudinary();
// allow multiple origins

//middlewares
app.use(cors({
  origin: "http://localhost:5173", // ✅ must match Vite dev URL
  credentials: true, // ✅ allows cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());

// Api endpoints
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);



// 🔁 Start daily scheduled task


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  DataConnect();
  scheduleDailyUpdates();
  console.log(`Server is running on port ${PORT}`);
});