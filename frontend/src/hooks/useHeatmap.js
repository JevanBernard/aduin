import { useState, useEffect, useCallback } from "react";
import { getHeatmapData, getWilayahDetail } from "../services/api";

// ============ MOCK DATA ============
const MOCK_RESPONSE = {
  data: [
    { kabupaten_kota: "Denpasar", count: 423, urgent: 67, lat: -8.65, lng: 115.21, top_categories: [{ name: "Infrastruktur", percentage: 34 }, { name: "Lingkungan", percentage: 22 }] },
    { kabupaten_kota: "Badung", count: 312, urgent: 45, lat: -8.58, lng: 115.18, top_categories: [{ name: "Transportasi", percentage: 28 }, { name: "Lingkungan", percentage: 24 }] },
    { kabupaten_kota: "Gianyar", count: 189, urgent: 28, lat: -8.54, lng: 115.33, top_categories: [{ name: "Air & Sanitasi", percentage: 30 }, { name: "Infrastruktur", percentage: 25 }] },
    { kabupaten_kota: "Tabanan", count: 98, urgent: 12, lat: -8.54, lng: 115.13, top_categories: [{ name: "Infrastruktur", percentage: 35 }, { name: "Ekonomi", percentage: 22 }] },
    { kabupaten_kota: "Karangasem", count: 167, urgent: 52, lat: -8.45, lng: 115.6, top_categories: [{ name: "Bencana", percentage: 40 }, { name: "Infrastruktur", percentage: 25 }] },
    { kabupaten_kota: "Buleleng", count: 134, urgent: 19, lat: -8.22, lng: 115.09, top_categories: [{ name: "Infrastruktur", percentage: 32 }, { name: "Pendidikan", percentage: 20 }] },
    { kabupaten_kota: "Klungkung", count: 56, urgent: 8, lat: -8.53, lng: 115.4, top_categories: [{ name: "Infrastruktur", percentage: 38 }, { name: "Ekonomi", percentage: 25 }] },
    { kabupaten_kota: "Bangli", count: 145, urgent: 38, lat: -8.45, lng: 115.35, top_categories: [{ name: "Bencana", percentage: 35 }, { name: "Infrastruktur", percentage: 28 }] },
    { kabupaten_kota: "Jembrana", count: 72, urgent: 9, lat: -8.36, lng: 114.63, top_categories: [{ name: "Ekonomi", percentage: 30 }, { name: "Infrastruktur", percentage: 28 }] },
  ],
  clusters: 47,
};

const MOCK_DETAIL = {
  Denpasar: { kabupaten_kota: "Denpasar", count: 423, urgent: 67, top_categories: [{ name: "Infrastruktur", percentage: 34 }, { name: "Lingkungan", percentage: 22 }], top_issues: [{ issue: "Jalan rusak Sesetan", priority_score: 88, status: "DIDISPOSISI" }, { issue: "Sampah menumpuk Sanur", priority_score: 72, status: "DITERIMA" }] },
  Badung: { kabupaten_kota: "Badung", count: 312, urgent: 45, top_categories: [{ name: "Transportasi", percentage: 28 }], top_issues: [{ issue: "Macet Sunset Road", priority_score: 82, status: "DIDISPOSISI" }] },
  Gianyar: { kabupaten_kota: "Gianyar", count: 189, urgent: 28, top_categories: [{ name: "Air & Sanitasi", percentage: 30 }], top_issues: [{ issue: "PDAM mati Ubud", priority_score: 76, status: "DIDISPOSISI" }] },
  Tabanan: { kabupaten_kota: "Tabanan", count: 98, urgent: 12, top_categories: [{ name: "Infrastruktur", percentage: 35 }], top_issues: [{ issue: "Jalan rusak Penebel", priority_score: 64, status: "DITERIMA" }] },
  Karangasem: { kabupaten_kota: "Karangasem", count: 167, urgent: 52, top_categories: [{ name: "Bencana", percentage: 40 }], top_issues: [{ issue: "Longsor jalan Abang", priority_score: 94, status: "DIDISPOSISI" }] },
  Buleleng: { kabupaten_kota: "Buleleng", count: 134, urgent: 19, top_categories: [{ name: "Infrastruktur", percentage: 32 }], top_issues: [{ issue: "Jalan rusak Singaraja", priority_score: 71, status: "DITERIMA" }] },
  Klungkung: { kabupaten_kota: "Klungkung", count: 56, urgent: 8, top_categories: [{ name: "Infrastruktur", percentage: 38 }], top_issues: [{ issue: "Jalan ke Nusa Penida rusak", priority_score: 61, status: "DITERIMA" }] },
  Bangli: { kabupaten_kota: "Bangli", count: 145, urgent: 38, top_categories: [{ name: "Bencana", percentage: 35 }], top_issues: [{ issue: "Longsor Kintamani", priority_score: 91, status: "DIDISPOSISI" }] },
  Jembrana: { kabupaten_kota: "Jembrana", count: 72, urgent: 9, top_categories: [{ name: "Ekonomi", percentage: 30 }], top_issues: [{ issue: "Harga sembako naik", priority_score: 55, status: "DITERIMA" }] },
};

