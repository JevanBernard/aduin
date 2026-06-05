# ADUIN Project Plan

Dokumentasi perencanaan, progress, dan pembagian tugas tim CC26-PSU299.

---

## Informasi Proyek

| Field | Detail |
|---|---|
| Nama Proyek | ADUIN — Analisis Digital Untuk Insight Nusantara |
| Kode Capstone | CC26-PSU299 |
| Tema | Inclusive & Resilient Communities |
| Institusi | Dicoding — Coding Camp 2026 |
| Deadline Project Brief | 5 Juni 2026 |
| Presentasi | 8–10 Juni 2026 |

---

## Tim Pengembang

| Nama | Kode | Peran | Tanggung Jawab |
|---|---|---|---|
| Jevan Bernard Subhi | CC2T0254 | Fullstack Frontend | React dashboard, UI/UX, Vercel deployment |
| Yeremi Fransiskus Purba | CC2T0316 | Fullstack Backend | Express API, Prisma, Railway deployment |
| Syukron | CC2T0... | AI Engineer | Model klasifikasi kategori multilabel |
| Desti Yuliana Saputri | CC2T0... | AI Engineer | Model scoring urgensi |
| Ida Bagus Widhistana Putra | CC2T0... | Data Scientist | Analisis dataset, DS dashboard |
| Diana | CC2T0... | Data Scientist | Analisis dataset, visualisasi data |

---

## Timeline Pengerjaan

### Minggu 1 — Setup & Perencanaan
- [x] Setup repository GitHub
- [x] Definisi arsitektur sistem
- [x] Setup database schema Prisma
- [x] Setup project React + Vite + Tailwind
- [x] Setup project Express + Prisma

### Minggu 2 — Core Development
- [x] Backend: Auth (login, JWT)
- [x] Backend: CRUD laporan
- [x] Backend: Dashboard stats API
- [x] Frontend: Login page
- [x] Frontend: Dashboard layout
- [x] Frontend: Sidebar + Header

### Minggu 3 — Feature Development
- [x] Frontend: Heatmap peta (Leaflet)
- [x] Frontend: Tabel laporan + filter
- [x] Frontend: Detail laporan
- [x] Frontend: Analisis tren (Recharts)
- [x] Backend: Heatmap API
- [x] Backend: Trends API
- [x] AI: Model klasifikasi kategori
- [x] AI: Model scoring urgensi

### Minggu 4 — Integration & Polish
- [x] Integrasi ML service ke backend
- [x] Frontend: Form lapor warga
- [x] Frontend: Cek status laporan
- [x] Frontend: Halaman sukses + PDF
- [x] Frontend: Settings (kategori, dinas, wilayah)
- [x] Dark mode
- [x] Responsive mobile

### Minggu 5 — Deployment & Finalisasi
- [x] Deploy database ke Supabase
- [x] Deploy backend ke Railway
- [x] Deploy frontend ke Vercel
- [x] Seed data production
- [x] Fix CORS
- [x] Fix z-index Leaflet
- [x] README dokumentasi
- [x] Docs (API, Data Dictionary, Deployment)

---

## Fitur yang Sudah Selesai

### Frontend
- [x] Login page dengan JWT authentication
- [x] Dashboard dengan stats real-time
- [x] Peta Heatmap interaktif (Leaflet) dengan filter kategori & urgensi
- [x] Halaman Laporan dengan tabel, filter, search, pagination
- [x] Detail Laporan dengan AI analysis, foto lightbox, riwayat status
- [x] Analisis Tren dengan line chart, distribusi kategori, top wilayah
- [x] Pengaturan — kategori, dinas, wilayah, kecamatan (dinamis dari API)
- [x] Form Lapor Warga dengan upload foto
- [x] Cek Status Laporan
- [x] Halaman Sukses + download PDF
- [x] Dark/Light mode
- [x] Responsive mobile (card view)
- [x] Export CSV dan PDF
- [x] Profile dropdown dengan navigate

### Backend
- [x] JWT Authentication
- [x] CRUD laporan dengan ML integration
- [x] Dashboard API (stats, heatmap, trends, distribusi, priorities)
- [x] Settings API (kategori, dinas)
- [x] Wilayah API (public + admin)
- [x] Pagination dan filtering
- [x] Status history tracking
- [x] Error handling middleware

