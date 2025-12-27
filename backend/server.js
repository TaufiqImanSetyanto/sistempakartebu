import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import diagnoseRoutes from "./routes/diagnoseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { protectAdmin } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", diagnoseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", protectAdmin, adminRoutes);

app.get("/", (req, res) => res.send("Sistem Pakar Penyakit Tebu API is running."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
