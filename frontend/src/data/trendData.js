// Mock data tren — nanti ganti dengan API call GET /api/dashboard/trends
export const MOCK_TREND_LINE = {
  "7d": {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      { name: "Total Laporan", color: "#3e8bf3", data: [42, 58, 35, 67, 52, 28, 15] },
      { name: "Urgent", color: "#ff0000", data: [12, 18, 8, 22, 15, 6, 3] },
      { name: "Selesai", color: "#1a8c3c", data: [30, 35, 28, 40, 38, 22, 12] },
    ],
    subtitle: "Semua kategori · 7 hari terakhir",
  },
  "30d": {
    labels: ["Mg 1", "Mg 2", "Mg 3", "Mg 4"],
    datasets: [
      { name: "Total Laporan", color: "#3e8bf3", data: [320, 480, 410, 390] },
      { name: "Urgent", color: "#ff0000", data: [85, 120, 95, 88] },
      { name: "Selesai", color: "#1a8c3c", data: [210, 350, 310, 280] },
    ],
    subtitle: "Semua kategori · 30 hari terakhir",
  },
  "90d": {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { name: "Total Laporan", color: "#3e8bf3", data: [1200, 1450, 1380] },
      { name: "Urgent", color: "#ff0000", data: [280, 340, 310] },
      { name: "Selesai", color: "#1a8c3c", data: [890, 1050, 980] },
    ],
    subtitle: "Semua kategori · 90 hari terakhir",
  },
};

export const MOCK_DISTRIBUSI = [
  { name: "Infrastruktur", percentage: 28, color: "#3e8bf3" },
  { name: "Lingkungan", percentage: 22, color: "#1a8c3c" },
  { name: "Transportasi", percentage: 16, color: "#eb7600" },
  { name: "Air & Sanitasi", percentage: 12, color: "#0891b2" },
  { name: "Bencana", percentage: 9, color: "#dc2626" },
  { name: "Pelayanan Publik", percentage: 7, color: "#7c3aed" },
  { name: "Lainnya", percentage: 6, color: "#94a3b8" },
];

export const MOCK_TOP_WILAYAH = [
  { rank: 1, name: "Denpasar", count: 412 },
  { rank: 2, name: "Badung", count: 320 },
  { rank: 3, name: "Gianyar", count: 256 },
  { rank: 4, name: "Karangasem", count: 123 },
  { rank: 5, name: "Buleleng", count: 28 },
];