# ADUIN — Analisis Digital Untuk Insight Nusantara

<div align="center">
  <h3>Platform NLP Pengaduan Masyarakat untuk Pemerintah Daerah Bali</h3>
  <p>Capstone Project CC26-PSU299 · Tema: Inclusive & Resilient Communities</p>

  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
  ![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
  ![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)
  ![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Railway-black?logo=vercel)
</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi & Setup Lokal](#instalasi--setup-lokal)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Model AI](#model-ai)
- [Deployment](#deployment)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Proyek

ADUIN adalah platform berbasis NLP (Natural Language Processing) yang mengumpulkan, mengklasifikasi, dan memprioritaskan pengaduan masyarakat untuk membantu pemerintah daerah Bali dalam mengambil keputusan berbasis data.

**Masalah yang diselesaikan:**
- Pengaduan masyarakat yang tidak terstruktur dan tersebar di berbagai kanal
- Tidak ada sistem prioritisasi otomatis untuk laporan mendesak
- Pemerintah kesulitan memantau sebaran masalah secara geografis
- Tidak ada dashboard terpusat untuk analisis tren pengaduan

**Solusi ADUIN:**
- Form pengaduan digital yang mudah diakses warga
- Klasifikasi kategori otomatis menggunakan model ML multilabel
- Scoring urgensi otomatis (Rendah / Sedang / Tinggi)
- Heatmap interaktif sebaran laporan per wilayah
- Dashboard analitik lengkap untuk admin pemerintah
- Sistem disposisi laporan ke dinas terkait

---

## Fitur Utama

### Untuk Warga
- **Form Lapor** — Submit pengaduan dengan teks, foto, dan lokasi
- **Cek Status** — Pantau status laporan menggunakan nomor laporan
- **Halaman Sukses** — Konfirmasi laporan diterima + download PDF bukti

### Untuk Admin Pemerintah
- **Dashboard** — Statistik real-time: total laporan, urgensi, tren bulanan
- **Peta Heatmap** — Visualisasi sebaran masalah per kabupaten/kota di Bali
- **Manajemen Laporan** — Tabel laporan dengan filter status, kategori, wilayah
- **Detail Laporan** — AI analysis, foto bukti, disposisi ke dinas, riwayat status
- **Analisis Tren** — Grafik tren laporan per waktu dengan filter lengkap
- **Pengaturan** — Kelola kategori, dinas, wilayah, dan kecamatan secara dinamis
- **Export Data** — Export laporan ke CSV dan PDF

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        WARGA                                │
│              Form Lapor / Cek Status                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Vercel)                         │
│              React 18 + Vite + Tailwind CSS                 │
│         aduin.vercel.app                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Railway)                         │
│              Express.js + Prisma ORM                        │
│         aduin-production.up.railway.app                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth Routes │  │Report Routes │  │ Dashboard Routes │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
│                           │ ML Call (parallel)              │
│              ┌────────────┴────────────┐                    │
│              ▼                         ▼                    │
│  ┌───────────────────┐    ┌───────────────────────────┐     │
│  │  ML Kategori      │    │  ML Urgensi               │     │
│  │  (Railway)        │    │  (Hugging Face)           │     │
│  │  Multilabel NLP   │    │  Scoring: R/S/T           │     │
│  └───────────────────┘    └───────────────────────────┘     │
└──────────────────────┬──────────────────────────────────────┘
                       │ Prisma ORM
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (Supabase)                       │
│              PostgreSQL — aws-ap-southeast-1                │
│   Models: User, Report, StatusHistory, Setting, Wilayah    │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Recharts, Leaflet |
| Backend | Express.js 5, Prisma ORM 5.22, JWT, bcryptjs |
| Database | PostgreSQL via Supabase |
| ML Kategori | FastAPI + TensorFlow (Railway) |
| ML Urgensi | FastAPI (Hugging Face Spaces) |
| Deploy Frontend | Vercel |
| Deploy Backend | Railway |
| Deploy Database | Supabase |

