# ADUIN Data Dictionary

Dokumentasi struktur database ADUIN menggunakan PostgreSQL via Supabase dengan Prisma ORM.

---

## Diagram Relasi

```
User ──────────────┐
                   │ changedBy (optional)
Report ────────────┼──── StatusHistory
                   │
                   └──── User (changedBy)

Setting (standalone)
Wilayah (standalone)
```

---

## Models

### User

Tabel untuk menyimpan data admin dan operator sistem ADUIN.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | String (UUID) | PK, default uuid() | Primary key |
| `email` | String | UNIQUE, NOT NULL | Email login |
| `password` | String | NOT NULL | Password ter-hash (bcrypt) |
| `name` | String | NOT NULL | Nama lengkap |
| `role` | Role (enum) | default ADMIN | Peran pengguna |
| `jabatan` | String | NULLABLE | Jabatan di instansi |
| `instansi` | String | NULLABLE | Nama instansi |
| `createdAt` | DateTime | default now() | Waktu dibuat |
| `updatedAt` | DateTime | auto update | Waktu diupdate |

**Enum Role:**
| Value | Keterangan |
|---|---|
| `SUPER_ADMIN` | Akses penuh semua fitur |
| `ADMIN` | Akses manajemen laporan |
| `VIEWER` | Akses read-only |

