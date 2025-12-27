import Rules from "../models/rules.js";
import Symptoms from "../models/symptoms.js";
import Diseases from "../models/diseases.js";
import Result from "../models/result.js";

export const getSymptoms = async (req, res) => {
  try {
  const symptoms = await Symptoms.find().select("id symptom category");
    res.status(200).json(symptoms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch symptoms", error });
  }
};

export const getDiseases = async (req, res) => {
  try {
    const diseases = await Diseases.find().select("id disease solution");
    res.status(200).json(diseases);
  } catch (error) {
    console.error("Error fetching diseases:", error);
    res.status(500).json({ message: "Failed to fetch diseases" });
  }
};

export const diagnose = async (req, res) => {
  try {
    const { userName, selectedSymptoms } = req.body;

    if (!selectedSymptoms || selectedSymptoms.length < 2) {
      return res.status(400).json({ message: "Pilih minimal dua gejala!" });
    }

    const rules = await Rules.find().populate("conditions").populate("diagnosis");

    let results = [];

    for (const rule of rules) {
      const ruleSymptomIds = rule.conditions.map((s) => s.id);
      const matched = ruleSymptomIds.filter((sid) => selectedSymptoms.includes(sid));

      const matchPercent = (matched.length / ruleSymptomIds.length) * 100;

      if (matched.length > 0) {
        results.push({
          ruleId: rule.id,
          disease: rule.diagnosis,
          matchedSymptoms: matched,
          totalSymptoms: ruleSymptomIds.length,
          confidence: matchPercent,
        });
      }
    }

    results.sort((a, b) => b.confidence - a.confidence);

    if (results.length === 0) {
      return res.status(200).json({
        message: "Tidak ada penyakit yang cocok dengan gejala tersebut.",
        results: [],
      });
    }

    const bestMatch = results[0];

    const symptomList = await Symptoms.find({ id: { $in: selectedSymptoms } });

    const savedResult = new Result({
      userName,
      selectedSymptoms: symptomList.map((s) => s._id),
      diagnosis: bestMatch.disease._id,
      confidence: bestMatch.confidence,
    });

    await savedResult.save();

    const populatedResult = await Result.findById(savedResult._id).populate("selectedSymptoms").populate("diagnosis");

    res.status(200).json({
      message: "Diagnosis berhasil dilakukan dan disimpan.",
      data: populatedResult,
    });
  } catch (error) {
    console.error("❌ Error in diagnose:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
