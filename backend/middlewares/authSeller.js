import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js"; // ✅ Ensure path is correct

export const authSeller = async (req, res, next) => {
  try {
    const sellerToken = req.cookies?.sellerToken;
    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.sellerId);

    if (!seller || !seller.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid or unverified seller",
      });
    }

    req.seller = seller; // Attach seller to req for use in route handlers
    next();
  } catch (error) {
    console.error("authSeller error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