---

## Struktur Proyek

```
aduin-repo/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── assets/icons/        # SVG icons
│   │   ├── components/
│   │   │   ├── admin/           # Komponen dashboard admin
│   │   │   │   ├── DashboardStats.jsx
│   │   │   │   ├── HeatmapMap.jsx
│   │   │   │   ├── HeatmapPanel.jsx
│   │   │   │   ├── HeatmapPeta.jsx
│   │   │   │   ├── LaporanTable.jsx
│   │   │   │   ├── PriorityBoard.jsx
│   │   │   │   └── TrendChart.jsx
│   │   │   ├── common/          # Komponen shared
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── warga/           # Komponen form warga
│   │   │       └── FormLaporan.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Dark/light mode
│   │   ├── data/                # Mock data & constants
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useHeatmap.js
│   │   │   ├── useSettings.js
│   │   │   └── useWilayahOptions.js
│   │   ├── pages/               # Halaman utama
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PetaPage.jsx
│   │   │   ├── LaporanPage.jsx
│   │   │   ├── LaporanDetailPage.jsx
│   │   │   ├── TrendPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── FormPage.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   └── CekStatusPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   └── App.jsx
│   ├── public/
│   ├── vercel.json
│   └── package.json
│
├── backend/                     # Express.js + Prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Prisma singleton
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── reportController.js
│   │   │   ├── dashboardController.js
│   │   │   └── settingsController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT middleware
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── reportRoutes.js
│   │       ├── dashboardRoutes.js
│   │       ├── settingsRoutes.js
│   │       └── wilayahRoutes.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── seed.js                  # Seed users + wilayah
│   ├── seedWilayah.js           # Seed 9 kabupaten Bali + kecamatan
│   ├── seedLaporan.js           # Seed 30 laporan sample
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Instalasi & Setup Lokal

### Prerequisites
- Node.js >= 18
- npm >= 9
- Akun Supabase (untuk database)

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

Buat file `.env`:
```env
DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@[host]:5432/postgres"
JWT_SECRET="aduin-secret-key-production-2026"
NODE_ENV=development
PORT=3000
```

Push schema ke database:
```bash
npx prisma db push
npx prisma generate
```

Seed data awal:
```bash
node seed.js          # Users + wilayah dasar
node seedWilayah.js   # 9 kabupaten Bali + kecamatan
node seedLaporan.js   # 30 laporan sample
```

Jalankan backend:
```bash
npm run dev
# atau
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Jalankan frontend:
```bash
npm run dev
```

Buka `http://localhost:5173`

---

## Environment Variables

### Backend

| Variable | Deskripsi | Contoh |
|---|---|---|
| `DATABASE_URL` | Connection string Supabase (pooler) | `postgresql://postgres.[ref]:pass@host:5432/postgres` |
| `JWT_SECRET` | Secret key untuk JWT token | `aduin-secret-key-production-2026` |
| `NODE_ENV` | Environment | `production` atau `development` |
| `PORT` | Port server | `3000` |

### Frontend

| Variable | Deskripsi | Contoh |
|---|---|---|
| `VITE_API_URL` | URL backend API | `https://aduin-production.up.railway.app/api` |

---

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/me` | Get current user |

### Reports
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/reports` | List laporan (dengan filter & pagination) |
| POST | `/api/reports` | Buat laporan baru (trigger ML) |
| GET | `/api/reports/:id` | Detail laporan by ID |
| GET | `/api/reports/by-number/:reportNumber` | Detail by nomor laporan |
| GET | `/api/reports/track/:reportNumber` | Track status (public) |
| PUT | `/api/reports/:id/status` | Update status laporan |
| DELETE | `/api/reports/:id` | Hapus laporan |

