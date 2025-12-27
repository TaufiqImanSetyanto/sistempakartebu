import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  selectedSymptoms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Symptoms",
      required: true,
    },
  ],
  diagnosis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diseases",
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Result = mongoose.model("Result", resultSchema);
export default Result;
