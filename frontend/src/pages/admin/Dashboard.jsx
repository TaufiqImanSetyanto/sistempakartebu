import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { getDiseases, getSymptoms, getRules, getResults } from "../../api/apiAdmin";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    diseases: 0,
    symptoms: 0,
    rules: 0,
    results: 0,
  });
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [diseaseRes, symptomRes, ruleRes, resultRes] = await Promise.all([getDiseases(), getSymptoms(), getRules(), getResults()]);

      setSummary({
        diseases: diseaseRes.data.length,
        symptoms: symptomRes.data.length,
        rules: ruleRes.data.length,
        results: resultRes.data.length,
      });
      setRecentResults(resultRes.data.reverse().slice(-5).reverse());
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
      alert("Terjadi kesalahan saat memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <LayoutAdmin title="Dashboard Admin">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Data SIPATE</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--primary)] text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Penyakit</h3>
            <p className="text-3xl font-bold">{summary.diseases}</p>
          </div>

          <div className="bg-green-600 text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Gejala</h3>
            <p className="text-3xl font-bold">{summary.symptoms}</p>
          </div>

          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Aturan</h3>
            <p className="text-3xl font-bold">{summary.rules}</p>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Konsultasi</h3>
            <p className="text-3xl font-bold">{summary.results}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Konsultasi Terbaru</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[var(--primary)] text-white">
              <tr>
                <th className="py-3 px-4 border font-semibold">Nama Pengguna</th>
                <th className="py-3 px-4 border font-semibold">Diagnosa Penyakit</th>
                <th className="py-3 px-4 border font-semibold">Kepastian</th>
                <th className="py-3 px-4 border font-semibold">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : recentResults.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Belum ada konsultasi.
                  </td>
                </tr>
              ) : (
                recentResults.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-3 py-2 text-center">{r.userName}</td>
                    <td className="border px-3 py-2 text-center">{r.diagnosis?.disease || "-"}</td>
                    <td className="border px-3 py-2 text-center">{r.confidence?.toFixed(2)}%</td>
                    <td className="border px-3 py-2 text-center text-gray-600 text-sm">{new Date(r.createdAt).toLocaleString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutAdmin>
  );
}
