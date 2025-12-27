# SIPATE - Sistem Pakar Penyakit Tebu

SIPATE adalah aplikasi web untuk membantu petani dan pengguna dalam mendiagnosa penyakit tanaman tebu berdasarkan gejala yang muncul. Sistem ini menggunakan metode Forward Chaining untuk diagnosis dan rekomendasi penanganan.

## ✨ Fitur Utama

- Diagnosa penyakit tebu berbasis gejala
- Manajemen data penyakit, gejala, aturan, dan riwayat konsultasi (admin)
- Cetak hasil diagnosa ke PDF
- Dashboard admin ringkasan data

## 🧠 Metode Forward Chaining

Alur kerja sistem pakar pada aplikasi SIPATE adalah sebagai berikut:

1. Pengguna memilih gejala yang dialami tanaman tebu
2. Gejala dianggap sebagai fakta awal
3. Sistem mencocokkan fakta dengan aturan IF–THEN
4. Sistem menarik kesimpulan berupa jenis penyakit
5. Sistem menampilkan hasil diagnosa dan rekomendasi penanganan

## 🛠️ Teknologi

### Frontend

- React, Vite, Tailwind CSS, Axios, React Router

### Backend

- Node.js, Express.js, MongoDB, Mongoose, JWT

## 🚀 Instalasi & Penggunaan

### Prasyarat

- Node.js (disarankan versi terbaru)
- Akun MongoDB Atlas (atau MongoDB lokal jika diinginkan)

### 1. Clone Repository

```bash
git clone https://github.com/TaufiqImanSetyanto/sistempakartebu
cd sistempakartebu
```

### 2. Setup MongoDB Atlas (Cloud)

1. Daftar di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) dan login.
2. Buat Cluster baru (gratis tier cukup untuk development).
3. Buat database user dan whitelist IP (0.0.0.0/0 untuk akses global/development).
4. Dapatkan connection string (contoh: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`).

### 3. Setup Backend

```bash
cd backend
npm install
```

- Buat file `.env` di folder `backend/` dan isi dengan:
  ```env
  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Pastikan file konfigurasi database (`backend/config/db.js`) membaca dari variabel environment `MONGODB_URI`.
- Jalankan seed data:
  ```bash
  node seed.js
  ```
- Jalankan server backend:
  ```bash
  node server.js
  ```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend akan berjalan di [http://localhost:5173](http://localhost:5173) (default Vite).

### 5. Konfigurasi Environment

- Pastikan URI MongoDB di backend sudah benar (gunakan Atlas jika ingin cloud, atau MongoDB lokal jika di komputer sendiri).
- Ubah endpoint API di frontend jika backend tidak berjalan di `localhost:5000`.

## 📁 Struktur Direktori

```
.
├── backend/
│   ├── config/
│   │   └── db.js           
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── diagnoseController.js
│   ├── middleware/
│   │   └── auth.js      
│   ├── models/
│   │   ├── admin.js
│   │   ├── diseases.js
│   │   ├── result.js
│   │   ├── rules.js
│   │   └── symptoms.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── diagnoseRoutes.js
│   ├── seed.js           
│   └── server.js         
└── frontend/
  ├── public/              
  ├── src/
  │   ├── api/
  │   │   ├── api.js
  │   │   └── apiAdmin.js
  │   ├── components/
  │   │   ├── DiseaseCard.jsx
  │   │   ├── Footer.jsx
  │   │   ├── Header.jsx
  │   │   ├── SymptomCheckbox.jsx
  │   │   └── admin/
  │   │       ├── HeaderAdmin.jsx
  │   │       ├── LayoutAdmin.jsx
  │   │       └── SidebarAdmin.jsx
  │   ├── context/
  │   │   └── AdminAuth.jsx
  │   └── pages/
  │       ├── Diagnose.jsx
  │       ├── Home.jsx
  │       ├── Result.jsx
  │       └── admin/
  │           ├── Dashboard.jsx
  │           ├── DataAturan.jsx
  │           ├── DataGejala.jsx
  │           ├── DataPenyakit.jsx
  │           ├── Login.jsx
  │           └── RekapKonsultasi.jsx
  ├── index.css
  ├── index.html
  ├── vite.config.js       
  ├── eslint.config.js    
  └── package.json
```

## 👤 Admin Default

- Username: admin
- Password: admin

⚠️ Catatan

Aplikasi SIPATE merupakan sistem pendukung keputusan dan bukan pengganti pakar pertanian secara langsung.

## 📄 Lisensi

MIT

---

> SIPATE dikembangkan untuk membantu petani tebu dalam mengidentifikasi penyakit secara cepat dan akurat.
