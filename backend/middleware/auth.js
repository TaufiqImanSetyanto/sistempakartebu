import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import dotenv from "dotenv";

dotenv.config();

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token tidak valid!" });
    }
  }

  if (!token) return res.status(401).json({ message: "Akses ditolak, tidak ada token!" });
};
