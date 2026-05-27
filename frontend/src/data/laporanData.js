// Mock data laporan — nanti ganti dengan API call
export const MOCK_LAPORAN = [
  { id: "ADN-0847", text: "Jalan di Sesetan banyak lubang, motor sudah ada yg jatuh...", kategori: "Infrastruktur", urgensi: "Tinggi", score: 88, status: "Proses", disposisi: "Dinas PUPR", waktu: "2 Menit lalu" },
  { id: "ADN-0846", text: "TPA Suwung bau menyengat hingga ke perumahan", kategori: "Lingkungan", urgensi: "Tinggi", score: 82, status: "Belum", disposisi: null, waktu: "15 Menit lalu" },
  { id: "ADN-0845", text: "PDAM Mati 3 hari di wilayah ubud", kategori: "Air & Sanitasi", urgensi: "Tinggi", score: 79, status: "Proses", disposisi: "PDAM Gianyar", waktu: "32 Menit lalu" },
  { id: "ADN-0844", text: "Macet panjang di jalan raya canggu", kategori: "Transportasi", urgensi: "Sedang", score: 54, status: "Belum", disposisi: null, waktu: "1 Jam lalu" },
  { id: "ADN-0843", text: "Longsor di Kintamani", kategori: "Bencana", urgensi: "Tinggi", score: 92, status: "Selesai", disposisi: "BPBD Bangli", waktu: "3 Jam lalu" },
  { id: "ADN-0842", text: "Drainase tersumbat di Jl. Gatot Subroto", kategori: "Infrastruktur", urgensi: "Sedang", score: 61, status: "Proses", disposisi: "Dinas PUPR", waktu: "5 Jam lalu" },
  { id: "ADN-0841", text: "Lampu jalan mati sepanjang Jl. Bypass", kategori: "Infrastruktur", urgensi: "Rendah", score: 35, status: "Selesai", disposisi: "Dinas PUPR", waktu: "8 Jam lalu" },
  { id: "ADN-0840", text: "Sampah menumpuk di pasar Badung", kategori: "Lingkungan", urgensi: "Sedang", score: 63, status: "Belum", disposisi: null, waktu: "12 Jam lalu" },
];

export const STATUS_OPTIONS = ["Semua Status", "Belum", "Proses", "Selesai"];
export const KATEGORI_OPTIONS = ["Semua Kategori", "Infrastruktur", "Lingkungan", "Air & Sanitasi", "Transportasi", "Bencana", "Keamanan", "Ekonomi", "Pendidikan", "Kesehatan", "Pelayanan Publik"];
export const WILAYAH_OPTIONS = ["Semua Wilayah", "Denpasar", "Badung", "Gianyar", "Tabanan", "Karangasem", "Buleleng", "Klungkung", "Bangli", "Jembrana"];