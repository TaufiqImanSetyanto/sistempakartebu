import express from "express";
import { getSymptoms, getDiseases, diagnose } from "../controllers/diagnoseController.js";
const router = express.Router();

router.get("/symptoms", getSymptoms);
router.get("/diseases", getDiseases);
router.post("/diagnose", diagnose);

export default router;