**Contoh Data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@aduin.go.id",
  "name": "Super Admin",
  "role": "SUPER_ADMIN",
  "jabatan": "Kepala Bidang",
  "instansi": "Pemerintah Provinsi Bali"
}
```

---

### Report

Tabel utama untuk menyimpan laporan pengaduan dari warga.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | String (UUID) | PK, default uuid() | Primary key |
| `reportNumber` | String | UNIQUE, NOT NULL | Nomor laporan: ADN-YYYYMMDD-XXXX |
| `text` | String | NOT NULL | Isi teks laporan |
| `reporterName` | String | NULLABLE | Nama pelapor (null = anonim) |
| `photoUrls` | String[] | default [] | Array URL/base64 foto bukti |
| `kabupatenKota` | String | NOT NULL | Kabupaten/kota lokasi |
| `kecamatan` | String | NOT NULL | Kecamatan lokasi |
| `detailLokasi` | String | NULLABLE | Detail alamat/lokasi spesifik |
| `latitude` | Float | NULLABLE | Koordinat latitude |
| `longitude` | Float | NULLABLE | Koordinat longitude |
| `categories` | String[] | default [] | Kategori hasil klasifikasi ML |
| `urgensi` | String | NULLABLE | Level urgensi: rendah/sedang/tinggi |
| `urgencyScore` | Float | NULLABLE | Skor urgensi (0-100) dari ML |
| `priorityScore` | Float | NULLABLE | Skor prioritas gabungan (0-100) |
| `clusterId` | String | NULLABLE | ID cluster (tidak digunakan) |
| `status` | ReportStatus | default DITERIMA | Status penanganan laporan |
| `disposisiDinas` | String | NULLABLE | Nama dinas yang menangani |
| `catatanAdmin` | String | NULLABLE | Catatan tindak lanjut admin |
| `source` | String | default "form_warga" | Sumber laporan |
| `createdAt` | DateTime | default now() | Waktu laporan dibuat |
| `updatedAt` | DateTime | auto update | Waktu terakhir diupdate |

**Enum ReportStatus:**
| Value | Keterangan |
|---|---|
| `DITERIMA` | Laporan baru diterima sistem |
| `DIANALISIS` | Sedang dianalisis admin |
| `DIDISPOSISI` | Sudah didisposisi ke dinas |
| `DITINDAKLANJUTI` | Dinas sedang menindaklanjuti |
| `SELESAI` | Laporan selesai ditangani |

**Contoh Data:**
```json
{
  "id": "uuid",
  "reportNumber": "ADN-20260601-1234",
  "text": "Jalan di Sesetan banyak lubang besar, sudah ada motor yang jatuh",
  "reporterName": "Warga Sesetan",
  "photoUrls": [],
  "kabupatenKota": "Denpasar",
  "kecamatan": "Denpasar Selatan",
  "detailLokasi": "Jl. Raya Sesetan dekat SD No.5",
  "latitude": -8.7125,
  "longitude": 115.2167,
  "categories": ["Infrastruktur"],
  "urgensi": "tinggi",
  "urgencyScore": 85.2,
  "priorityScore": 88.5,
  "status": "DIDISPOSISI",
  "disposisiDinas": "Dinas Pekerjaan Umum",
  "source": "form_warga"
}
```

---

### StatusHistory

Tabel untuk menyimpan riwayat perubahan status laporan.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | String (UUID) | PK, default uuid() | Primary key |
| `reportId` | String | FK → Report.id | Laporan yang diupdate |
| `status` | ReportStatus | NOT NULL | Status baru |
| `note` | String | NULLABLE | Catatan perubahan status |
| `changedBy` | String | NULLABLE, FK → User.id | Admin yang mengubah (null = sistem) |
| `createdAt` | DateTime | default now() | Waktu perubahan |

**Relasi:**
- `reportId` → `Report.id` (CASCADE DELETE — hapus laporan = hapus semua history)
- `changedBy` → `User.id` (OPTIONAL)

**Contoh Data:**
```json
[
  {
    "id": "uuid",
    "reportId": "report-uuid",
    "status": "DITERIMA",
    "note": "Laporan diterima oleh sistem",
    "changedBy": null,
    "createdAt": "2026-06-01T10:30:00.000Z"
  },
  {
    "id": "uuid",
    "reportId": "report-uuid",
    "status": "DIDISPOSISI",
    "note": "Sudah dikoordinasikan dengan PUPR",
    "changedBy": "admin-uuid",
    "createdAt": "2026-06-01T14:00:00.000Z"
  }
]
```

---

### Setting

Tabel untuk menyimpan konfigurasi sistem dalam format key-value JSON.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | String (UUID) | PK, default uuid() | Primary key |
| `key` | String | UNIQUE, NOT NULL | Nama konfigurasi |
| `value` | String | NOT NULL | Nilai konfigurasi (JSON string) |
| `updatedAt` | DateTime | auto update | Waktu terakhir diupdate |

**Keys yang Digunakan:**

| Key | Value Format | Keterangan |
|---|---|---|
| `kategori` | `["Infrastruktur", "Lingkungan", ...]` | Daftar kategori laporan |
| `dinas` | `[{"nama": "...", "singkatan": "..."}]` | Daftar dinas pemerintah |

**Contoh Data:**
```json
{
  "id": "uuid",
  "key": "kategori",
  "value": "[\"Infrastruktur\",\"Lingkungan\",\"Air & Sanitasi\",\"Bencana\",\"Transportasi\",\"Pelayanan Publik\",\"Ekonomi\",\"Keamanan\",\"Pendidikan\",\"Kesehatan\"]"
}
```

---

### Wilayah

Tabel untuk menyimpan data kabupaten/kota beserta koordinat dan kecamatan.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `id` | String (UUID) | PK, default uuid() | Primary key |
| `nama` | String | UNIQUE, NOT NULL | Nama kabupaten/kota |
| `latitude` | Float | NOT NULL | Koordinat latitude untuk heatmap |
| `longitude` | Float | NOT NULL | Koordinat longitude untuk heatmap |
| `kecamatan` | String[] | default [] | Daftar kecamatan di wilayah ini |
| `createdAt` | DateTime | default now() | Waktu dibuat |

**Contoh Data:**
```json
{
  "id": "uuid",
  "nama": "Denpasar",
  "latitude": -8.65,
  "longitude": 115.2167,
  "kecamatan": [
    "Denpasar Barat",
    "Denpasar Selatan",
    "Denpasar Timur",
    "Denpasar Utara"
  ]
}
```

---

## Data 9 Kabupaten/Kota Bali

| Nama | Latitude | Longitude | Jumlah Kecamatan |
|---|---|---|---|
| Denpasar | -8.65 | 115.2167 | 4 |
| Badung | -8.5833 | 115.1833 | 6 |
| Gianyar | -8.5368 | 115.3268 | 7 |
| Tabanan | -8.54 | 115.1167 | 8 |
| Karangasem | -8.45 | 115.6 | 8 |
| Buleleng | -8.2167 | 115.0833 | 8 |
| Klungkung | -8.5333 | 115.4 | 4 |
| Bangli | -8.45 | 115.35 | 4 |
| Jembrana | -8.36 | 114.6333 | 5 |

---

## Kategori Laporan Default

| Kategori | Warna |
|---|---|
| Infrastruktur | #3e8bf3 |
| Lingkungan | #1a8c3c |
| Transportasi | #eb7600 |
| Air & Sanitasi | #0891b2 |
| Bencana | #dc2626 |
| Pelayanan Publik | #7c3aed |
| Ekonomi | #f59e0b |
| Keamanan | #374151 |
| Pendidikan | #0d9488 |
| Kesehatan | #db2777 |

---

## Dinas Default

| Nama | Singkatan |
|---|---|
| Dinas Pekerjaan Umum | PUPR |
| Dinas Lingkungan Hidup | DLH |
| PDAM | PDAM |
| BPBD | BPBD |
| Dinas Perhubungan | Dishub |
| Dinas Kesehatan | Dinkes |
| Dinas Pendidikan | Disdik |
| Dinas Sosial | Dinsos |