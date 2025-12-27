import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { getResults, deleteResult } from "../../api/apiAdmin";
import jsPDF from "jspdf";

export default function RekapKonsultasi() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await getResults();
      setResults(response.data);
    } catch (error) {
      console.error("Gagal mengambil data rekap:", error);
      alert("Terjadi kesalahan saat mengambil data rekap konsultasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus riwayat konsultasi ini?")) return;
    try {
      await deleteResult(id);
      fetchResults();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    }
  };

  const filteredResults = results.filter((r) => r.userName.toLowerCase().includes(search.toLowerCase()) || r.diagnosis?.disease?.toLowerCase().includes(search.toLowerCase()));

  const renderTableRow = (r) => (
    <tr key={r._id} className="hover:bg-gray-50 transition-colors">
      <td className="border px-3 py-2 text-center">{r.userName}</td>
      <td className="border px-3 py-2 text-sm">{r.selectedSymptoms.map((s) => s.symptom).join(", ")}</td>
      <td className="border px-3 py-2 text-center">{r.diagnosis?.disease}</td>
      <td className="border px-3 py-2 text-center">{r.confidence?.toFixed(2)}%</td>
      <td className="border px-3 py-2 text-center text-sm">{new Date(r.createdAt).toLocaleString("id-ID")}</td>
      <td className="border px-3 py-2 text-center">
        <button onClick={() => generatePDF(r)} className="bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer mr-2">
          Print
        </button>

        <button onClick={() => handleDelete(r._id)} className="bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer">
          Hapus
        </button>
      </td>
    </tr>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan="6" className="text-center py-6 text-gray-500">
        {loading ? "Memuat data..." : "Tidak ada data konsultasi ditemukan"}
      </td>
    </tr>
  );

const generatePDF = (result) => {
  if (!result) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const colors = {
    primary: [30, 58, 138],   
    secondary: [239, 246, 255], 
    accent: [255, 152, 0],     
    textDark: [33, 33, 33],
    textLight: [117, 117, 117],
  };

  let y = 0;


  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("LAPORAN DIAGNOSA", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("SIPATE", pageWidth / 2, 28, { align: "center" });

  y = 55;

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, y, pageWidth - 30, 30, 3, 3, "S");

  doc.setTextColor(...colors.textLight);
  doc.setFontSize(10);
  doc.text("Nama Pengguna:", 20, y + 10);
  doc.text("Tanggal Pemeriksaan:", 120, y + 10);

  doc.setTextColor(...colors.textDark);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(result.userName || "Guest", 20, y + 18);

  const dateObj = new Date(result.createdAt || new Date());
  const dateStr = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(dateStr, 120, y + 18);

  y += 50;

  doc.setFontSize(14);
  doc.setTextColor(...colors.primary);
  doc.text("HASIL ANALISA SIPATE", 15, y);

  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, 70, y + 2);

  y += 15;

  doc.setTextColor(...colors.textDark);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(result.diagnosis.disease, 15, y);

  y += 10;
  

  const confidenceVal = result.confidence || 0;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.textLight);
  doc.text(`Tingkat Keyakinan Sistem: ${confidenceVal.toFixed(2)}%`, 15, y - 2);

  doc.setFillColor(230, 230, 230);
  doc.roundedRect(15, y, 100, 6, 2, 2, "F");


  if (confidenceVal > 70) doc.setFillColor(...colors.primary);
  else if (confidenceVal > 40) doc.setFillColor(...colors.accent);
  else doc.setFillColor(200, 50, 50);

  const fillWidth = (confidenceVal / 100) * 100;
  doc.roundedRect(15, y, fillWidth, 6, 2, 2, "F");

  y += 20;


  doc.setFontSize(12);
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Gejala Terdeteksi:", 15, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(...colors.textDark);
  doc.setFont("helvetica", "normal");

  result.selectedSymptoms.forEach((s) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }
    const symptomName = typeof s === "string" ? s : s.symptom;
    

    doc.setFillColor(...colors.primary); 
    doc.circle(18, y - 1, 1, "F");
    doc.text(symptomName, 22, y);
    y += 6;
  });

  y += 10;

  if (y > pageHeight - 60) {
    doc.addPage();
    y = 20;
  }


  doc.setFontSize(12);
  doc.setTextColor(...colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("Rekomendasi Penanganan:", 15, y);
  y += 5;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.textDark);

  const splitSolution = doc.splitTextToSize(result.diagnosis.solution, pageWidth - 40);
  const boxHeight = splitSolution.length * 6 + 5;

  doc.setFillColor(...colors.secondary);
  doc.setDrawColor(...colors.primary);
  doc.rect(15, y, pageWidth - 30, boxHeight, "F");
  doc.rect(15, y, pageWidth - 30, boxHeight, "S");

  doc.setLineWidth(2);
  doc.line(15, y, 15, y + boxHeight);
  doc.setLineWidth(0.1);

  doc.text(splitSolution, 20, y + 8);

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });

    doc.text("Dicetak otomatis oleh SIPATE", 15, pageHeight - 10);
  }

  const safeName = result.userName.replace(/\s+/g, "_");
  doc.save(`SIPATE_hasil_${safeName}.pdf`);
};

  return (
    <LayoutAdmin title="Rekap Konsultasi">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari nama pengguna atau penyakit..."
            className="border border-gray-300 px-4 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[var(--primary)] text-white">
              <tr>
                <th className="py-3 px-4 border font-semibold">Nama Pengguna</th>
                <th className="py-3 px-4 border font-semibold">Gejala Dipilih</th>
                <th className="py-3 px-4 border font-semibold">Diagnosa Penyakit</th>
                <th className="py-3 px-4 border font-semibold">Kepastian</th>
                <th className="py-3 px-4 border font-semibold">Tanggal</th>
                <th className="py-3 px-4 border font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(renderTableRow)}
              {filteredResults.length === 0 && renderEmptyState()}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutAdmin>
  );
}
