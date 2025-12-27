import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { getSymptoms, addSymptom, updateSymptom, deleteSymptom } from "../../api/apiAdmin";

export default function DataGejala() {
  const [symptoms, setSymptoms] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ 
    id: "", 
    symptom: "", 
    category: "" 
  });
  const [loading, setLoading] = useState(false);

  const MODAL_TITLE = editData ? "Edit Gejala" : "Tambah Gejala";
  const filteredSymptoms = symptoms.filter((symptom) => 
    symptom.symptom.toLowerCase().includes(search.toLowerCase()) || 
    symptom.id.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      const response = await getSymptoms();
      setSymptoms(response.data);
    } catch (error) {
      console.error("Gagal mengambil data gejala:", error);
      alert("Terjadi kesalahan saat mengambil data gejala");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateSymptom(editData._id, form);
      } else {
        await addSymptom(form);
      }
      handleCloseModal();
      fetchSymptoms();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data!");
    }
  };

  const handleEdit = (symptom) => {
    setEditData(symptom);
    setForm({
      id: symptom.id,
      symptom: symptom.symptom,
      category: symptom.category,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await deleteSymptom(id);
      fetchSymptoms();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({ id: "", symptom: "", category: "" });
  };

  const renderTableRow = (symptom) => (
    <tr key={symptom._id} className="hover:bg-gray-50 transition-colors">
      <td className="border px-3 py-2 text-center font-mono">{symptom.id}</td>
      <td className="border px-3 py-2">{symptom.symptom}</td>
      <td className="border px-3 py-2 text-center">{symptom.category}</td>
      <td className="border px-3 py-2 text-center">
        <button 
          onClick={() => handleEdit(symptom)} 
          className="bg-yellow-500 text-white px-3 py-1 rounded-md cursor-pointer m-1"
        >
          Edit
        </button>
        <button 
          onClick={() => handleDelete(symptom._id)} 
          className="bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer m-1"
        >
          Hapus
        </button>
      </td>
    </tr>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan="4" className="text-center py-6 text-gray-500">
        {loading ? "Memuat data..." : "Tidak ada data yang ditemukan"}
      </td>
    </tr>
  );

  return (
    <LayoutAdmin title="Data Gejala">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari gejala atau kode..."
            className="border border-gray-300 px-4 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-[var(--primary)] cursor-pointer text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Tambah Data</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[var(--primary)] text-white">
              <tr>
                <th className="py-3 px-4 border font-semibold">Kode</th>
                <th className="py-3 px-4 border font-semibold">Nama Gejala</th>
                <th className="py-3 px-4 border font-semibold">Kategori</th>
                <th className="py-3 px-4 border font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSymptoms.map(renderTableRow)}
              {filteredSymptoms.length === 0 && renderEmptyState()}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{MODAL_TITLE}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Gejala
                </label>
                <input
                  type="text"
                  name="id"
                  placeholder="Contoh: G01"
                  value={form.id}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Gejala
                </label>
                <textarea
                  name="symptom"
                  placeholder="Masukkan nama gejala"
                  value={form.symptom}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Daun">Daun</option>
                  <option value="Batang">Batang</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-[var(--primary)] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}