// backend/middleware/authUser.js
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally check token structure
    if (!decoded || !decoded.id) {
      throw new Error("Invalid token structure");
    }

    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

export default authUser;
