import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure req.user._id is consistently available, regardless of JWT payload structure
    const user = await userModel.findById(decoded.id || decoded._id).select("_id");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const user = await userModel.findById(userId).select("role");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== 1) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only" });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
