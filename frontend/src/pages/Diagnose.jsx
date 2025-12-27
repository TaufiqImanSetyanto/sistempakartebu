import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SymptomCheckbox from "../components/SymptomCheckbox";
import { fetchSymptoms, diagnose } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Diagnose() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchSymptoms();
        setSymptoms(data);
      } catch (err) {
        console.error("Failed to fetch symptoms:", err);
      }
    };
    loadData();
  }, []);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const daun = symptoms.filter((s) => s.category === "Daun");
  const batang = symptoms.filter((s) => s.category === "Batang");
  const lainnya = symptoms.filter((s) => s.category === "Lainnya");

  const handleDiagnose = async () => {
    if (!userName) return alert("Masukkan nama Anda terlebih dahulu!");
    if (selected.length < 2) return alert("Pilih minimal 2 gejala!");

    try {
      const res = await diagnose({ userName, selectedSymptoms: selected });
      localStorage.setItem("last_result", JSON.stringify(res.data));
      navigate("/result", { state: res.data });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Diagnosis failed:", error);
      alert("Gagal melakukan diagnosa, coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">

        <section className="my-6">
          <h2 className="text-3xl font-semibold text-[var(--primary)]">Diagnosa Penyakit</h2>
          <p className="my-2 text-gray-700">Untuk memulai proses diagnosa, silakan masukkan nama Anda dan centang gejala yang terdapat pada daun, batang, atau bagian lainnya.</p>
          <p className="text-amber-500 font-semibold">Pengguna wajib mengisi nama dan memilih minimal 2 gejala!</p>
        </section>

        <div className="bg-white shadow-md rounded-md p-4 mb-6">
          <label htmlFor="userName" className="block font-medium mb-2 text-gray-700">
            Nama Pengguna:
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 shadow-md rounded bg-white">
            <h3 className="font-medium mb-3 text-[var(--primary)]">Daun</h3>
            <div className="flex flex-col gap-1">
              {daun.map((s) => (
                <SymptomCheckbox key={s._id} id={s.id} label={s.symptom} checked={selected.includes(s.id)} onChange={toggle} />
              ))}
            </div>
          </div>

          <div className="p-4 shadow-md rounded bg-white">
            <h3 className="font-medium mb-3 text-[var(--primary)]">Batang</h3>
            <div className="flex flex-col gap-1">
              {batang.map((s) => (
                <SymptomCheckbox key={s._id} id={s.id} label={s.symptom} checked={selected.includes(s.id)} onChange={toggle} />
              ))}
            </div>
          </div>

          <div className="p-4 shadow-md rounded bg-white">
            <h3 className="font-medium mb-3 text-[var(--primary)]">Lainnya</h3>
            <div className="flex flex-col gap-1">
              {lainnya.map((s) => (
                <SymptomCheckbox key={s._id} id={s.id} label={s.symptom} checked={selected.includes(s.id)} onChange={toggle} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={handleDiagnose} className="bg-[var(--primary)] text-white px-6 py-2 rounded hover:opacity-90 transition">
            Diagnosa
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
