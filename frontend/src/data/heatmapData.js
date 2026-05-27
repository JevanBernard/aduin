// Data heatmap per kabupaten/kota
// TODO: Ganti dengan API call → GET /api/dashboard/heatmap
export const heatmapData = [
  { name: "Denpasar", x: "44%", y: "52%", size: 48, count: 423, urgent: 67, color: "239,68,68", opacity: 0.5, top: ["Infrastruktur (34%)", "Lingkungan (22%)", "Transportasi (18%)"] },
  { name: "Badung", x: "36%", y: "58%", size: 40, count: 312, urgent: 45, color: "239,68,68", opacity: 0.4, top: ["Transportasi (28%)", "Lingkungan (24%)", "Pariwisata (20%)"] },
  { name: "Gianyar", x: "52%", y: "40%", size: 32, count: 189, urgent: 28, color: "251,191,36", opacity: 0.45, top: ["Air & Sanitasi (30%)", "Infrastruktur (25%)", "Pariwisata (15%)"] },
  { name: "Tabanan", x: "28%", y: "42%", size: 24, count: 98, urgent: 12, color: "34,197,94", opacity: 0.4, top: ["Infrastruktur (35%)", "Ekonomi (22%)", "Pertanian (18%)"] },
  { name: "Karangasem", x: "68%", y: "32%", size: 36, count: 167, urgent: 52, color: "239,68,68", opacity: 0.45, top: ["Bencana (40%)", "Infrastruktur (25%)", "Air & Sanitasi (15%)"] },
  { name: "Buleleng", x: "42%", y: "15%", size: 28, count: 134, urgent: 19, color: "251,191,36", opacity: 0.4, top: ["Infrastruktur (32%)", "Pendidikan (20%)", "Kesehatan (18%)"] },
  { name: "Klungkung", x: "58%", y: "55%", size: 18, count: 56, urgent: 8, color: "34,197,94", opacity: 0.4, top: ["Infrastruktur (38%)", "Ekonomi (25%)", "Pelayanan Publik (15%)"] },
  { name: "Bangli", x: "55%", y: "28%", size: 30, count: 145, urgent: 38, color: "251,191,36", opacity: 0.45, top: ["Bencana (35%)", "Infrastruktur (28%)", "Transportasi (15%)"] },
  { name: "Jembrana", x: "15%", y: "48%", size: 20, count: 72, urgent: 9, color: "34,197,94", opacity: 0.4, top: ["Ekonomi (30%)", "Infrastruktur (28%)", "Lingkungan (18%)"] },
];

export const KATEGORI_FILTER = ["Semua", "Infrastruktur", "Lingkungan", "Bencana", "Air", "Transportasi"];
export const URGENSI_FILTER = [
  { label: "Semua", color: "#64748B" },
  { label: "Tinggi", color: "#DC2626" },
  { label: "Sedang", color: "#D97706" },
  { label: "Rendah", color: "#059669" },
];