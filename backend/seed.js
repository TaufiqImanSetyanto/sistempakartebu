import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Symptoms from "./models/symptoms.js";
import Diseases from "./models/diseases.js";
import Rules from "./models/rules.js";

dotenv.config();
await connectDB();

const symptomsData = [
  { id: "G01", symptom: "Daun muda berubah bentuk menyerupai cambuk", category: "Daun" },
  { id: "G02", symptom: "Daun mengecil seperti rumput", category: "Daun" },
  { id: "G03", symptom: "Daun tampak belang/mosaik hijau muda dan hijau tua", category: "Daun" },
  { id: "G04", symptom: "Garis-garis klorosis memanjang, lebih jelas di daun muda", category: "Daun" },
  { id: "G05", symptom: "Daun terdapat garis atau jalur klorosis lurus sejajar tulang daun", category: "Daun" },
  { id: "G06", symptom: "Daun mengering", category: "Daun" },
  { id: "G07", symptom: "Daun pucuk (daun muda) menguning (klorosis)", category: "Daun" },
  { id: "G08", symptom: "Muncul bintik nekrosis berwarna merah/coklat di pangkal daun", category: "Daun" },
  { id: "G09", symptom: "Permukaan bawah daun terasa kasar kalau diraba", category: "Daun" },
  { id: "G10", symptom: "Warna jingga kemerahan pada berkas pembuluh batang tebu", category: "Batang" },
  { id: "G11", symptom: "Ruas batang menjadi pendek, bengkok, dan berongga", category: "Batang" },
  { id: "G12", symptom: "Terdapat garis-garis coklat di batang", category: "Batang" },
  { id: "G13", symptom: "Batang bagian dalam kemerahan dengan pewarnaan hitam di tengah", category: "Batang" },
  { id: "G14", symptom: "Jika dibelah, berbau seperti nenas", category: "Batang" },
  { id: "G15", symptom: "Tanaman tampak kerdil", category: "Lainnya" },
  { id: "G16", symptom: "Muncul siwilan (tunas samping), hingga tanaman mati", category: "Lainnya" },
  { id: "G17", symptom: "Titik tumbuh busuk", category: "Lainnya" },
  { id: "G18", symptom: "Benih terserang tidak tumbuh", category: "Lainnya" },
  { id: "G19", symptom: "Bercak coklat kemerahan seperti karat", category: "Lainnya" },
  { id: "G20", symptom: "Pembusukan dari daun ke batang", category: "Lainnya" },
];

const diseasesData = [
  {
    id: "P01",
    disease: "Luka Api",
    solution:
      "Penanaman varietas tebu yang tahan penyakit luka api, seperti KK dan PS'862. Pemusnahan rumpun tebu berpenyakit Luka Api. Penggunaan bibit sehat dengan perendaman dalam larutan Bayleton 250 EC selama 2 jam (2 ml/liter air). Hindari membawa tanaman sakit ke daerah lain yang belum terserang.",
  },
  {
    id: "P02",
    disease: "Rantoon Stunting Disease",
    solution: "Gunakan bibit sehat melalui perawatan air panas 50°C selama 2 jam pada bibit di tingkat KBN dan KBI. Desinfeksi alat dan pisau pemotong bibit dengan larutan Lysol 20% atau disinfektan lain.",
  },
  {
    id: "P03",
    disease: "Mozaik",
    solution:
      "Gunakan varietas tebu tahan penyakit mozaik. Gunakan bibit sehat dengan menyeleksi kebun bibit sebulan sekali. Jika tingkat serangan ≤ 5 %, dapat digunakan sebagai kebun bibit, dengan syarat rumpun sakit dimusnahkan. Jika tingkat serangan > 5 %, kebun bibit diganti katagorinya menjadi kebun tebu giling. Bersihkan kebun dari gulma.",
  },
  {
    id: "P04",
    disease: "Blendok",
    solution: "Gunakan varietas tebu tahan penyakit Blendok. Gunakan bibit sehat dari perawatan air panas (perendaman 48 jam air mengalir dilanjut 2 jam di 50°C). Desinfeksi pisau pemotong bibit dengan Lysol 15–20%.",
  },
  {
    id: "P05",
    disease: "Pokahbung",
    solution: "Gunakan varietas tahan penyakit Pokahbung. Lakukan sanitasi kebun untuk menekan perkembangan jamur penyebab. Penggunaan fungisida belum dianjurkan karena tidak ekonomis.",
  },
  {
    id: "P06",
    disease: "Busuk Batang Nenas",
    solution: "Rendam benih dengan fungisida berbahan aktif propakonazol atau triadimenol atau prokloraz. Jaga kebersihan dan sanitasi kebun.",
  },
  {
    id: "P07",
    disease: "Karat",
    solution: "Gunakan varietas tebu tahan penyakit karat. Lakukan sanitasi kebun untuk menurunkan kelembapan. Jika serangan parah, semprot fungisida seperti mankozeb, propikonazol, atau azoksistrobin.",
  },
];

const rulesMapping = [
  { id: "R01", conditions: ["G01", "G02"], diagnosis: "P01" },
  { id: "R02", conditions: ["G10", "G15"], diagnosis: "P02" },
  { id: "R03", conditions: ["G03", "G04", "G15"], diagnosis: "P03" },
  { id: "R04", conditions: ["G05", "G06", "G16"], diagnosis: "P04" },
  { id: "R05", conditions: ["G07", "G08", "G11", "G12", "G17", "G20"], diagnosis: "P05" },
  { id: "R06", conditions: ["G13", "G18", "G14"], diagnosis: "P06" },
  { id: "R07", conditions: ["G19", "G09"], diagnosis: "P07" },
];

const seedAll = async () => {
  try {
    await Symptoms.deleteMany();
    await Diseases.deleteMany();
    await Rules.deleteMany();

    const insertedSymptoms = await Symptoms.insertMany(symptomsData);
    const insertedDiseases = await Diseases.insertMany(diseasesData);

    const symptomMap = Object.fromEntries(insertedSymptoms.map((s) => [s.id, s._id]));
    const diseaseMap = Object.fromEntries(insertedDiseases.map((d) => [d.id, d._id]));

    const rulesData = rulesMapping.map((rule) => ({
      id: rule.id,
      conditions: rule.conditions.map((gid) => symptomMap[gid]),
      diagnosis: diseaseMap[rule.diagnosis],
    }));

    await Rules.insertMany(rulesData);

    console.log("🌾 All collections seeded successfully with references!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedAll();
