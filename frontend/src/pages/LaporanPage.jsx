import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import { PeriodDropdown, ProfileDropdown, ThemeToggle } from "../components/common/Header";
import FilterDropdown from "../components/admin/FilterDropdown";
import LaporanTable from "../components/admin/LaporanTable";
import { MOCK_LAPORAN, STATUS_OPTIONS } from "../data/laporanData";
import { getReports } from "../services/api";
import { useSearchParams } from "react-router-dom";
import { useKategori } from "../hooks/useSettings";
import { useWilayahOptions } from "../hooks/useWilayahOptions";

const ITEMS_PER_PAGE = 10;

export default function LaporanPage() {
  const { dark } = useTheme();
  const [searchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState({ type: "preset", value: "7d" });
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterKategori, setFilterKategori] = useState("Semua Kategori");
  const [currentPage, setCurrentPage] = useState(1);
  const { kategori: kategoriList } = useKategori();
  const KATEGORI_OPTIONS_DYNAMIC = ["Semua Kategori", ...kategoriList];
  const wilayahOptions = useWilayahOptions();

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFromAPI, setTotalFromAPI] = useState(0);

  const [filterWilayah, setFilterWilayah] = useState(
  searchParams.get("wilayah") || "Semua Wilayah"
  );

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const statusMap = {
          "Belum": "DITERIMA",
          "Proses": "DITINDAKLANJUTI",
          "Selesai": "SELESAI",
        };

        const params = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          ...(search && { search }),
          ...(filterStatus !== "Semua Status" && { status: statusMap[filterStatus] || filterStatus }),
          ...(filterKategori !== "Semua Kategori" && { kategori: filterKategori }),
          ...(filterWilayah !== "Semua Wilayah" && { wilayah: filterWilayah }),
          period: period.type === "preset" ? period.value : "custom",
        };

        const res = await getReports(params);
        setRawData(res.data || []);
        setTotalFromAPI(res.pagination?.total || 0);
      } catch (err) {
        console.error("Gagal fetch laporan:", err);
        setRawData(MOCK_LAPORAN);
        setTotalFromAPI(MOCK_LAPORAN.length);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, search, filterStatus, filterKategori, filterWilayah, period]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterKategori, filterWilayah, period]);

  const totalPages = Math.max(1, Math.ceil(totalFromAPI / ITEMS_PER_PAGE));

  // Format data — id pakai reportNumber untuk URL, dbId pakai UUID
  const formattedData = rawData.map((r) => ({
    id: r.reportNumber,       // ← reportNumber untuk navigate & tampilan
    dbId: r.id,               // ← UUID disimpan tapi tidak dipakai di navigate
    text: r.text,
    kategori: r.categories?.[0] || "-",
    urgensi: r.urgensi === "tinggi" ? "Tinggi"
      : r.urgensi === "sedang" ? "Sedang"
      : r.urgensi === "rendah" ? "Rendah"
      : "-",
    score: r.priorityScore ? Math.round(r.priorityScore) : 0,
    status: r.status === "DITERIMA" || r.status === "DIANALISIS" ? "Belum"
      : r.status === "SELESAI" ? "Selesai"
      : "Proses",
    disposisi: r.disposisiDinas || null,
    waktu: new Date(r.createdAt).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    }),
  }));

  const handleExport = () => {
    const header = "No. Laporan,Text Laporan,Kategori,Urgensi,Score,Disposisi,Waktu,Status";
    const rows = formattedData.map((r) =>
      `"${r.id}","${r.text}","${r.kategori}","${r.urgensi}",${r.score},"${r.disposisi || "-"}","${r.waktu}","${r.status}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADUIN_Laporan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const textPrimary = dark ? "#e2e8f0" : "#000";

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#0f172a" : "#f7f9fc" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 overflow-y-auto ml-0 lg:ml-20" style={{ padding: "clamp(16px, 3vw, 32px)" }} role="main">
        <div className="max-w-[1320px] mx-auto">

          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2 rounded-lg" style={{ color: textPrimary }} onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold font-raleway" style={{ color: textPrimary }}>Laporan</h1>
                <p className="text-sm mt-1 font-pridi" style={{ color: dark ? "#64748b" : "#021d54" }}>Analisis Digital Untuk Insight Nusantara</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              {/* Search */}
              <div className="relative w-72">
                <svg width="20" height="20" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#626262" }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="search" placeholder="Cari Laporan, Lokasi...." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg text-sm font-semibold font-raleway outline-none"
                  style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(164,158,158,0.2)", color: dark ? "#e2e8f0" : "#333" }} />
              </div>

              {/* Period + Theme + Profile */}
              <div className="flex items-center gap-2.5">
                <PeriodDropdown selected={period} onChange={setPeriod} />
                <ThemeToggle />
                <ProfileDropdown />
              </div>
            </div>
          </header>

          <hr className="mb-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold font-raleway text-white transition hover:opacity-90"
              style={{ background: "#1d6f42" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
            <div className="flex items-center gap-2">
              <FilterDropdown options={STATUS_OPTIONS} selected={filterStatus} onChange={setFilterStatus} />
              <FilterDropdown options={KATEGORI_OPTIONS_DYNAMIC} selected={filterKategori} onChange={setFilterKategori} />
              <FilterDropdown options={wilayahOptions} selected={filterWilayah} onChange={setFilterWilayah} />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-raleway" style={{ color: dark ? "#64748b" : "#94a3b8" }}>Memuat laporan...</span>
            </div>
          )}

          {/* Table */}
          <LaporanTable
            data={formattedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Count */}
          <p className="text-xs font-raleway mt-3" style={{ color: dark ? "#475569" : "#94a3b8" }}>
            Menampilkan {formattedData.length} dari {totalFromAPI} laporan
          </p>

        </div>
      </main>
    </div>
  );
}