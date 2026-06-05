# ADUIN Deployment Guide

Panduan lengkap untuk men-deploy ADUIN ke production environment.

**Stack Deployment:**
- Frontend → **Vercel**
- Backend → **Railway**
- Database → **Supabase**

---

## Prerequisites

- Akun GitHub (repo: https://github.com/JevanBernard/aduin)
- Akun Vercel (vercel.com)
- Akun Railway (railway.app)
- Akun Supabase (supabase.com)
- Node.js >= 18 di lokal

---

## 1. Setup Database (Supabase)

### Buat Project Supabase
1. Login ke [supabase.com](https://supabase.com)
2. Klik **New Project**
3. Isi nama project: `aduin`
4. Pilih region: **Southeast Asia (Singapore)**
5. Buat password database yang kuat — **simpan password ini**
6. Tunggu project dibuat (~2 menit)

### Ambil Connection String
1. Buka **Settings** → **Database**
2. Scroll ke **Connection pooling**
3. Copy **Transaction pooler** URI (port 6543):
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### Push Schema dari Lokal
Update `backend/.env` dengan connection string Supabase:
```env
DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

Jalankan dari folder `backend/`:
```bash
npx prisma db push
npx prisma generate
node seed.js
node seedWilayah.js
node seedLaporan.js
```

---

## 2. Deploy Backend (Railway)

### Setup Project
1. Login ke [railway.app](https://railway.app) dengan GitHub
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repo `JevanBernard/aduin`
4. Set **Root Directory** → `backend`

### Environment Variables
Di Railway → project → tab **Variables**, tambahkan:

```
DATABASE_URL  = postgresql://postgres.[ref]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL    = postgresql://postgres:[PASSWORD]@db.[ref].supabase.co:5432/postgres
JWT_SECRET    = aduin-secret-key-production-2026
NODE_ENV      = production
PORT          = 3000
```

### Build & Deploy Settings
Di Railway → **Settings** → **Deploy**:

```
Build Command:      npx prisma generate
Start Command:      node server.js
Pre-deploy Command: npm install && npx prisma generate
```

### Generate Domain
Di Railway → **Settings** → **Networking** → klik **Generate Domain**

URL backend akan menjadi:
```
https://aduin-production.up.railway.app
```

### Verifikasi
Buka browser, akses:
```
https://aduin-production.up.railway.app/api/health
```

Response yang diharapkan:
```json
{ "status": "ok", "service": "ADUIN Backend" }
```

---

## 3. Deploy Frontend (Vercel)

### Setup Project
1. Login ke [vercel.com](https://vercel.com)
2. Klik **Add New Project**
3. Import repo `JevanBernard/aduin`
4. Set **Root Directory** → `frontend`
5. **Framework Preset** → Vite (otomatis terdeteksi)

### Build Settings
```
Build Command:    npm run build
Output Directory: dist
Install Command:  npm install
```

### Environment Variables
Di Vercel → **Settings** → **Environment Variables**:

```
VITE_API_URL = https://aduin-production.up.railway.app/api
```

> Pastikan nilai dimulai dengan `https://` — tanpa ini URL akan tergabung dan menyebabkan error.

### vercel.json
Pastikan file `frontend/vercel.json` sudah ada:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

File ini wajib ada agar React Router berfungsi di Vercel — tanpanya semua route selain `/` akan menghasilkan 404.

### Deploy
Klik **Deploy** → tunggu ~2 menit.

URL frontend:
```
https://aduin.vercel.app
```

---

## 4. Update CORS Backend

Setelah mendapat URL frontend, update `backend/server.js`:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "https://aduin.vercel.app", // ← URL Vercel
];
```

Commit + push → Railway otomatis redeploy.

---

## 5. Checklist Deployment

```
[ ] Supabase project dibuat
[ ] DATABASE_URL disalin (pooler port 6543)
[ ] npx prisma db push dari lokal berhasil
[ ] Seed data dijalankan (seed.js, seedWilayah.js, seedLaporan.js)
[ ] Railway: project dibuat
[ ] Railway: environment variables di-set
[ ] Railway: backend deployed dan /api/health OK
[ ] Railway: domain di-generate
[ ] Vercel: project dibuat
[ ] Vercel: root directory = frontend
[ ] Vercel: VITE_API_URL di-set dengan https://
[ ] Vercel: frontend/vercel.json ada
[ ] Vercel: frontend deployed
[ ] Backend CORS di-update dengan URL Vercel
[ ] Login berhasil di production
[ ] Form lapor warga berfungsi
[ ] Dashboard menampilkan data
```

---

## Troubleshooting

### Error: `prisma generate` gagal di Vercel
**Penyebab:** `prisma` ada di `devDependencies`  
**Solusi:** Pindahkan `prisma` ke `dependencies` di `package.json`

### Error: `max clients reached`
**Penyebab:** Terlalu banyak koneksi ke Supabase  
**Solusi:** Tambahkan `?pgbouncer=true&connection_limit=1` di `DATABASE_URL`

### Error: `P1001 Can't reach database`
**Penyebab:** Railway tidak bisa konek ke Supabase port 5432 (direct)  
**Solusi:** Gunakan Transaction Pooler port **6543** bukan 5432

### Error: `405 Method Not Allowed` di frontend
**Penyebab:** `VITE_API_URL` tidak pakai `https://` (hanya domain tanpa protokol)  
**Solusi:** Pastikan value `VITE_API_URL` dimulai dengan `https://`

### Error: CORS
**Penyebab:** URL frontend belum ditambahkan ke `allowedOrigins` di backend  
**Solusi:** Tambahkan URL Vercel ke `allowedOrigins` di `server.js`, commit + push

### Error: 404 di semua halaman selain `/`
**Penyebab:** `frontend/vercel.json` tidak ada  
**Solusi:** Buat file `frontend/vercel.json` dengan rewrite ke `index.html`

### Leaflet map menutupi elemen lain
**Penyebab:** Leaflet CSS inject z-index tinggi secara default  
**Solusi:** Tambahkan override di `index.css`:
```css
.leaflet-container { z-index: 0 !important; }
.leaflet-pane { z-index: 0 !important; }
.leaflet-top, .leaflet-bottom { z-index: 1 !important; }
```

---

## Environment Variables Lengkap

### Backend (Railway)
| Variable | Value | Keterangan |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:pass@host:6543/postgres?pgbouncer=true&connection_limit=1` | Supabase Transaction Pooler |
| `DIRECT_URL` | `postgresql://postgres:pass@db.[ref].supabase.co:5432/postgres` | Direct connection (untuk migration) |
| `JWT_SECRET` | `aduin-secret-key-production-2026` | Secret JWT |
| `NODE_ENV` | `production` | Environment |
| `PORT` | `3000` | Port server |

### Frontend (Vercel)
| Variable | Value | Keterangan |
|---|---|---|
| `VITE_API_URL` | `https://aduin-production.up.railway.app/api` | URL backend Railway |

---

## URL Production

| Service | URL |
|---|---|
| Frontend | https://aduin.vercel.app |
| Backend | https://aduin-production.up.railway.app |
| API Health | https://aduin-production.up.railway.app/api/health |
| Database | Supabase — cophnnkhqvaggeirahlb |
| ML Kategori | https://keluhan-multilabel-classification-api-production.up.railway.app |
| ML Urgensi | https://destiys-urgensi-keluhan-api.hf.space |