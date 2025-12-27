import express from "express";
import {
  getAllSymptoms,
  addSymptom,
  updateSymptom,
  deleteSymptom,
  getAllDiseases,
  addDisease,
  updateDisease,
  deleteDisease,
  getAllRules,
  addRule,
  updateRule,
  deleteRule,
  getAllResults,
  deleteResult,
} from "../controllers/adminController.js";

const router = express.Router();

// SYMPTOMS
router.get("/symptoms", getAllSymptoms);
router.post("/symptoms", addSymptom);
router.put("/symptoms/:id", updateSymptom);
router.delete("/symptoms/:id", deleteSymptom);

// DISEASES
router.get("/diseases", getAllDiseases);
router.post("/diseases", addDisease);
router.put("/diseases/:id", updateDisease);
router.delete("/diseases/:id", deleteDisease);

// RULES
router.get("/rules", getAllRules);
router.post("/rules", addRule);
router.put("/rules/:id", updateRule);
router.delete("/rules/:id", deleteRule);

// RESULTS
router.get("/results", getAllResults);
router.delete("/results/:id", deleteResult);

export default router;
