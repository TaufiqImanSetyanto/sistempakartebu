import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { fetchDiseases } from "../api/api";
import DiseaseCard from "../components/DiseaseCard";

export default function Home() {
  const [diseases, setDiseases] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchDiseases();
        setDiseases(data);
      } catch (err) {
        console.error("Failed to fetch diseases:", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="text-center">
          <h2 className="md:text-6xl text-4xl font-semibold my-4">
            Selamat Datang Di <br /> SIPATE
          </h2>
          <p className="text-md text-gray-600 mb-6">Sistem untuk mendiagnosa penyakit tebu berdasarkan gejala daun, batang, dan lainnya.</p>
          <Link to="/diagnose" className="inline-block bg-[var(--primary)] text-white px-6 py-2 rounded shadow">
            Diagnosa
          </Link>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-medium mb-3">Jenis - Jenis Penyakit</h3>
          {diseases.length === 0 ? (
            <p className="text-gray-500">Memuat data penyakit...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {diseases.map((d) => (
                <DiseaseCard key={d.id} disease={d} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
