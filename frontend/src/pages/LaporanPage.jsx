import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import { PeriodDropdown, ProfileDropdown, ThemeToggle, SearchBar } from "../components/common/Header";
import FilterDropdown from "../components/admin/FilterDropdown";
import LaporanTable from "../components/admin/LaporanTable";
import { MOCK_LAPORAN, STATUS_OPTIONS, KATEGORI_OPTIONS, WILAYAH_OPTIONS } from "../data/laporanData";

export default function LaporanPage() {
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState({ type: "preset", value: "7d" });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterKategori, setFilterKategori] = useState("Semua Kategori");
  const [filterWilayah, setFilterWilayah] = useState("Semua Wilayah");

  // TODO: ganti dengan API call
  const rawData = MOCK_LAPORAN;

  // Filter data
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      if (filterStatus !== "Semua Status" && row.status !== filterStatus) return false;
      if (filterKategori !== "Semua Kategori" && row.kategori !== filterKategori) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !row.id.toLowerCase().includes(q) &&
          !row.text.toLowerCase().includes(q) &&
          !row.kategori.toLowerCase().includes(q) &&
          !(row.disposisi || "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [rawData, filterStatus, filterKategori, filterWilayah, search]);

  // Export handler
  const handleExport = (format) => {
    if (format === "csv") {
      const header = "No. Laporan,Text Laporan,Kategori,Urgensi,Score,Status,Disposisi,Waktu";
      const rows = filteredData.map((r) =>
        `"${r.id}","${r.text}","${r.kategori}","${r.urgensi}",${r.score},"${r.status}","${r.disposisi || "-"}","${r.waktu}"`
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ADUIN_Laporan_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    // TODO: tambahkan PDF export nanti
  };

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const textPrimary = dark ? "#e2e8f0" : "#000";

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: dark ? "#0f172a" : "#f7f9fc" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 overflow-y-auto ml-0 lg:ml-20" style={{ padding: "clamp(16px, 3vw, 32px)" }} role="main">
        <div className="max-w-[1320px] mx-auto">

          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 rounded-lg"
                style={{ color: textPrimary }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold font-raleway" style={{ color: textPrimary }}>
                  Laporan
                </h1>
                <p className="text-sm mt-1 font-pridi" style={{ color: dark ? "#64748b" : "#021d54" }}>
                  Analisis Digital Untuk Insight Nusantara
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-72">
                <svg width="20" height="20" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#626262" }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder="Cari Laporan, Lokasi...."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg text-sm font-semibold font-raleway outline-none"
                  style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(164,158,158,0.2)", color: dark ? "#e2e8f0" : "#333" }}
                />
              </div>
              <PeriodDropdown selected={period} onChange={setPeriod} />
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </header>

          {/* Divider */}
          <hr className="mb-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />

          {/* Toolbar: Export + Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            {/* Export button */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold font-raleway text-white transition hover:opacity-90"
                style={{ background: "#1d6f42" }}
                onClick={() => handleExport("csv")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Excel/PDF
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <FilterDropdown options={STATUS_OPTIONS} selected={filterStatus} onChange={setFilterStatus} />
              <FilterDropdown options={KATEGORI_OPTIONS} selected={filterKategori} onChange={setFilterKategori} />
              <FilterDropdown options={WILAYAH_OPTIONS} selected={filterWilayah} onChange={setFilterWilayah} />
            </div>
          </div>

          {/* Table */}
          <LaporanTable data={filteredData} />

          {/* Row count */}
          <p className="text-xs font-raleway mt-3" style={{ color: dark ? "#475569" : "#94a3b8" }}>
            Menampilkan {filteredData.length} dari {rawData.length} laporan
          </p>

        </div>
      </main>
    </div>
  );
}