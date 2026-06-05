# ADUIN — Analisis Digital Untuk Insight Nusantara

<div align="center">

  <h3>Platform NLP Pengaduan Masyarakat untuk Pemerintah Daerah Bali</h3>
  <p>Capstone Project CC26-PSU299 · Tema: Inclusive & Resilient Communities</p>
  <p>Dicoding — Coding Camp 2026</p>

  <br/>

  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat&logo=postgresql&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-ML_Service-009688?style=flat&logo=fastapi&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel&logoColor=white)
  ![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat&logo=railway&logoColor=white)

  <br/>

  **🌐 Live Demo:** [aduin.vercel.app](https://aduin.vercel.app)  
  **📋 Form Lapor:** [aduin.vercel.app/lapor](https://aduin.vercel.app/lapor)  
  **🔍 Cek Status:** [aduin.vercel.app/cek-status](https://aduin.vercel.app/cek-status)  
  **🔗 API:** [aduin-production.up.railway.app/api/health](https://aduin-production.up.railway.app/api/health)

</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Repo](#struktur-repo)
- [Instalasi & Setup Lokal](#instalasi--setup-lokal)
- [Environment Variables](#environment-variables)
- [Model AI](#model-ai)
- [Deployment](#deployment)
- [Dokumentasi](#dokumentasi)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Proyek

**ADUIN** adalah platform berbasis NLP (Natural Language Processing) yang dirancang untuk mengatasi permasalahan pengaduan masyarakat di Bali yang selama ini tidak terstruktur, tidak terprioritaskan, dan sulit dipantau oleh pemerintah daerah.

### Masalah yang Diselesaikan
- Pengaduan masyarakat tersebar di berbagai kanal tanpa sistem terpusat
- Tidak ada klasifikasi otomatis untuk menentukan jenis dan urgensi masalah
- Pemerintah kesulitan memantau sebaran masalah secara geografis
- Tidak ada dashboard analitik untuk pengambilan keputusan berbasis data

### Solusi ADUIN
- Form pengaduan digital yang mudah diakses seluruh warga Bali
- Klasifikasi kategori masalah **otomatis** menggunakan model ML multilabel
- **Priority scoring** otomatis berdasarkan tingkat urgensi laporan
- **Heatmap interaktif** sebaran laporan per kabupaten/kota
- Dashboard analitik lengkap dengan tren, distribusi, dan prioritas
- Sistem disposisi laporan ke dinas terkait dengan riwayat status

---

## Fitur Utama

### 👥 Untuk Warga
| Fitur | Deskripsi |
|---|---|
| **Form Lapor** | Submit pengaduan dengan teks, foto bukti, dan lokasi detail · [Buka Form →](https://aduin.vercel.app/lapor) |
| **Cek Status** | Pantau status laporan menggunakan nomor laporan unik · [Cek Status →](https://aduin.vercel.app/cek-status) |
| **Halaman Sukses** | Konfirmasi laporan diterima + download PDF sebagai bukti |

### 🏛️ Untuk Admin Pemerintah
| Fitur | Deskripsi |
|---|---|
| **Dashboard** | Statistik real-time: total laporan, urgensi, status, tren bulanan |
| **Peta Heatmap** | Visualisasi interaktif sebaran masalah per wilayah di Bali |
| **Manajemen Laporan** | Tabel dengan filter status, kategori, wilayah, search, pagination |
| **Detail Laporan** | AI analysis lengkap, foto bukti, disposisi ke dinas, riwayat status |
| **Analisis Tren** | Grafik tren laporan per waktu dengan filter multi-dimensi |
| **Pengaturan** | Kelola kategori, dinas, wilayah, dan kecamatan secara dinamis |
| **Export Data** | Export laporan ke CSV dan PDF |
| **Dark Mode** | Toggle antara light dan dark mode |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                           WARGA                                 │
│                  Form Lapor / Cek Status                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                            │
│               React 18 + Vite + Tailwind CSS                   │
│                   aduin.vercel.app                              │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Railway)                            │
│               Express.js 5 + Prisma ORM 5.22                   │
│           aduin-production.up.railway.app                       │
│                                                                 │
│   ┌─────────────┐ ┌──────────────┐ ┌────────────────────────┐  │
│   │ Auth Routes │ │Report Routes │ │   Dashboard Routes     │  │
│   └─────────────┘ └──────┬───────┘ └────────────────────────┘  │
│                          │ Parallel ML Call                     │
│             ┌────────────┴────────────┐                         │
│             ▼                         ▼                         │
│ ┌─────────────────────┐  ┌──────────────────────────────────┐   │
│ │   ML Kategori       │  │   ML Urgensi                     │   │
│ │   FastAPI (Railway) │  │   FastAPI (Hugging Face)         │   │
│ │   Multilabel NLP    │  │   Scoring: Rendah/Sedang/Tinggi  │   │
│ └─────────────────────┘  └──────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (Supabase)                          │
│           PostgreSQL — aws-ap-southeast-1 (Singapore)          │
│    Models: User · Report · StatusHistory · Setting · Wilayah   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | UI framework |
| **Routing** | React Router v6 | Client-side routing |
| **Charts** | Recharts | Grafik tren dan distribusi |
| **Map** | Leaflet + React-Leaflet | Heatmap interaktif |
| **Backend** | Express.js 5 | REST API server |
| **ORM** | Prisma 5.22 | Database access |
| **Auth** | JWT + bcryptjs | Autentikasi admin |
| **Database** | PostgreSQL (Supabase) | Penyimpanan data |
| **ML Kategori** | FastAPI + TensorFlow | Klasifikasi multilabel |
| **ML Urgensi** | FastAPI + Docker | Scoring urgensi |
| **DS Dashboard** | Streamlit | Analitik dataset |
| **Deploy FE** | Vercel | Hosting frontend |
| **Deploy BE** | Railway | Hosting backend |
| **Deploy DB** | Supabase | Managed PostgreSQL |

---

## Struktur Repo

```
aduin-repo/
├── frontend/                        # React + Vite (Vercel)
│   ├── src/
│   │   ├── assets/icons/            # SVG icons
│   │   ├── components/
│   │   │   ├── admin/               # Komponen dashboard admin
│   │   │   ├── common/              # Header, Sidebar
│   │   │   └── warga/               # Form laporan warga
│   │   ├── context/                 # ThemeContext (dark/light)
│   │   ├── data/                    # Mock data & constants
│   │   ├── hooks/                   # Custom hooks
│   │   ├── pages/                   # Halaman utama
│   │   └── services/api.js          # API client
│   ├── public/
│   ├── vercel.json
│   └── package.json
│
├── backend/                         # Express.js + Prisma (Railway)
│   ├── src/
│   │   ├── config/database.js       # Prisma singleton
│   │   ├── controllers/             # Business logic
│   │   ├── middleware/              # Auth + error handler
│   │   └── routes/                  # API routes
│   ├── prisma/schema.prisma         # Database schema
│   ├── seed.js                      # Seed users + wilayah dasar
│   ├── seedWilayah.js               # Seed 9 kab/kota Bali + kecamatan
│   ├── seedLaporan.js               # Seed 30 laporan sample
│   ├── server.js
│   └── package.json
│
├── ml-service-kategori/             # AI — Klasifikasi Kategori Multilabel
│   ├── app/                         # FastAPI application
│   ├── model/                       # Model TensorFlow tersimpan
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── railpack.json                # Railway deployment config
│   └── readme.md
│
├── ml-service-urgensi/              # AI — Scoring Urgensi
│   ├── model/                       # Model tersimpan
│   ├── main.py                      # FastAPI app
│   ├── Dockerfile                   # Docker config (Hugging Face)
│   ├── requirements.txt
│   └── README.md
│
├── ds-dataset/                      # Data Science — Dataset & Analitik
│   ├── data/                        # Dataset laporan masyarakat
│   ├── notebooks/                   # Jupyter notebooks analisis
│   ├── app.py                       # Streamlit dashboard
│   ├── Data_Dictionary_ADUIN.md     # Kamus data dataset
│   ├── requirements.txt
│   └── README.md
│
├── docs/
│   ├── API_DOCS.md                  # Dokumentasi endpoint API
│   ├── DATA_DICTIONARY.md           # Struktur database
│   ├── DEPLOYMENT.md                # Panduan deployment
│   └── PROJECT_PLAN.md              # Rencana & progress proyek
│
└── README.md
```

---

## Instalasi & Setup Lokal

### Prerequisites
- Node.js >= 18
- npm >= 9
- Python >= 3.9 (untuk ML service)
- Akun Supabase

### 1. Clone Repository

```bash
git clone https://github.com/JevanBernard/aduin.git
cd aduin
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="aduin-secret-key-production-2026"
NODE_ENV=development
PORT=3000
```

Push schema dan seed data:
```bash
npx prisma db push
npx prisma generate
node seed.js
node seedWilayah.js
node seedLaporan.js
```

Jalankan backend:
```bash
node server.js
# Server berjalan di http://localhost:3000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Jalankan frontend:
```bash
npm run dev
# Buka http://localhost:5173
```

### 4. Setup ML Service Kategori (Opsional)

```bash
cd ml-service-kategori
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Setup ML Service Urgensi (Opsional)

```bash
cd ml-service-urgensi
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 6. Setup DS Dashboard (Opsional)

```bash
cd ds-dataset
pip install -r requirements.txt
streamlit run app.py
```

### 7. Kredensial Login

```
Super Admin : admin@aduin.go.id    / admin123
Operator    : operator@aduin.go.id / operator123
```

---

## Environment Variables

### Backend

| Variable | Deskripsi |
|---|---|
| `DATABASE_URL` | Connection string Supabase Transaction Pooler (port 6543) |
| `JWT_SECRET` | Secret key untuk JWT token |
| `NODE_ENV` | `production` atau `development` |
| `PORT` | Port server (default: 3000) |

### Frontend

| Variable | Deskripsi |
|---|---|
| `VITE_API_URL` | URL backend API (harus diawali `https://`) |

---

## Model AI

### Klasifikasi Kategori (Multilabel)
Mengklasifikasikan teks laporan ke satu atau lebih kategori secara otomatis menggunakan TensorFlow.

- **Repo:** [keluhan-multilabel-classification-api](https://github.com/syukronJazila/keluhan-multilabel-classification-api)
- **Deploy:** Railway
- **URL:** `https://keluhan-multilabel-classification-api-production.up.railway.app/predict`
- **Kategori:** Infrastruktur, Lingkungan, Air & Sanitasi, Bencana, Transportasi, Pelayanan Publik, Ekonomi, Keamanan, Pendidikan, Kesehatan

```json
// Request
{ "text": "Jalan di Sesetan banyak lubang besar" }

// Response
{
  "success": true,
  "predictions": [
    { "label": "Infrastruktur", "probability": 0.92 }
  ]
}
```

### Scoring Urgensi
Menentukan tingkat urgensi laporan: Rendah, Sedang, atau Tinggi menggunakan FastAPI + Docker.

- **Repo:** [aduin-urgency-api](https://github.com/destiys/aduin-urgency-api)
- **Deploy:** Hugging Face Spaces
- **URL:** `https://destiys-urgensi-keluhan-api.hf.space/predict`

```json
// Request
{ "text": "Jalan di Sesetan banyak lubang besar" }

// Response
{
  "status_code": 200,
  "kategori": "Tinggi",
  "raw_probabilities": { "rendah": 0.05, "sedang": 0.15, "tinggi": 0.80 }
}
```

> Kedua model dipanggil secara **paralel** saat laporan baru masuk. Kegagalan ML tidak membatalkan penyimpanan laporan.

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://aduin.vercel.app |
| Backend | Railway | https://aduin-production.up.railway.app |
| Database | Supabase | aws-ap-southeast-1 |
| ML Kategori | Railway | keluhan-multilabel-classification-api-production.up.railway.app |
| ML Urgensi | Hugging Face | destiys-urgensi-keluhan-api.hf.space |

Panduan deployment lengkap tersedia di [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

---

## Dokumentasi

| Dokumen | Deskripsi |
|---|---|
| [docs/API_DOCS.md](./docs/API_DOCS.md) | Dokumentasi lengkap semua endpoint API |
| [docs/DATA_DICTIONARY.md](./docs/DATA_DICTIONARY.md) | Struktur database dan relasi antar tabel |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Panduan step-by-step deployment |
| [docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) | Rencana proyek, progress, dan pembagian tugas |

---

## Tim Pengembang

| Nama | Cohort ID | Peran |
|---|---|---|
| Jevan Bernard Kaloko | CFCC014D6Y2425 | Fullstack |
| Yeremi Kornelius Purba | CFCC014D6Y1957 | Fullstack |
| Muhammad Syukron Jazila | CACC319D6Y0501 | AI Engineer — Klasifikasi Kategori |
| Desti Yashfy Silmia | CACC367D6X1576 | AI Engineer — Scoring Urgensi |
| Ida Bagus Gede Widiastana Bawaskara | CDCC014D6Y1801 | Data Scientist |
| Diana Qisthin Thoniyah | CDCC299D6X2345 | Data Scientist |

---

## Lisensi

Proyek ini dibuat untuk keperluan Capstone Project Dicoding Coding Camp 2026 (CC26-PSU299).  
© 2026 Tim CC26-PSU299 — All rights reserved.