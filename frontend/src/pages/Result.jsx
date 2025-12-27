import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.data;
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <p>Belum ada hasil diagnosa. Silakan lakukan diagnosa terlebih dahulu.</p>
            <div className="mt-4">
              <Link to="/diagnose" className="bg-[var(--primary)] text-white px-4 py-2 rounded">
                Diagnosa
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const generatePDF = () => {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-[var(--primary)] mb-3">Hasil Diagnosa</h2>

          <p className="text-gray-700 mb-2">
            <span className="font-medium">Nama Pengguna :</span> {result.userName}
          </p>
          <h3 className="text-gray-700 font-medium mb-2">Gejala yang Dipilih</h3>
          <ul className="list-disc pl-5 text-gray-700 mb-2">
            {result.selectedSymptoms?.map((s, i) => (
              <li key={i}>{typeof s === "string" ? s : s.symptom}</li>
            ))}
          </ul>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Kemungkinan Penyakit : </span>
            {result.diagnosis?.disease || "Tidak Diketahui"}
          </p>

          <p className="text-gray-700 mb-2">
            <span className="font-medium">Tingkat Keyakinan : </span>
            {result.confidence ? `${result.confidence.toFixed(2)}%` : "—"}
          </p>

          <h3 className="text-lg font-medium mt-4">Penanganan:</h3>
          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{result.diagnosis?.solution}</p>
        </section>

        <div className="mt-6 flex gap-4 justify-center">
          <button onClick={generatePDF} className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90 transition">
            Cetak PDF
          </button>

          <button onClick={() => navigate("/diagnose")} className="px-4 py-2 text-[var(--primary)] border-2 border-[var(--primary)] rounded hover:bg-[var(--primary)] hover:text-white transition">
            Diagnosa Lagi
          </button>
          <Link to="/" className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:opacity-90 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
