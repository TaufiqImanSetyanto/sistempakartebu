import Symptoms from "../models/symptoms.js";
import Diseases from "../models/diseases.js";
import Rules from "../models/rules.js";
import Result from "../models/result.js";

/* ========== SYMPTOMS CRUD ========== */
export const getAllSymptoms = async (req, res) => {
  try {
    const data = await Symptoms.find().sort({ id: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSymptom = async (req, res) => {
  try {
    const { id, symptom, category } = req.body;
    const data = await Symptoms.create({ id, symptom, category });
    res.json({ message: "Symptom added successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const data = await Symptoms.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Symptom updated", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    await Symptoms.findByIdAndDelete(req.params.id);
    res.json({ message: "Symptom deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== DISEASES CRUD ========== */
export const getAllDiseases = async (req, res) => {
  try {
    const data = await Diseases.find().sort({ id: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDisease = async (req, res) => {
  try {
    const { id, disease, solution } = req.body;
    const data = await Diseases.create({ id, disease, solution });
    res.json({ message: "Disease added successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDisease = async (req, res) => {
  try {
    const data = await Diseases.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Disease updated", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDisease = async (req, res) => {
  try {
    await Diseases.findByIdAndDelete(req.params.id);
    res.json({ message: "Disease deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== RULES CRUD ========== */
export const getAllRules = async (req, res) => {
  try {
    const data = await Rules.find().populate("conditions", "id symptom").populate("diagnosis", "id disease solution");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addRule = async (req, res) => {
  try {
    const { id, conditions, diagnosis } = req.body;
    if (!conditions || conditions.length < 2) {
      return res.status(400).json({ message: "Minimal dua kondisi diperlukan!" });
    }
    if (!diagnosis) {
      return res.status(400).json({ message: "Diagnosis tidak boleh kosong!" });
    }

    const data = await Rules.create({ id, conditions, diagnosis });
    res.json({ message: "Rule added successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRule = async (req, res) => {
  try {
    const data = await Rules.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Rule updated", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRule = async (req, res) => {
  try {
    await Rules.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========== RESULTS VIEW ========== */
export const getAllResults = async (req, res) => {
  try {
    const data = await Result.find().populate("selectedSymptoms", "id symptom").populate("diagnosis", "id disease solution").sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
