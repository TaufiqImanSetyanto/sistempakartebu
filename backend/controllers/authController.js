import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan!" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Password salah!" });

    const token = generateToken(admin._id);
    res.json({
      message: "Login berhasil!",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
