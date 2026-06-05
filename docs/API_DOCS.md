# ADUIN API Documentation

**Base URL Production:** `https://aduin-production.up.railway.app/api`  
**Base URL Development:** `http://localhost:3000/api`  
**Version:** 1.0.0

---

## Authentication

ADUIN menggunakan **JWT (JSON Web Token)** untuk autentikasi. Token didapat setelah login dan harus disertakan di header setiap request yang memerlukan autentikasi.

```
Authorization: Bearer <token>
```

---

## Response Format

Semua response menggunakan format JSON standar:

```json
{
  "success": true,
  "data": { ... },
  "message": "Pesan opsional"
}
```

Error response:
```json
{
  "success": false,
  "message": "Deskripsi error"
}
```

---

## Endpoints

### AUTH

#### POST `/auth/login`
Login admin dan mendapatkan JWT token.

**Request Body:**
```json
{
  "email": "admin@aduin.go.id",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@aduin.go.id",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

**Error:**
```json
{ "success": false, "message": "Email atau password salah" }
```

---

#### GET `/auth/me`
Mendapatkan data user yang sedang login.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@aduin.go.id",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

---

### REPORTS

#### GET `/reports`
Mendapatkan daftar laporan dengan filter dan pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Tipe | Deskripsi |
|---|---|---|
| `page` | number | Halaman (default: 1) |
| `limit` | number | Item per halaman (default: 10) |
| `search` | string | Cari berdasarkan teks laporan |
| `status` | string | Filter status: DITERIMA, DIANALISIS, DIDISPOSISI, DITINDAKLANJUTI, SELESAI |
| `kategori` | string | Filter kategori laporan |
| `wilayah` | string | Filter kabupaten/kota |
| `period` | string | Filter periode: 7d, 30d, 90d, custom |
| `start` | string | Tanggal mulai (format: YYYY-MM-DD, untuk period=custom) |
| `end` | string | Tanggal akhir (format: YYYY-MM-DD, untuk period=custom) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "reportNumber": "ADN-20260601-1234",
      "text": "Jalan di Sesetan banyak lubang",
      "kabupatenKota": "Denpasar",
      "kecamatan": "Denpasar Selatan",
      "categories": ["Infrastruktur"],
      "urgensi": "tinggi",
      "priorityScore": 88.5,
      "status": "DIDISPOSISI",
      "disposisiDinas": "Dinas Pekerjaan Umum",
      "createdAt": "2026-06-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

#### POST `/reports`
Membuat laporan baru. Secara otomatis memanggil ML service untuk klasifikasi kategori dan scoring urgensi.

**Request Body:**
```json
{
  "text": "Jalan di Sesetan banyak lubang besar, sudah ada motor yang jatuh",
  "kabupatenKota": "Denpasar",
  "kecamatan": "Denpasar Selatan",
  "detailLokasi": "Jl. Raya Sesetan dekat SD No.5",
  "reporterName": "Warga Sesetan",
  "photoUrls": ["data:image/jpeg;base64,..."],
  "latitude": -8.7125,
  "longitude": 115.2167
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reportNumber": "ADN-20260601-1234",
    "text": "Jalan di Sesetan banyak lubang besar...",
    "categories": ["Infrastruktur"],
    "urgensi": "tinggi",
    "urgencyScore": 85.2,
    "priorityScore": 88.5,
    "status": "DITERIMA"
  },
  "message": "Laporan berhasil dikirim"
}
```

---

#### GET `/reports/:id`
Mendapatkan detail laporan berdasarkan UUID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reportNumber": "ADN-20260601-1234",
    "text": "...",
    "photoUrls": [],
    "kabupatenKota": "Denpasar",
    "kecamatan": "Denpasar Selatan",
    "detailLokasi": "Jl. Raya Sesetan",
    "latitude": -8.7125,
    "longitude": 115.2167,
    "categories": ["Infrastruktur"],
    "urgensi": "tinggi",
    "urgencyScore": 85.2,
    "priorityScore": 88.5,
    "status": "DIDISPOSISI",
    "disposisiDinas": "Dinas Pekerjaan Umum",
    "catatanAdmin": "Sudah dikoordinasikan",
    "reporterName": "Warga Sesetan",
    "source": "form_warga",
    "createdAt": "2026-06-01T10:30:00.000Z",
    "statusHistories": [
      {
        "status": "DITERIMA",
        "note": "Laporan diterima",
        "createdAt": "2026-06-01T10:30:00.000Z"
      }
    ]
  }
}
```

