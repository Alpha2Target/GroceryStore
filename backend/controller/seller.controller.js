import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js";
import bcrypt from "bcryptjs";

// ✅ REGISTER SELLER - POST /api/seller/register
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({
        message: "Email already in use",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // Set to false if you plan to add email verification later
    });

    const sellerToken = jwt.sign(
      { sellerId: newSeller._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", sellerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Seller account created",
      success: true,
      seller: {
        _id: newSeller._id,
        name: newSeller.name,
        email: newSeller.email,
      },
    });
  } catch (error) {
    console.error("Error in registerSeller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ LOGIN SELLER - POST /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller || !seller.isVerified) {
      return res.status(404).json({
        message: "Seller not found or not verified",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const sellerToken = jwt.sign(
      { sellerId: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", sellerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ CHECK AUTH - GET /api/seller/is-auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ LOGOUT - GET /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