### AI/ML
- [x] Model klasifikasi kategori multilabel (Railway)
- [x] Model scoring urgensi Rendah/Sedang/Tinggi (Hugging Face)
- [x] Integrasi paralel ke backend

---

## Fitur yang Belum Dikerjakan (Next Steps)

### High Priority
- [ ] **Notifikasi real-time** — Browser push notification saat laporan urgensi tinggi masuk
- [ ] **Upload foto ke cloud storage** — Saat ini foto disimpan sebagai base64 di database, idealnya ke Supabase Storage atau Cloudinary
- [ ] **DS Dashboard Streamlit** — Dashboard analitik tambahan oleh tim Data Scientist

### Medium Priority
- [ ] **Export PDF laporan** — Export detail laporan individual ke PDF
- [ ] **Batch import laporan** — Upload CSV untuk import data laporan massal
- [ ] **Email notifikasi** — Kirim email ke admin saat laporan baru masuk
- [ ] **Multi-bahasa** — Support Bahasa Indonesia dan Bahasa Bali

### Low Priority
- [ ] **API rate limiting** — Batasi jumlah request per IP
- [ ] **Audit log** — Catat semua aksi admin
- [ ] **Integrasi WhatsApp** — Lapor via WhatsApp Bot
- [ ] **Integrasi dengan SIPP** — Sinkronisasi dengan sistem pemerintah daerah
- [ ] **Mobile app** — React Native untuk warga

---

## Kendala yang Dihadapi & Solusi

### 1. Koneksi Database Supabase dari Railway
**Masalah:** Railway tidak bisa konek ke Supabase port 5432 (direct connection)  
**Solusi:** Gunakan Transaction Pooler port 6543 dengan parameter `?pgbouncer=true&connection_limit=1`

### 2. Prisma Generate di Vercel
**Masalah:** Vercel cache dependencies sehingga Prisma Client tidak di-generate ulang  
**Solusi:** Pindahkan `prisma` dari `devDependencies` ke `dependencies` dan set build command `npx prisma generate`

### 3. Max Clients Supabase
**Masalah:** Terlalu banyak koneksi database menyebabkan error `EMAXCONNSESSION`  
**Solusi:** Implementasi singleton pattern untuk Prisma Client + `connection_limit=1` di URL

### 4. Leaflet Map Menutupi Elemen Lain
**Masalah:** Leaflet CSS inject z-index tinggi ke `.leaflet-container` sehingga map menutupi sidebar dan elemen lain  
**Solusi:** Override CSS global di `index.css` untuk reset z-index Leaflet

### 5. React Router 404 di Vercel
**Masalah:** Semua route selain `/` menghasilkan 404 di Vercel  
**Solusi:** Tambahkan `vercel.json` dengan rewrite semua path ke `index.html`

### 6. CORS Error
**Masalah:** Frontend tidak bisa akses backend karena CORS  
**Solusi:** Update `allowedOrigins` di `server.js` dengan URL Vercel production

### 7. VITE_API_URL Tidak Terbaca
**Masalah:** Frontend masih konek ke `localhost` meskipun env variable sudah di-set di Vercel  
**Solusi:** Tambahkan fallback hardcode di `api.js` + pastikan value dimulai dengan `https://`

---

## Arsitektur Deployment

```
GitHub (JevanBernard/aduin)
         │
    ┌────┴────┐
    │         │
  Vercel   Railway
(frontend) (backend)
    │         │
    └────┬────┘
         │
      Supabase
     (database)
```

Auto-deploy aktif:
- Push ke `master` → Vercel rebuild frontend
- Push ke `master` → Railway rebuild backend

---

## Kredensial Demo

```
Super Admin : admin@aduin.go.id    / admin123
Operator    : operator@aduin.go.id / operator123
```

> **PENTING:** Hapus kredensial ini sebelum production deployment resmi.

---

## Link Penting

| Resource | URL |
|---|---|
| Frontend Production | https://aduin.vercel.app |
| Backend Production | https://aduin-production.up.railway.app |
| API Health Check | https://aduin-production.up.railway.app/api/health |
| Repository | https://github.com/JevanBernard/aduin |
| ML Kategori | https://keluhan-multilabel-classification-api-production.up.railway.app |
| ML Urgensi | https://destiys-urgensi-keluhan-api.hf.space |