---

#### GET `/reports/by-number/:reportNumber`
Mendapatkan detail laporan berdasarkan nomor laporan.

**Headers:** `Authorization: Bearer <token>`

**Params:** `reportNumber` — contoh: `ADN-20260601-1234`

---

#### GET `/reports/track/:reportNumber`
Melacak status laporan (public, tanpa autentikasi).

**Response:**
```json
{
  "success": true,
  "data": {
    "reportNumber": "ADN-20260601-1234",
    "status": "DIDISPOSISI",
    "kabupatenKota": "Denpasar",
    "categories": ["Infrastruktur"],
    "createdAt": "2026-06-01T10:30:00.000Z",
    "statusHistories": [ ... ]
  }
}
```

---

#### PUT `/reports/:id/status`
Update status laporan oleh admin.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "DITINDAKLANJUTI",
  "disposisiDinas": "Dinas Pekerjaan Umum",
  "catatanAdmin": "Sudah dikoordinasikan dengan dinas terkait"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Status laporan berhasil diupdate"
}
```

---

#### DELETE `/reports/:id`
Menghapus laporan.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{ "success": true, "message": "Laporan berhasil dihapus" }
```

---

### DASHBOARD

#### GET `/dashboard/stats`
Statistik ringkasan dashboard.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** `period`, `start`, `end` (sama seperti reports)

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "urgent": 45,
    "kategori": "Infrastruktur",
    "belum": 60,
    "proses": 50,
    "selesai": 40
  }
}
```

---

#### GET `/dashboard/heatmap`
Data heatmap sebaran laporan per wilayah.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "kabupaten_kota": "Denpasar",
      "count": 45,
      "urgent": 12,
      "lat": -8.65,
      "lng": 115.2167,
      "top_categories": [
        { "name": "Infrastruktur", "percentage": 34 }
      ]
    }
  ],
  "clusters": 0
}
```

---

#### GET `/dashboard/heatmap/:kabupatenKota`
Detail laporan per kabupaten/kota.

**Response:**
```json
{
  "success": true,
  "data": {
    "kabupaten_kota": "Denpasar",
    "count": 45,
    "urgent": 12,
    "top_categories": [ ... ],
    "top_issues": [
      {
        "issue": "Jalan rusak Sesetan...",
        "priority_score": 88,
        "status": "DIDISPOSISI"
      }
    ]
  }
}
```

---

#### GET `/dashboard/priorities`
Top 5 laporan berdasarkan priority score.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "issue": "Longsor di Kintamani...",
      "score": 96,
      "wilayah": "Kintamani, Bangli",
      "status": "DIDISPOSISI"
    }
  ]
}
```

---

#### GET `/dashboard/trends`
Tren laporan per waktu.

**Query Parameters:** `period`, `kategori`, `wilayah`, `status`

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["Mg 1", "Mg 2", "Mg 3", "Mg 4"],
    "datasets": [
      { "name": "Total Laporan", "color": "#3e8bf3", "data": [10, 15, 12, 18] },
      { "name": "Urgent", "color": "#ff0000", "data": [3, 5, 4, 6] },
      { "name": "Selesai", "color": "#1a8c3c", "data": [2, 4, 3, 5] }
    ],
    "subtitle": "Semua kategori · 30 hari terakhir"
  }
}
```

---

