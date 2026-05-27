import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import HeatmapMap from "../components/admin/HeatmapMap";
import HeatmapPanel from "../components/admin/HeatmapPanel";
import useHeatmap from "../hooks/useHeatmap";
import { PeriodDropdown } from "../components/common/Header";

export default function PetaPage() {
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [filterKat, setFilterKat] = useState("Semua");
  const [filterUrg, setFilterUrg] = useState("Semua");
  const [period, setPeriod] = useState({ type: "preset", value: "7d" });

  // Untuk dikirim ke useHeatmap, convert jadi string query
  const getPeriodQuery = () => {
    if (period.type === "preset") return period.value;
    if (period.type === "custom") return `custom&start=${period.start}&end=${period.end}`;
    return "7d";
};

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
    if (filterUrg === "Tinggi" && w.urgent / w.count < 0.3) return false;
    if (filterUrg === "Sedang" && (w.urgent / w.count >= 0.3 || w.urgent / w.count < 0.15)) return false;
    if (filterUrg === "Rendah" && w.urgent / w.count >= 0.15) return false;
    // Kategori filter bisa ditambah logic nanti kalau data top_categories ada
    return true;
  });

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{ background: dark ? "#0f172a" : "#f7f9fc" }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 flex flex-col ml-0 lg:ml-20" role="main">
        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}` }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg"
              style={{ color: dark ? "#e2e8f0" : "#000" }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold font-raleway" style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>
                Peta Sebaran Masalah
              </h1>
              <p className="text-xs font-raleway" style={{ color: dark ? "#475569" : "#94a3b8" }}>
                ADUIN — Heatmap Interaktif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Period selector */}
            {/* Period selector - pakai PeriodDropdown yang sama dengan dashboard */}
                <PeriodDropdown selected={period} onChange={(val) => { setPeriod(val); handleClose(); }} />
            <button
              className="px-3 py-1.5 rounded-md text-xs font-semibold font-raleway"
              style={{
                border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                color: dark ? "#94a3b8" : "#64748b",
                background: dark ? "#1e293b" : "#fff",
              }}
            >
              Export ↓
            </button>
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