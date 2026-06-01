import { useState, useEffect, useCallback } from "react";

// ============ MOCK DATA (hapus setelah backend jadi) ============
const MOCK_RESPONSE = {
  data: [
    { kabupaten_kota: "Denpasar", count: 423, urgent: 67, lat: -8.65, lng: 115.21, top_categories: [{ name: "Infrastruktur", percentage: 34 }, { name: "Lingkungan", percentage: 22 }, { name: "Transportasi", percentage: 18 }] },
    { kabupaten_kota: "Badung", count: 312, urgent: 45, lat: -8.58, lng: 115.18, top_categories: [{ name: "Transportasi", percentage: 28 }, { name: "Lingkungan", percentage: 24 }, { name: "Pariwisata", percentage: 20 }] },
    { kabupaten_kota: "Gianyar", count: 189, urgent: 28, lat: -8.54, lng: 115.33, top_categories: [{ name: "Air & Sanitasi", percentage: 30 }, { name: "Infrastruktur", percentage: 25 }, { name: "Pariwisata", percentage: 15 }] },
    { kabupaten_kota: "Tabanan", count: 98, urgent: 12, lat: -8.54, lng: 115.13, top_categories: [{ name: "Infrastruktur", percentage: 35 }, { name: "Ekonomi", percentage: 22 }, { name: "Pertanian", percentage: 18 }] },
    { kabupaten_kota: "Karangasem", count: 167, urgent: 52, lat: -8.45, lng: 115.6, top_categories: [{ name: "Bencana", percentage: 40 }, { name: "Infrastruktur", percentage: 25 }, { name: "Air & Sanitasi", percentage: 15 }] },
    { kabupaten_kota: "Buleleng", count: 134, urgent: 19, lat: -8.22, lng: 115.09, top_categories: [{ name: "Infrastruktur", percentage: 32 }, { name: "Pendidikan", percentage: 20 }, { name: "Kesehatan", percentage: 18 }] },
    { kabupaten_kota: "Klungkung", count: 56, urgent: 8, lat: -8.53, lng: 115.4, top_categories: [{ name: "Infrastruktur", percentage: 38 }, { name: "Ekonomi", percentage: 25 }, { name: "Pelayanan Publik", percentage: 15 }] },
    { kabupaten_kota: "Bangli", count: 145, urgent: 38, lat: -8.45, lng: 115.35, top_categories: [{ name: "Bencana", percentage: 35 }, { name: "Infrastruktur", percentage: 28 }, { name: "Transportasi", percentage: 15 }] },
    { kabupaten_kota: "Jembrana", count: 72, urgent: 9, lat: -8.36, lng: 114.63, top_categories: [{ name: "Ekonomi", percentage: 30 }, { name: "Infrastruktur", percentage: 28 }, { name: "Lingkungan", percentage: 18 }] },
  ],
  clusters: 47,
};

