import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/admin/LayoutAdmin";
import { getRules, getSymptoms, getDiseases, addRule, updateRule, deleteRule } from "../../api/apiAdmin";

export default function DataAturan() {
  const [rules, setRules] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    id: "",
    conditions: [],
    diagnosis: "",
  });
  const [loading, setLoading] = useState(false);

  const MODAL_TITLE = editData ? "Edit Aturan" : "Tambah Aturan";

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [rRes, sRes, dRes] = await Promise.all([
        getRules(),
        getSymptoms(),
        getDiseases(),
      ]);
      setRules(rRes.data);
      setSymptoms(sRes.data);
      setDiseases(dRes.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Terjadi kesalahan saat memuat data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCondition = (id) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter((x) => x !== id)
        : [...prev.conditions, id],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateRule(editData._id, form);
      } else {
        await addRule(form);
      }
      handleCloseModal();
      fetchAllData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data aturan!");
    }
  };

  const handleEdit = (rule) => {
    setEditData(rule);
    setForm({
      id: rule.id,
      conditions: rule.conditions.map((c) => c._id),
      diagnosis: rule.diagnosis?._id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus aturan ini?")) return;
    try {
      await deleteRule(id);
      fetchAllData();
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
    setForm({ id: "", conditions: [], diagnosis: "" });
  };

  const filteredRules = rules.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis?.disease.toLowerCase().includes(search.toLowerCase())
  );

  const renderTableRow = (rule) => (
    <tr key={rule._id} className="hover:bg-gray-50 transition-colors">
      <td className="border px-3 py-2 text-center font-mono">{rule.id}</td>
      <td className="border px-3 py-2 text-sm">
        {rule.conditions.map((c) => c.symptom).join(", ")}
      </td>
      <td className="border px-3 py-2 text-center">{rule.diagnosis?.disease}</td>
      <td className="border px-3 py-2 text-center">
        <button
          onClick={() => handleEdit(rule)}
          className="bg-yellow-500 text-white px-3 py-1 rounded-md cursor-pointer m-1"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(rule._id)}
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
        {loading ? "Memuat data..." : "Tidak ada data ditemukan"}
      </td>
    </tr>
  );

  return (
    <LayoutAdmin title="Data Aturan">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari kode aturan atau penyakit..."
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
                <th className="py-3 px-4 border font-semibold">Kondisi Gejala</th>
                <th className="py-3 px-4 border font-semibold">Diagnosis</th>
                <th className="py-3 px-4 border font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map(renderTableRow)}
              {filteredRules.length === 0 && renderEmptyState()}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{MODAL_TITLE}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Aturan</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Contoh: R01"
                  value={form.id}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Gejala</label>
                <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
                  {symptoms.map((s) => (
                    <label key={s._id} className="flex items-center gap-2 text-sm py-1">
                      <input
                        type="checkbox"
                        checked={form.conditions.includes(s._id)}
                        onChange={() => toggleCondition(s._id)}
                      />
                      {s.id} - {s.symptom}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <select
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleInputChange}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                >
                  <option value="">Pilih Penyakit</option>
                  {diseases.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.id} - {d.disease}
                    </option>
                  ))}
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
