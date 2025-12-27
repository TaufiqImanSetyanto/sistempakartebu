import mongoose from "mongoose";

const symptomsSchema = new mongoose.Schema({
  id: { type: String, required: true },
  symptom: { type: String, required: true },
  category: { type: String, enum: ["Daun", "Batang", "Lainnya"], required: true },
});

const symptoms = mongoose.model("Symptoms", symptomsSchema);
export default symptoms;
