import mongoose from "mongoose";

const diseasesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  disease: { type: String, required: true },
  solution: { type: String, required: true },
});

const diseases = mongoose.model("Diseases", diseasesSchema);
export default diseases;
