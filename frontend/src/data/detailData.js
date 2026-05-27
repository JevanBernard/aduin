// Mock data detail laporan — nanti ganti dengan API call GET /api/reports/:id
export const MOCK_DETAIL = {
  "ADN-0847": {
    id: "ADN-20260422-0847",
    text: "Jalan di daerah Sesetan banyak lubang besar, motor sudah ada yang jatuh dan luka-luka. Sudah dilaporkan berkali-kali tapi tidak ada perbaikan. Tolong segera ditangani.",
    photos: [null, null, null], // placeholder — nanti URL gambar
    analisis: {
      kategori: { label: "Infrastruktur", color: "#3e8bf3", bg: "rgba(62,139,243,0.2)" },
      urgensi: { label: "Tinggi", color: "#ff0000", bg: "rgba(255,0,0,0.2)" },
      score: { label: "88/100", color: "#ff7700", bg: "rgba(255,119,0,0.2)" },
      lokasi: { label: "Sesetan, Denpasar", color: "#1a8c3c", bg: "rgba(26,140,60,0.2)" },
      cluster: { label: "#12 - Jalan Rusak Sesetan (47 laporan)", color: "#3e8bf3", bg: "rgba(62,139,243,0.2)" },
    },
    pelapor: {
      nama: "Anonim",
      tanggal: "22 April 2026, 14:32 WITA",
      sumber: "Form Warga",
    },
    status: "Proses",
    disposisi: "Dinas Pekerjaan Umum",
    catatan: "",
  },
  "ADN-0846": {
    id: "ADN-20260422-0846",
    text: "TPA Suwung bau menyengat hingga ke perumahan warga. Sudah bertahun-tahun tidak ada solusi.",
    photos: [null],
    analisis: {
      kategori: { label: "Lingkungan", color: "#1a8c3c", bg: "rgba(26,140,60,0.2)" },
      urgensi: { label: "Tinggi", color: "#ff0000", bg: "rgba(255,0,0,0.2)" },
      score: { label: "82/100", color: "#ff7700", bg: "rgba(255,119,0,0.2)" },
      lokasi: { label: "Suwung, Denpasar", color: "#1a8c3c", bg: "rgba(26,140,60,0.2)" },
      cluster: { label: "#8 - Sampah TPA Suwung (31 laporan)", color: "#3e8bf3", bg: "rgba(62,139,243,0.2)" },
    },
    pelapor: { nama: "Anonim", tanggal: "22 April 2026, 14:47 WITA", sumber: "Form Warga" },
    status: "Belum",
    disposisi: "",
    catatan: "",
  },
};

export const STATUS_CHOICES = ["Belum", "Proses", "Selesai"];
export const DINAS_CHOICES = [
  "Pilih Dinas...",
  "Dinas Pekerjaan Umum",
  "Dinas Lingkungan Hidup",
  "PDAM",
  "BPBD",
  "Dinas Perhubungan",
  "Dinas Kesehatan",
  "Dinas Pendidikan",
  "Dinas Sosial",
  "Dinas Kominfo",
];