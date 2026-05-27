import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/common/Sidebar";
import { MOCK_DETAIL, STATUS_CHOICES, DINAS_CHOICES } from "../data/detailData";

function getStatusStyle(status) {
  switch (status) {
    case "Proses": return { bg: "rgba(188,181,0,0.2)", color: "#bcb500" };
    case "Belum": return { bg: "rgba(255,0,0,0.2)", color: "#ff0000" };
    case "Selesai": return { bg: "rgba(26,140,60,0.2)", color: "#1a8c3c" };
    default: return { bg: "#eee", color: "#666" };
  }
}

export default function LaporanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: ganti dengan API call GET /api/reports/:id
  const data = MOCK_DETAIL[id];

  const [status, setStatus] = useState(data?.status || "Belum");
  const [disposisi, setDisposisi] = useState(data?.disposisi || "");
  const [catatan, setCatatan] = useState(data?.catatan || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: dark ? "#0f172a" : "#f7f9fc" }}>
        <div className="text-center">
          <p className="text-lg font-bold font-raleway mb-3" style={{ color: dark ? "#e2e8f0" : "#000" }}>
            Laporan tidak ditemukan
          </p>
          <button onClick={() => navigate("/laporan")} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-raleway">
            Kembali ke Laporan
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    // TODO: API call PUT /api/reports/:id/status
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Perubahan berhasil disimpan!");
  };

  const handleExport = () => {
    // CSV export untuk single laporan
    const rows = [
      ["Field", "Value"],
      ["No. Laporan", data.id],
      ["Text", data.text],
      ["Kategori", data.analisis.kategori.label],
      ["Urgensi", data.analisis.urgensi.label],
      ["Priority Score", data.analisis.score.label],
      ["Lokasi", data.analisis.lokasi.label],
      ["Cluster", data.analisis.cluster.label],
      ["Nama Pelapor", data.pelapor.nama],
      ["Tanggal", data.pelapor.tanggal],
      ["Sumber", data.pelapor.sumber],
      ["Status", status],
      ["Disposisi", disposisi || "-"],
      ["Catatan", catatan || "-"],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_${data.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const textPrimary = dark ? "#e2e8f0" : "#000";
  const textSecondary = dark ? "#94a3b8" : "#626262";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)";
  const cardShadow = dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.05)" : "none";
  const inputBg = dark ? "#0f172a" : "#fff";
  const inputBorder = dark ? "#334155" : "#dbdbdb";
  const statStyle = getStatusStyle(status);

  return (
    <div className="min-h-screen flex transition-colors duration-300" style={{ background: dark ? "#0f172a" : "#f7f9fc" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 overflow-y-auto ml-0 lg:ml-20" style={{ padding: "clamp(16px, 3vw, 32px)" }} role="main">
        <div className="max-w-[1320px] mx-auto">

          {/* === HEADER === */}
          <header className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2 rounded-lg" style={{ color: textPrimary }} onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold font-inter" style={{ color: textPrimary }}>
                Detail Laporan {data.id}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold font-raleway text-white transition hover:opacity-90"
                style={{ background: "#1d6f42" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export Excel/PDF
              </button>

              {/* Status badge */}
              <div className="px-6 py-1.5 rounded text-xl font-bold font-raleway text-center" style={{ background: statStyle.bg, color: statStyle.color, minWidth: 120 }}>
                {status}
              </div>
            </div>
          </header>

          {/* Divider */}
          <hr className="mb-5" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />

          {/* === MAIN GRID: Left (info) + Right (aksi admin) === */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">

            {/* ====== LEFT COLUMN ====== */}
            <div className="flex flex-col gap-5">

              {/* Text Laporan */}
              <section className="rounded-2xl p-6" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
                <h2 className="text-xl font-bold font-raleway mb-3" style={{ color: textPrimary }}>Text Laporan</h2>
                <p className="text-sm font-raleway leading-relaxed mb-5" style={{ color: textPrimary }}>
                  {data.text}
                </p>
                {/* Photos */}
                <div className="flex gap-3">
                  {data.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="w-28 h-28 rounded-lg flex items-center justify-center text-xs font-raleway"
                      style={{
                        background: photo ? `url(${photo}) center/cover` : (dark ? "#1e293b" : "#d9d9d9"),
                        color: dark ? "#475569" : "#94a3b8",
                      }}
                    >
                      {!photo && `Foto ${i + 1}`}
                    </div>
                  ))}
                </div>
              </section>

              {/* Hasil Analisis AI */}
              <section className="rounded-2xl p-6" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
                <h2 className="text-xl font-bold font-raleway mb-4" style={{ color: textPrimary }}>Hasil Analisis AI</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "kategori", label: "KATEGORI" },
                    { key: "urgensi", label: "URGENSI" },
                    { key: "score", label: "PRIORITY SCORE" },
                    { key: "lokasi", label: "LOKASI (NER)" },
                    { key: "cluster", label: "CLUSTER" },
                  ].map(({ key, label }) => {
                    const item = data.analisis[key];
                    return (
                      <article
                        key={key}
                        className="rounded-lg p-4"
                        style={{ background: dark ? item.bg.replace("0.2", "0.1") : item.bg }}
                      >
                        <p className="text-xs font-raleway uppercase tracking-wider mb-1" style={{ color: dark ? "#94a3b8" : "#000" }}>
                          {label}
                        </p>
                        <p
                          className="text-lg font-bold"
                          style={{
                            color: item.color,
                            fontFamily: key === "score" || key === "lokasi" || key === "cluster" ? "Inter" : "Raleway",
                          }}
                        >
                          {item.label}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Info Pelapor */}
              <section className="rounded-2xl p-6" style={{ background: cardBg, boxShadow: cardShadow, border: cardBorder }}>
                <h2 className="text-xl font-bold font-raleway mb-4" style={{ color: textPrimary }}>Info Pelapor</h2>
                {[
                  { label: "Nama", value: data.pelapor.nama },
                  { label: "Tanggal Lapor", value: data.pelapor.tanggal },
                  { label: "Sumber", value: data.pelapor.sumber },
                ].map(({ label, value }, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 font-inter"
                    style={{ borderBottom: i < 2 ? `1px solid ${dark ? "#1e293b" : "#f1f5f9"}` : "none" }}
                  >
                    <span className="text-base" style={{ color: textPrimary }}>{label}</span>
                    <span className="text-base font-bold" style={{ color: textPrimary }}>{value}</span>
                  </div>
                ))}
              </section>
            </div>

            {/* ====== RIGHT COLUMN: Aksi Admin ====== */}
            <aside
              className="rounded-2xl p-6 h-fit lg:sticky lg:top-6"
              style={{
                background: dark ? "rgba(62,139,243,0.05)" : "rgba(62,139,243,0.1)",
                border: `2px solid #3e8bf3`,
                boxShadow: cardShadow,
              }}
            >
              <h2 className="text-2xl font-extrabold font-raleway mb-6" style={{ color: "#3e8bf3" }}>
                Aksi Admin
              </h2>

              {/* Update Status */}
              <div className="mb-5">
                <label className="block text-base font-inter mb-2" style={{ color: textPrimary }}>
                  Update Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md text-base font-bold font-raleway appearance-none cursor-pointer outline-none transition"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: getStatusStyle(status).color,
                    }}
                  >
                    {STATUS_CHOICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" stroke={textSecondary} strokeWidth="2" fill="none" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Disposisi ke Dinas */}
              <div className="mb-5">
                <label className="block text-base font-inter mb-2" style={{ color: textPrimary }}>
                  Disposisi ke Dinas
                </label>
                <div className="relative">
                  <select
                    value={disposisi}
                    onChange={(e) => setDisposisi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md text-base font-bold font-raleway appearance-none cursor-pointer outline-none transition"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: textPrimary,
                    }}
                  >
                    {DINAS_CHOICES.map((d) => (
                      <option key={d} value={d === "Pilih Dinas..." ? "" : d}>{d}</option>
                    ))}
                  </select>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" stroke={textSecondary} strokeWidth="2" fill="none" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Catatan Tindak Lanjut */}
              <div className="mb-6">
                <label className="block text-base font-inter mb-2" style={{ color: textPrimary }}>
                  Catatan Tindak Lanjut
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tindak lanjut...."
                  rows={5}
                  className="w-full px-4 py-3 rounded-md text-base font-raleway outline-none resize-none transition"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textPrimary,
                  }}
                />
              </div>

              {/* Simpan */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 rounded-md text-xl font-bold font-raleway text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "#3e8bf3" }}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              {/* Riwayat Status */}
              <div className="mt-6 rounded-2xl p-5" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#fff", boxShadow: cardShadow, border: cardBorder }}>
                <h3 className="text-base font-bold font-raleway mb-4" style={{ color: textPrimary }}>
                  Riwayat Status
                </h3>
                {[
                  { status: "Diterima", time: "22 Apr 14:32", color: "#16A34A", done: true },
                  { status: "Dianalisis AI", time: "22 Apr 14:32", color: "#16A34A", done: true },
                  { status: "Disposisi — " + (disposisi || "Belum"), time: disposisi ? "22 Apr 15:10" : "-", color: disposisi ? "#16A34A" : "#94a3b8", done: !!disposisi },
                  { status: "Sedang Diproses", time: status === "Proses" || status === "Selesai" ? "23 Apr 09:00" : "-", color: status === "Proses" ? "#F59E0B" : status === "Selesai" ? "#16A34A" : "#94a3b8", done: status === "Proses" || status === "Selesai" },
                  { status: "Selesai", time: status === "Selesai" ? "24 Apr 10:00" : "-", color: status === "Selesai" ? "#16A34A" : "#94a3b8", done: status === "Selesai" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center" style={{ width: 16 }}>
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          background: step.done ? step.color : "transparent",
                          border: `2.5px solid ${step.color}`,
                        }}
                      />
                      {i < arr.length - 1 && (
                        <div
                          className="flex-1"
                          style={{
                            width: 2.5,
                            minHeight: 28,
                            background: step.done ? "#16A34A" : (dark ? "#1e293b" : "#e2e8f0"),
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-4">
                      <p
                        className="text-sm font-bold font-raleway"
                        style={{ color: step.done ? textPrimary : (dark ? "#475569" : "#94a3b8") }}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs font-raleway" style={{ color: dark ? "#475569" : "#94a3b8" }}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hapus Laporan */}
              <button
                onClick={() => {
                  if (window.confirm("Yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.")) {
                    // TODO: API call DELETE /api/reports/:id
                    alert("Laporan dihapus");
                    navigate("/laporan");
                  }
                }}
                className="w-full mt-4 py-3 rounded-xl text-base font-bold font-raleway transition hover:opacity-90"
                style={{
                  background: dark ? "rgba(239,68,68,0.1)" : "rgba(255,0,0,0.08)",
                  color: "#ef4444",
                  border: `1.5px solid ${dark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                Hapus Laporan
              </button>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}