### Dashboard
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/dashboard/stats` | Statistik ringkasan |
| GET | `/api/dashboard/heatmap` | Data heatmap per wilayah |
| GET | `/api/dashboard/heatmap/:kabupaten` | Detail wilayah |
| GET | `/api/dashboard/priorities` | Top 5 laporan prioritas |
| GET | `/api/dashboard/trends` | Tren laporan per waktu |
| GET | `/api/dashboard/distribusi` | Distribusi kategori |
| GET | `/api/dashboard/top-wilayah` | Top wilayah keluhan |
| GET | `/api/dashboard/trends-bulanan` | Tren 7 bulan terakhir |

### Settings
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/settings/kategori` | Get kategori laporan |
| PUT | `/api/settings/kategori` | Update kategori |
| GET | `/api/settings/dinas` | Get daftar dinas |
| PUT | `/api/settings/dinas` | Update dinas |

### Wilayah
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/wilayah` | List wilayah (auth) |
| GET | `/api/wilayah/public` | List wilayah (public) |
| POST | `/api/wilayah` | Tambah wilayah |
| PUT | `/api/wilayah/:id` | Update wilayah + kecamatan |
| DELETE | `/api/wilayah/:id` | Hapus wilayah |

---

## Model AI

### 1. Klasifikasi Kategori (Multilabel)
- **URL:** `https://keluhan-multilabel-classification-api-production.up.railway.app/predict`
- **Input:** `{ "text": "teks keluhan" }`
- **Output:** `{ "success": true, "predictions": [{ "label": "Infrastruktur", "probability": 0.92 }] }`
- **Kategori:** Infrastruktur, Lingkungan, Air & Sanitasi, Bencana, Transportasi, Pelayanan Publik, Ekonomi, Keamanan, Pendidikan, Kesehatan

### 2. Scoring Urgensi
- **URL:** `https://destiys-urgensi-keluhan-api.hf.space/predict`
- **Input:** `{ "text": "teks keluhan" }`
- **Output:** `{ "status_code": 200, "kategori": "Tinggi", "raw_probabilities": { "rendah": 0.1, "sedang": 0.2, "tinggi": 0.7 } }`
- **Level:** Rendah / Sedang / Tinggi

Kedua model dipanggil secara **paralel** saat laporan baru masuk. Kegagalan ML tidak membatalkan penyimpanan laporan.

---

## Deployment

### Frontend → Vercel
```
URL: https://aduin.vercel.app
Build Command: npm run build
Output Directory: dist
Root Directory: frontend
```

Environment variables di Vercel:
```
VITE_API_URL = https://aduin-production.up.railway.app/api
```

### Backend → Railway
```
URL: https://aduin-production.up.railway.app
Build Command: npx prisma generate
Start Command: node server.js
Root Directory: backend
```

Environment variables di Railway:
```
DATABASE_URL  = postgresql://postgres.[ref]:[pass]@host:6543/postgres?pgbouncer=true&connection_limit=1
JWT_SECRET    = aduin-secret-key-production-2026
NODE_ENV      = production
PORT          = 3000
```

### Database → Supabase
- Region: ap-southeast-1 (Singapore)
- Connection: Transaction Pooler port 6543
- Schema: push via `npx prisma db push` dari lokal

---

## Kredensial Demo

```
Super Admin : admin@aduin.go.id    / admin123
Operator    : operator@aduin.go.id / operator123
```

> Hapus kredensial ini sebelum production deployment.

---

## Tim Pengembang

| Nama | Peran |
|---|---|
| Jevan Bernard | Fullstack Developer |
| Yeremi | Fullstack Developer |
| Syukron | AI Engineer (Klasifikasi Kategori) |
| Desti | AI Engineer (Scoring Urgensi) |
| Ida Bagus | Data Scientist |
| Diana | Data Scientist |

**Capstone:** CC26-PSU299  
**Tema:** Inclusive & Resilient Communities  
**Institusi:** Dicoding — Coding Camp 2026

---

## Lisensi

Proyek ini dibuat untuk keperluan capstone project Dicoding Coding Camp 2026.