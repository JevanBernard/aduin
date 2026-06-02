import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "../components/common/Sidebar";
import { PeriodDropdown, ThemeToggle, ProfileDropdown } from "../components/common/Header";
import FilterDropdown from "../components/admin/FilterDropdown";
import { MOCK_TREND_LINE, MOCK_DISTRIBUSI, MOCK_TOP_WILAYAH } from "../data/trendData";
import { STATUS_OPTIONS, KATEGORI_OPTIONS } from "../data/laporanData";
import { getTrends, getDistribusi, getTopWilayah } from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { useWilayahOptions } from "../hooks/useWilayahOptions";

export default function TrendPage() {
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState({ type: "preset", value: "30d" });
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterKategori, setFilterKategori] = useState("Semua Kategori");
  const [filterWilayah, setFilterWilayah] = useState("Semua Wilayah");
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);
  const [trendData, setTrendData] = useState(MOCK_TREND_LINE["30d"]);
  const [distribusiData, setDistribusiData] = useState(MOCK_DISTRIBUSI);
  const [topWilayahData, setTopWilayahData] = useState(MOCK_TOP_WILAYAH);

  const contentRef = useRef(null);
  const exportMenuRef = useRef(null);

  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const wilayahOptions = useWilayahOptions();

  // Fetch semua data saat period berubah
  useEffect(() => {
  // Build params object dengan filter
  const params = {
    ...(filterKategori !== "Semua Kategori" && { kategori: filterKategori }),
    ...(filterWilayah !== "Semua Wilayah" && { wilayah: filterWilayah }),
    ...(filterStatus !== "Semua Status" && { status: filterStatus }),
  };

  // Helper untuk tambah filter ke period object
  const periodWithFilter = { ...period, ...params };

    getTrends(periodWithFilter)
    .then((res) => { if (res?.data) setTrendData(res.data); })
    .catch(() => {
      const key = period.type === "preset" ? period.value : "30d";
      setTrendData(MOCK_TREND_LINE[key] || MOCK_TREND_LINE["30d"]);
    });

    getDistribusi(periodWithFilter)
      .then((res) => { if (res?.data) setDistribusiData(res.data); })
      .catch(() => setDistribusiData(MOCK_DISTRIBUSI));

    getTopWilayah(periodWithFilter)
      .then((res) => { if (res?.data) setTopWilayahData(res.data); })
      .catch(() => setTopWilayahData(MOCK_TOP_WILAYAH));

  }, [period, filterKategori, filterWilayah, filterStatus]);

  const chartData = useMemo(() => {
    return trendData.labels.map((label, i) => {
      const point = { name: label };
      trendData.datasets.forEach((ds) => {
        point[ds.name] = ds.data[i];
      });
      return point;
    });
  }, [trendData]);

  useEffect(() => {
    const handle = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportMenu(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const handleExportCSV = () => {
    const header = ["Periode", ...trendData.datasets.map((d) => d.name)];
    const rows = trendData.labels.map((label, i) => [label, ...trendData.datasets.map((d) => d.data[i])]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADUIN_Tren_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenu(false);
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) { alert("Area konten tidak ditemukan"); return; }
    setExporting(true);
    setExportMenu(false);
    await new Promise((r) => setTimeout(r, 300));
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: dark ? "#0f172a" : "#f7f9fc",
        logging: false,
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("ADUIN - Analisis Tren", 14, 15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Periode: ${trendData.subtitle} | Diekspor: ${new Date().toLocaleDateString("id-ID")}`, 14, 22);
      const imgWidth = pdfWidth - 28;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      pdf.addImage(imgData, "PNG", 14, 28, imgWidth, Math.min(imgHeight, pdfHeight - 35));
      pdf.save(`ADUIN_Tren_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Export PDF gagal:", err);
      alert("Gagal export PDF. Coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  const textPrimary = dark ? "#e2e8f0" : "#000";
  const textSecondary = dark ? "#94a3b8" : "#626262";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)";
  const cardShadow = dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.05)" : "none";
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,26,0.1)";

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
                <h1 className="text-3xl lg:text-5xl font-bold font-raleway" style={{ color: textPrimary }}>Analisis Tren</h1>
                <p className="text-sm mt-1 font-pridi" style={{ color: dark ? "#64748b" : "#021d54" }}>Analisis Digital Untuk Insight Nusantara</p>
              </div>
            </div>

            {/* Kanan: search + period + theme + profile */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (searchValue.trim()) navigate(`/laporan?search=${encodeURIComponent(searchValue.trim())}`);
              }}>
                <div className="relative w-72">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#626262" }}>
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Cari Laporan, Lokasi...."
                    className="w-full pl-11 pr-4 py-3 rounded-lg text-sm font-semibold font-raleway outline-none"
                    style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(164,158,158,0.2)", color: dark ? "#e2e8f0" : "#333" }}
                  />
                </div>
              </form>
              <PeriodDropdown selected={period} onChange={setPeriod} />
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </header>

          <hr className="mb-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenu(!exportMenu)}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold font-raleway text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "#1d6f42" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {exporting ? "Mengekspor..." : "Export CSV"}
                <svg width="9" height="9" viewBox="0 0 12 12" className={`transition-transform ${exportMenu ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {exportMenu && (
                <div
                  className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-50"
                  style={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200 }}
                >
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-raleway font-semibold text-left transition hover:opacity-80"
                    style={{ color: dark ? "#e2e8f0" : "#333" }}
                  >
                    <span style={{ color: "#1d6f42" }}>📊</span> Export CSV (Excel)
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-raleway font-semibold text-left transition hover:opacity-80"
                    style={{ color: dark ? "#e2e8f0" : "#333", borderTop: `1px solid ${dark ? "#334155" : "#f1f5f9"}` }}
                  >
                    <span style={{ color: "#dc2626" }}>📄</span> Export PDF (dengan grafik)
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <FilterDropdown options={STATUS_OPTIONS} selected={filterStatus} onChange={setFilterStatus} />
              <FilterDropdown options={KATEGORI_OPTIONS} selected={filterKategori} onChange={setFilterKategori} />
              <FilterDropdown options={wilayahOptions} selected={filterWilayah} onChange={setFilterWilayah} />
            </div>
          </div>

          {/* Area export PDF */}
          <div ref={contentRef}>

            {/* Line Chart */}
            <section className="rounded-2xl p-6 mb-5" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
              <h2 className="text-xl font-bold font-raleway mb-1" style={{ color: textPrimary }}>Volume Laporan per Waktu</h2>
              <p className="text-xs font-raleway mb-6" style={{ color: textSecondary }}>{trendData.subtitle}</p>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "Inter", fill: dark ? "#64748b" : "rgba(0,0,0,0.7)" }} axisLine={{ stroke: gridColor }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontFamily: "Inter", fill: dark ? "#64748b" : "rgba(0,0,0,0.7)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, borderRadius: 8, fontFamily: "Raleway", fontSize: 13 }}
                    labelStyle={{ fontWeight: 700, color: textPrimary }}
                    itemStyle={{ color: textSecondary }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12, color: textSecondary }} />
                  {trendData.datasets.map((ds) => (
                    <Line
                      key={ds.name}
                      type="monotone"
                      dataKey={ds.name}
                      stroke={ds.color}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: ds.color, stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: ds.color, stroke: "#fff", strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Distribusi Kategori — dari API */}
              <section className="rounded-2xl p-6" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
                <h2 className="text-xl font-bold font-raleway mb-5" style={{ color: textPrimary }}>Distribusi Kategori</h2>
                {distribusiData.length === 0 ? (
                  <p className="text-sm font-raleway" style={{ color: textSecondary }}>Belum ada data</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {distribusiData.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold font-raleway w-28 shrink-0" style={{ color: textPrimary }}>{item.name}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: dark ? "#1e293b" : "#cfcfcf" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(item.percentage, 100)}%`, background: item.color }} />
                        </div>
                        <span className="text-xl font-bold font-inter shrink-0 w-14 text-right" style={{ color: item.color }}>{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Top Wilayah Keluhan — dari API */}
              <section className="rounded-2xl p-6" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
                <h2 className="text-xl font-bold font-raleway mb-5" style={{ color: textPrimary }}>Top Wilayah Keluhan</h2>
                {topWilayahData.length === 0 ? (
                  <p className="text-sm font-raleway" style={{ color: textSecondary }}>Belum ada data</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {topWilayahData.map((item) => (
                      <div key={item.rank} className="flex items-center justify-between" style={{ borderBottom: `1px solid ${dark ? "#1e293b" : "#f1f5f9"}`, paddingBottom: 12 }}>
                        <span className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>{item.rank}. {item.name}</span>
                        <span className="text-xl font-bold font-inter" style={{ color: "#3e8bf3" }}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}