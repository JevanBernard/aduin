// Mock data - nanti diganti dengan API call ke backend
export const PERIODS = ["7 Hari Terakhir", "30 Hari Terakhir", "90 Hari Terakhir"];
export const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export const dashboardData = {
  "7 Hari Terakhir": {
    stats: {
      total: "1.247",
      urgent: 23,
      kategori: "Infrastruktur",
      belum: 150,
      proses: 350,
      selesai: 1200,
    },
    priority: [
      { rank: 1, issue: "Banjir Kec. Denpasar Selatan", score: 95 },
      { rank: 2, issue: "Jalan Rusak Jl. Sesetan", score: 88 },
      { rank: 3, issue: "PDAM Mati Ubud", score: 76 },
      { rank: 4, issue: "Sampah TPA Suwung", score: 71 },
      { rank: 5, issue: "Macet Sunset Road", score: 54 },
    ],
    trend: [65, 80, 45, 20, 5, 55, 42, 48, 42, 120, 110, 98],
  },
  "30 Hari Terakhir": {
    stats: {
      total: "4.892",
      urgent: 87,
      kategori: "Lingkungan",
      belum: 420,
      proses: 1100,
      selesai: 3372,
    },
    priority: [
      { rank: 1, issue: "Sampah Pantai Kuta", score: 97 },
      { rank: 2, issue: "Banjir Kec. Denpasar Selatan", score: 93 },
      { rank: 3, issue: "Longsor Kintamani", score: 89 },
      { rank: 4, issue: "PDAM Mati Ubud", score: 78 },
      { rank: 5, issue: "Jalan Rusak Jl. Sesetan", score: 72 },
    ],
    trend: [180, 220, 160, 95, 40, 190, 155, 165, 160, 380, 350, 310],
  },
  "90 Hari Terakhir": {
    stats: {
      total: "12.340",
      urgent: 234,
      kategori: "Infrastruktur",
      belum: 890,
      proses: 2800,
      selesai: 8650,
    },
    priority: [
      { rank: 1, issue: "Infrastruktur Jalan Provinsi", score: 98 },
      { rank: 2, issue: "Krisis Air Karangasem", score: 95 },
      { rank: 3, issue: "Sampah Pantai Selatan", score: 91 },
      { rank: 4, issue: "Banjir Denpasar", score: 86 },
      { rank: 5, issue: "Kemacetan Badung", score: 79 },
    ],
    trend: [450, 580, 420, 280, 120, 490, 400, 430, 410, 920, 870, 780],
  },
};
