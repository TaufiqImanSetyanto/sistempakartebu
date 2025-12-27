import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { getDiseases, addDisease, updateDisease, deleteDisease } from "../../api/apiAdmin";

export default function DataPenyakit() {
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    id: "",
    disease: "",
    solution: "",
  });
  const [loading, setLoading] = useState(false);

  const MODAL_TITLE = editData ? "Edit Penyakit" : "Tambah Penyakit";
  const filteredDiseases = diseases.filter((disease) => disease.disease.toLowerCase().includes(search.toLowerCase()) || disease.id.toLowerCase().includes(search.toLowerCase()));

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await getDiseases();
      setDiseases(response.data);
    } catch (error) {
      console.error("Gagal mengambil data penyakit:", error);
      alert("Terjadi kesalahan saat mengambil data penyakit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
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
        await updateDisease(editData._id, form);
      } else {
        await addDisease(form);
      }      
      handleCloseModal()
      fetchDiseases();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data!");
    }
  };

  const handleEdit = (disease) => {
    setEditData(disease);
    setForm({
      id: disease.id,
      disease: disease.disease,
      solution: disease.solution,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await deleteDisease(id);
      fetchDiseases();
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
    setForm({ id: "", disease: "", solution: "" });
  };

  const renderTableRow = (disease) => (
    <tr key={disease._id} className="hover:bg-gray-50 transition-colors">
      <td className="border px-3 py-2 text-center font-mono">{disease.id}</td>
      <td className="border px-3 py-2">{disease.disease}</td>
      <td className="border px-3 py-2 text-sm text-gray-700">{disease.solution}</td>
      <td className="border px-3 py-2 text-center">
        <button onClick={() => handleEdit(disease)} className="bg-yellow-500 text-white px-3 py-1 rounded-md cursor-pointer m-1">
          Edit
        </button>
        <button onClick={() => handleDelete(disease._id)} className="bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer m-1">
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
    <LayoutAdmin title="Data Penyakit">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari penyakit atau kode..."
            className="border border-gray-300 px-4 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="bg-[var(--primary)] cursor-pointer text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
            <span>+</span>
            <span>Tambah Data</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-[var(--primary)] text-white">
              <tr>
                <th className="py-3 px-4 border font-semibold">Kode</th>
                <th className="py-3 px-4 border font-semibold">Nama Penyakit</th>
                <th className="py-3 px-4 border font-semibold">Penanganan</th>
                <th className="py-3 px-4 border font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiseases.map(renderTableRow)}
              {filteredDiseases.length === 0 && renderEmptyState()}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Penyakit</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Contoh: P01"
                  value={form.id}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penyakit</label>
                <input
                  type="text"
                  name="disease"
                  placeholder="Masukkan nama penyakit"
                  value={form.disease}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penanganan</label>
                <textarea
                  name="solution"
                  placeholder="Masukkan penanganan penyakit"
                  value={form.solution}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  rows="4"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="bg-[var(--primary)] text-white px-4 py-2 rounded cursor-pointer">
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