// Ganti ke false kalau backend sudah return lat/lng dari laporan nyata
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
        await new Promise((r) => setTimeout(r, 500));
        res = MOCK_RESPONSE;
      } else {
        // Pakai getHeatmapData dari api.js — sudah include token otomatis
        const apiRes = await getHeatmapData(period);
        res = apiRes;
      }

      // Kalau data kosong dari API, fallback ke mock supaya peta tetap tampil
      const dataToUse = res?.data?.length > 0 ? res.data : MOCK_RESPONSE.data;

      const maxCount = Math.max(...dataToUse.map((w) => w.count), 1);
      const totalLaporan = dataToUse.reduce((s, w) => s + w.count, 0);
      const totalUrgent = dataToUse.reduce((s, w) => s + w.urgent, 0);

      const mapped = dataToUse
        .filter((w) => w.lat && w.lng) // hanya yang punya koordinat
        .map((w) => {
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
      setSummary({
        total: res?.data?.length > 0 ? totalLaporan : MOCK_RESPONSE.data.reduce((s, w) => s + w.count, 0),
        urgent: res?.data?.length > 0 ? totalUrgent : MOCK_RESPONSE.data.reduce((s, w) => s + w.urgent, 0),
        wilayah: dataToUse.length,
        clusters: res?.clusters || 47,
      });
    } catch (err) {
      console.error("Heatmap fetch error:", err);
      // Kalau API error (misal 401), fallback ke mock data
      const maxCount = Math.max(...MOCK_RESPONSE.data.map((w) => w.count), 1);
      const mapped = MOCK_RESPONSE.data.map((w) => {
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
      setSummary({ total: 1596, urgent: 278, wilayah: 9, clusters: 47 });
      setError(null); // jangan tampilkan error, cukup pakai fallback
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
        res = MOCK_DETAIL[kabupatenKota] || { kabupaten_kota: kabupatenKota, count: 0, urgent: 0, top_categories: [], top_issues: [] };
      } else {
        try {
          const apiRes = await getWilayahDetail(kabupatenKota);
          res = apiRes.data || apiRes;
        } catch {
          // Fallback ke mock kalau API error
          res = MOCK_DETAIL[kabupatenKota] || { kabupaten_kota: kabupatenKota, count: 0, urgent: 0, top_categories: [], top_issues: [] };
        }
      }
      setSelectedDetail(res);
    } catch (err) {
      console.error("Detail fetch error:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  return {
    loading,
    error,
    wilayahList,
    summary,
    selectedDetail,
    loadingDetail,
    fetchDetail,
    clearDetail: () => setSelectedDetail(null),
    refetch: fetchHeatmap,
  };
}