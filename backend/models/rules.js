import mongoose from "mongoose";

const rulesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  conditions: [
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
});

const rules = mongoose.model("Rules", rulesSchema);
export default rules;
