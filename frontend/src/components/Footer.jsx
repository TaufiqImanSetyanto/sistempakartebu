import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white mt-8 pt-8 pb-4">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-lg font-semibold mb-2">Tentang Sistem</h3>
          <p className="opacity-90">SIPATE membantu petani dan pengguna dalam mendiagnosa penyakit tanaman tebu berdasarkan gejala yang muncul pada daun, batang, dan bagian lainnya.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Navigasi Cepat</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/diagnose" className="hover:underline">
                Diagnosa
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:underline">
                Login Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sumber Data</h3>
          <p className="opacity-90">
            Data penyakit dan penanganan diperoleh dari dokumen <span className="italic">"Buku Saku "Hama dan Penyakit Tebu" & Buku Saku Pengelolaan OPT Tanaman Tebu (revisi 1)"</span>.
          </p>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs opacity-80">&copy; {new Date().getFullYear()} SIPATE. Dibuat dengan ❤️ oleh Kelompok Hokya.</div>
    </footer>
  );
}
