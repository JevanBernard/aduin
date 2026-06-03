import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import HeatmapMap from "../components/admin/HeatmapMap";
import HeatmapPanel from "../components/admin/HeatmapPanel";
import useHeatmap from "../hooks/useHeatmap";
import { PeriodDropdown } from "../components/common/Header";
import { useState, useEffect, useRef } from "react";
import { useKategori } from "../hooks/useSettings";
import { URGENSI_FILTER } from "../data/heatmapData";

export default function PetaPage() {
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [filterKat, setFilterKat] = useState("Semua");
  const [filterUrg, setFilterUrg] = useState("Semua");
  const [period, setPeriod] = useState({ type: "preset", value: "7d" });
  const [exportMenu, setExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Untuk dikirim ke useHeatmap, convert jadi string query
  const getPeriodQuery = () => {
    if (period.type === "preset") return period.value;
    if (period.type === "custom") return `custom&start=${period.start}&end=${period.end}`;
    return "7d";
};

  const { kategori: kategoriList } = useKategori();
  const kategoriFilter = ["Semua", ...kategoriList];

  // Data dari API via custom hook
  const {
    loading, error, wilayahList, summary,
    selectedDetail, loadingDetail,
    fetchDetail, clearDetail,
  } = useHeatmap(getPeriodQuery());

  // Ketika user klik wilayah di peta
  function handleSelectWilayah(idx) {
        setSelectedIdx(idx);
        if (wilayahList[idx]) {
            fetchDetail(wilayahList[idx].name);
        }
    }

  const handleClose = () => {
    setSelectedIdx(null);
    clearDetail();
  };

  // Filter data berdasarkan kategori & urgensi
  const filteredData = wilayahList.filter((w) => {
    // Filter urgensi
    if (filterUrg === "Tinggi" && w.urgent / w.count < 0.3) return false;
    if (filterUrg === "Sedang" && (w.urgent / w.count >= 0.3 || w.urgent / w.count < 0.15)) return false;
    if (filterUrg === "Rendah" && w.urgent / w.count >= 0.15) return false;

    // Filter kategori — cek apakah wilayah punya kategori tersebut di topCategories
    if (filterKat !== "Semua") {
      const hasKategori = w.topCategories?.some(
        (cat) => cat.name.toLowerCase().includes(filterKat.toLowerCase())
      );
      if (!hasKategori) return false;
    }

    return true;
  });

  useEffect(() => {
    const handle = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportMenu(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleExportCSV = () => {
    const header = "Kabupaten/Kota,Total Laporan,Urgent,Persentase Urgent";
    const rows = wilayahList.map((w) =>
      `"${w.name}",${w.count},${w.urgent},${w.count > 0 ? Math.round((w.urgent / w.count) * 100) : 0}%`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADUIN_Peta_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenu(false);
  };

  const handleExportJSON = () => {
    const data = {
      exported_at: new Date().toISOString(),
      period: period.type === "preset" ? period.value : `${period.start} - ${period.end}`,
      summary,
      wilayah: wilayahList.map((w) => ({
        nama: w.name,
        total: w.count,
        urgent: w.urgent,
        latitude: w.lat,
        longitude: w.lng,
        top_categories: w.topCategories,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADUIN_Peta_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenu(false);
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{ background: dark ? "#0f172a" : "#f7f9fc" }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 flex flex-col ml-0 lg:ml-20" role="main">
        {/* Topbar */}
        <header
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 rounded-lg shrink-0"
              style={{ color: dark ? "#e2e8f0" : "#000" }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold font-raleway truncate" style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>
                Peta Sebaran Masalah
              </h1>
              <p className="text-xs font-raleway" style={{ color: dark ? "#475569" : "#94a3b8" }}>
                ADUIN — Heatmap Interaktif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PeriodDropdown selected={period} onChange={(val) => { setPeriod(val); handleClose(); }} />
            
            {/* Export button — sama seperti halaman lain */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenu(!exportMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold font-raleway text-white transition hover:opacity-90"
                style={{ background: "#1d6f42" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
                <svg width="9" height="9" viewBox="0 0 12 12" className={`transition-transform ${exportMenu ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {exportMenu && (
                <div
                  className="absolute top-full right-0 mt-1 rounded-lg overflow-hidden z-50"
                  style={{
                    background: dark ? "#1e293b" : "#fff",
                    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    minWidth: 180,
                  }}
                >
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-3 w-full px-4 py-3 text-xs font-raleway font-semibold text-left transition hover:opacity-80"
                    style={{ color: dark ? "#e2e8f0" : "#333" }}
                  >
                    <span style={{ color: "#1d6f42" }}>📊</span> Export CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-3 w-full px-4 py-3 text-xs font-raleway font-semibold text-left transition hover:opacity-80"
                    style={{ color: dark ? "#e2e8f0" : "#333", borderTop: `1px solid ${dark ? "#334155" : "#f1f5f9"}` }}
                  >
                    <span style={{ color: "#3e8bf3" }}>📄</span> Export JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Loading / Error state */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm font-raleway animate-pulse" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
              Memuat data peta...
            </p>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-sm font-raleway text-red-500">Gagal memuat data: {error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-raleway">
              Coba Lagi
            </button>
          </div>
        )}

        {/* Content: Map + Panel */}
        {!loading && !error && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <HeatmapMap
              data={filteredData}
              selectedIdx={selectedIdx}
              onSelectWilayah={handleSelectWilayah}
              filterKat={filterKat}
              onFilterKat={setFilterKat}
              filterUrg={filterUrg}
              onFilterUrg={setFilterUrg}
              kategoriFilter={kategoriFilter}
              urgensiFilter={URGENSI_FILTER.map(u => u.label)}
            />

            <HeatmapPanel
              data={wilayahList}
              summary={summary}
              selectedDetail={selectedDetail}
              loadingDetail={loadingDetail}
              selectedIdx={selectedIdx}
              onSelectWilayah={handleSelectWilayah}
              onClose={handleClose}
            />
          </div>
        )}
      </main>
    </div>
  );
}