#### GET `/dashboard/distribusi`
Distribusi laporan per kategori.

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Infrastruktur", "percentage": 34, "color": "#3e8bf3" },
    { "name": "Lingkungan", "percentage": 22, "color": "#1a8c3c" }
  ]
}
```

---

#### GET `/dashboard/top-wilayah`
Top 5 wilayah dengan laporan terbanyak.

**Response:**
```json
{
  "success": true,
  "data": [
    { "rank": 1, "name": "Denpasar", "count": 45 },
    { "rank": 2, "name": "Badung", "count": 38 }
  ]
}
```

---

#### GET `/dashboard/trends-bulanan`
Tren laporan 7 bulan terakhir.

**Response:**
```json
{
  "success": true,
  "data": [
    { "label": "Des", "count": 12 },
    { "label": "Jan", "count": 18 }
  ]
}
```

---

### SETTINGS

#### GET `/settings/kategori`
Mendapatkan daftar kategori laporan.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": ["Infrastruktur", "Lingkungan", "Air & Sanitasi", "Bencana"]
}
```

---

#### PUT `/settings/kategori`
Update daftar kategori laporan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "kategori": ["Infrastruktur", "Lingkungan", "Air & Sanitasi", "Bencana", "Transportasi"]
}
```

---

#### GET `/settings/dinas`
Mendapatkan daftar dinas.

**Response:**
```json
{
  "success": true,
  "data": [
    { "nama": "Dinas Pekerjaan Umum", "singkatan": "PUPR" },
    { "nama": "Dinas Lingkungan Hidup", "singkatan": "DLH" }
  ]
}
```

---

#### PUT `/settings/dinas`
Update daftar dinas.

**Request Body:**
```json
{
  "dinas": [
    { "nama": "Dinas Pekerjaan Umum", "singkatan": "PUPR" }
  ]
}
```

---

### WILAYAH

#### GET `/wilayah/public`
Mendapatkan daftar wilayah beserta kecamatan (tanpa autentikasi). Digunakan untuk dropdown form warga.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Denpasar",
      "latitude": -8.65,
      "longitude": 115.2167,
      "kecamatan": ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"]
    }
  ]
}
```

---

#### GET `/wilayah`
Mendapatkan daftar wilayah (memerlukan autentikasi).

**Headers:** `Authorization: Bearer <token>`

---

#### POST `/wilayah`
Menambah wilayah baru.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nama": "Denpasar",
  "latitude": -8.65,
  "longitude": 115.2167,
  "kecamatan": ["Denpasar Barat", "Denpasar Selatan"]
}
```

---

#### PUT `/wilayah/:id`
Update wilayah dan kecamatan.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nama": "Denpasar",
  "latitude": -8.65,
  "longitude": 115.2167,
  "kecamatan": ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"]
}
```

---

#### DELETE `/wilayah/:id`
Menghapus wilayah.

**Headers:** `Authorization: Bearer <token>`

---

## ML Service Integration

### Klasifikasi Kategori
**URL:** `https://keluhan-multilabel-classification-api-production.up.railway.app/predict`  
**Method:** POST  
**Request:**
```json
{ "text": "Jalan di Sesetan banyak lubang besar" }
```
**Response:**
```json
{
  "success": true,
  "predictions": [
    { "label": "Infrastruktur", "probability": 0.92 },
    { "label": "Keamanan", "probability": 0.45 }
  ]
}
```

### Scoring Urgensi
**URL:** `https://destiys-urgensi-keluhan-api.hf.space/predict`  
**Method:** POST  
**Request:**
```json
{ "text": "Jalan di Sesetan banyak lubang besar" }
```
**Response:**
```json
{
  "status_code": 200,
  "kategori": "Tinggi",
  "raw_probabilities": {
    "rendah": 0.05,
    "sedang": 0.15,
    "tinggi": 0.80
  }
}
```

---

## Status Codes

| Code | Deskripsi |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request — input tidak valid |
| 401 | Unauthorized — token tidak valid atau expired |
| 403 | Forbidden — tidak punya akses |
| 404 | Not Found — data tidak ditemukan |
| 500 | Internal Server Error |

---

## Report Status Flow

```
DITERIMA → DIANALISIS → DIDISPOSISI → DITINDAKLANJUTI → SELESAI
```

| Status | Keterangan |
|---|---|
| DITERIMA | Laporan baru masuk |
| DIANALISIS | Sedang dianalisis admin |
| DIDISPOSISI | Sudah didisposisi ke dinas |
| DITINDAKLANJUTI | Dinas sedang menindaklanjuti |
| SELESAI | Laporan selesai ditangani |