const MOCK_DETAIL = {
  Denpasar: {
    kabupaten_kota: "Denpasar", count: 423, urgent: 67,
    top_categories: [{ name: "Infrastruktur", percentage: 34 }, { name: "Lingkungan", percentage: 22 }, { name: "Transportasi", percentage: 18 }],
    top_issues: [
      { issue: "Jalan rusak area Sesetan", priority_score: 88, status: "DIDISPOSISI" },
      { issue: "Sampah menumpuk Sanur", priority_score: 72, status: "DITERIMA" },
      { issue: "PDAM mati Renon", priority_score: 65, status: "DITINDAKLANJUTI" },
    ],
  },
  Badung: {
    kabupaten_kota: "Badung", count: 312, urgent: 45,
    top_categories: [{ name: "Transportasi", percentage: 28 }, { name: "Lingkungan", percentage: 24 }, { name: "Pariwisata", percentage: 20 }],
    top_issues: [
      { issue: "Macet Sunset Road", priority_score: 82, status: "DIDISPOSISI" },
      { issue: "Sampah Pantai Kuta", priority_score: 76, status: "DITERIMA" },
      { issue: "Parkir liar Seminyak", priority_score: 58, status: "DITINDAKLANJUTI" },
    ],
  },
  Gianyar: {
    kabupaten_kota: "Gianyar", count: 189, urgent: 28,
    top_categories: [{ name: "Air & Sanitasi", percentage: 30 }, { name: "Infrastruktur", percentage: 25 }, { name: "Pariwisata", percentage: 15 }],
    top_issues: [
      { issue: "PDAM mati Ubud", priority_score: 76, status: "DIDISPOSISI" },
      { issue: "Jalan rusak Tegallalang", priority_score: 68, status: "DITERIMA" },
      { issue: "Limbah hotel Ubud", priority_score: 55, status: "SELESAI" },
    ],
  },
  Tabanan: {
    kabupaten_kota: "Tabanan", count: 98, urgent: 12,
    top_categories: [{ name: "Infrastruktur", percentage: 35 }, { name: "Ekonomi", percentage: 22 }, { name: "Pertanian", percentage: 18 }],
    top_issues: [
      { issue: "Jalan rusak Penebel", priority_score: 64, status: "DITERIMA" },
      { issue: "Irigasi sawah rusak", priority_score: 52, status: "DITERIMA" },
      { issue: "Pasar tradisional sepi", priority_score: 41, status: "SELESAI" },
    ],
  },
  Karangasem: {
    kabupaten_kota: "Karangasem", count: 167, urgent: 52,
    top_categories: [{ name: "Bencana", percentage: 40 }, { name: "Infrastruktur", percentage: 25 }, { name: "Air & Sanitasi", percentage: 15 }],
    top_issues: [
      { issue: "Longsor jalan Abang", priority_score: 94, status: "DIDISPOSISI" },
      { issue: "Krisis air Kubu", priority_score: 85, status: "DITERIMA" },
      { issue: "Jembatan rusak Bebandem", priority_score: 72, status: "DITINDAKLANJUTI" },
    ],
  },
  Buleleng: {
    kabupaten_kota: "Buleleng", count: 134, urgent: 19,
    top_categories: [{ name: "Infrastruktur", percentage: 32 }, { name: "Pendidikan", percentage: 20 }, { name: "Kesehatan", percentage: 18 }],
    top_issues: [
      { issue: "Jalan provinsi rusak Seririt", priority_score: 71, status: "DIDISPOSISI" },
      { issue: "SD atap bocor Banjar", priority_score: 62, status: "DITERIMA" },
      { issue: "Puskesmas kekurangan obat", priority_score: 58, status: "DITERIMA" },
    ],
  },
  Klungkung: {
    kabupaten_kota: "Klungkung", count: 56, urgent: 8,
    top_categories: [{ name: "Infrastruktur", percentage: 38 }, { name: "Ekonomi", percentage: 25 }, { name: "Pelayanan Publik", percentage: 15 }],
    top_issues: [
      { issue: "Jalan ke Nusa Penida rusak", priority_score: 61, status: "DITERIMA" },
      { issue: "Pelabuhan sampan sempit", priority_score: 48, status: "SELESAI" },
      { issue: "Perizinan lambat", priority_score: 35, status: "SELESAI" },
    ],
  },
  Bangli: {
    kabupaten_kota: "Bangli", count: 145, urgent: 38,
    top_categories: [{ name: "Bencana", percentage: 35 }, { name: "Infrastruktur", percentage: 28 }, { name: "Transportasi", percentage: 15 }],
    top_issues: [
      { issue: "Longsor Kintamani", priority_score: 91, status: "DIDISPOSISI" },
      { issue: "Jalan ke Songan rusak", priority_score: 78, status: "DITERIMA" },
      { issue: "Angkutan umum langka", priority_score: 52, status: "DITERIMA" },
    ],
  },
  Jembrana: {
    kabupaten_kota: "Jembrana", count: 72, urgent: 9,
    top_categories: [{ name: "Ekonomi", percentage: 30 }, { name: "Infrastruktur", percentage: 28 }, { name: "Lingkungan", percentage: 18 }],
    top_issues: [
      { issue: "Harga sembako naik Negara", priority_score: 55, status: "DITERIMA" },
      { issue: "Polusi Pengambengan", priority_score: 48, status: "DITINDAKLANJUTI" },
      { issue: "Jalan berlubang Melaya", priority_score: 42, status: "SELESAI" },
    ],
  },
};

// Set USE_MOCK = false kalau backend sudah jadi
const USE_MOCK = false;
// ============ END MOCK ============

function getUrgencyColor(urgent, total) {
  const ratio = total > 0 ? urgent / total : 0;
  if (ratio >= 0.3) return { color: "239,68,68", opacity: 0.5 };
  if (ratio >= 0.15) return { color: "251,191,36", opacity: 0.45 };
  return { color: "34,197,94", opacity: 0.4 };
}

function getBubbleSize(count, maxCount) {
  const min = 18, max = 52;
  if (maxCount === 0) return min;
  return Math.round(min + (count / maxCount) * (max - min));
}

export default function useHeatmap(period) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wilayahList, setWilayahList] = useState([]);
  const [summary, setSummary] = useState({ total: 0, urgent: 0, wilayah: 0, clusters: 0 });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchHeatmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (USE_MOCK) {
        // Simulasi delay network
        await new Promise((r) => setTimeout(r, 500));
        res = MOCK_RESPONSE;
      } else {
        // Nanti ganti ke ini kalau backend sudah jadi:
        const response = await fetch(`/api/dashboard/heatmap?period=${period}`);
        res = await response.json();
      }

      const maxCount = Math.max(...res.data.map((w) => w.count), 1);
      const totalLaporan = res.data.reduce((s, w) => s + w.count, 0);
      const totalUrgent = res.data.reduce((s, w) => s + w.urgent, 0);

      const mapped = res.data.map((w) => {
        const { color, opacity } = getUrgencyColor(w.urgent, w.count);
        return {
          name: w.kabupaten_kota,
          lat: w.lat,
          lng: w.lng,
          size: getBubbleSize(w.count, maxCount),
          count: w.count,
          urgent: w.urgent,
          color,
          opacity,
          topCategories: w.top_categories || [],
        };
      });

      setWilayahList(mapped);
      setSummary({ total: totalLaporan, urgent: totalUrgent, wilayah: res.data.length, clusters: res.clusters || 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchHeatmap(); }, [fetchHeatmap]);

  const fetchDetail = useCallback(async (kabupatenKota) => {
    setLoadingDetail(true);
    try {
      let res;
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        res = MOCK_DETAIL[kabupatenKota] || {
          kabupaten_kota: kabupatenKota,
          count: 0, urgent: 0,
          top_categories: [], top_issues: [],
        };
      } else {
        const response = await fetch(`/api/dashboard/heatmap/${encodeURIComponent(kabupatenKota)}`);
        res = await response.json();
      }
      setSelectedDetail(res);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  return {
    loading, error, wilayahList, summary,
    selectedDetail, loadingDetail,
    fetchDetail,
    clearDetail: () => setSelectedDetail(null),
    refetch: fetchHeatmap,
  };
}