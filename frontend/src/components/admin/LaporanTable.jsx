import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function getScoreColor(score) {
  if (score >= 80) return "#cf0000";
  if (score >= 50) return "#eb7600";
  return "#1a8c3c";
}

function getUrgensiStyle(urgensi) {
  switch (urgensi) {
    case "Tinggi": return { bg: "rgba(255,0,0,0.2)", color: "#ff0000" };
    case "Sedang": return { bg: "rgba(235,118,0,0.2)", color: "#eb7600" };
    case "Rendah": return { bg: "rgba(26,140,60,0.2)", color: "#1a8c3c" };
    default: return { bg: "#eee", color: "#666" };
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "Proses": return { bg: "rgba(188,181,0,0.2)", color: "#bcb500" };
    case "Belum": return { bg: "rgba(255,0,0,0.2)", color: "#ff0000" };
    case "Selesai": return { bg: "rgba(26,140,60,0.2)", color: "#1a8c3c" };
    default: return { bg: "#eee", color: "#666" };
  }
}

const COLUMNS = [
  { key: "id", label: "No. Laporan", width: "10%" },
  { key: "text", label: "Text Laporan", width: "22%" },
  { key: "kategori", label: "Kategori", width: "11%" },
  { key: "urgensi", label: "Urgensi", width: "8%" },
  { key: "score", label: "Score", width: "8%" },
  { key: "disposisi", label: "Disposisi", width: "12%" },
  { key: "waktu", label: "Waktu", width: "10%" },
  { key: "aksi", label: "Aksi", width: "7%" },
  { key: "status", label: "Status", width: "8%" },
];

export default function LaporanTable({ data, currentPage, totalPages, onPageChange }) {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const textPrimary = dark ? "#e2e8f0" : "#000";
  const textSecondary = dark ? "#94a3b8" : "#626262";
  const borderColor = dark ? "#1e293b" : "rgba(0,0,0,0.08)";
  const cardBg = dark ? "rgba(255,255,255,0.03)" : "#fff";

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
      <p className="text-xs font-raleway" style={{ color: textSecondary }}>
        Halaman {currentPage} dari {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-md text-xs font-semibold font-raleway transition disabled:opacity-30"
          style={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, color: textSecondary }}>
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
            return (
              <button key={page} onClick={() => onPageChange(page)}
                className="w-8 h-8 rounded-md text-xs font-bold font-raleway transition"
                style={{
                  background: page === currentPage ? "#3e8bf3" : (dark ? "#1e293b" : "#fff"),
                  color: page === currentPage ? "#fff" : textSecondary,
                  border: `1px solid ${page === currentPage ? "#3e8bf3" : (dark ? "#334155" : "#e2e8f0")}`,
                }}>
                {page}
              </button>
            );
          }
          if (page === 2 && currentPage > 3) return <span key="start-dots" className="px-1 text-xs" style={{ color: textSecondary }}>...</span>;
          if (page === totalPages - 1 && currentPage < totalPages - 2) return <span key="end-dots" className="px-1 text-xs" style={{ color: textSecondary }}>...</span>;
          return null;
        })}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-md text-xs font-semibold font-raleway transition disabled:opacity-30"
          style={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`, color: textSecondary }}>
          Next →
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="py-16 text-center">
      <p className="text-sm font-raleway" style={{ color: textSecondary }}>Tidak ada laporan yang sesuai filter</p>
    </div>
  );

  return (
    <section className="rounded-2xl overflow-hidden"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}>

      {/* ======= DESKTOP TABLE (hidden di mobile) ======= */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="flex items-center px-6 py-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
          {COLUMNS.map((col) => (
            <div key={col.key} style={{ width: col.width }} className="shrink-0">
              <span className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>{col.label}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {data.length === 0 ? <EmptyState /> : data.map((row) => {
          const urgStyle = getUrgensiStyle(row.urgensi);
          const statStyle = getStatusStyle(row.status);
          return (
            <div key={row.id}
              className="flex items-center px-6 py-3 transition-colors duration-150 hover:bg-black/[0.02]"
              style={{ borderBottom: `1px solid ${dark ? "#1e293b22" : "#f1f5f9"}` }}>
              <div style={{ width: "10%" }} className="shrink-0">
                <span className="text-xs font-raleway" style={{ color: textSecondary }}>{row.id}</span>
              </div>
              <div style={{ width: "22%" }} className="shrink-0 pr-3">
                <span className="text-xs font-raleway block truncate" style={{ color: textSecondary }} title={row.text}>{row.text}</span>
              </div>
              <div style={{ width: "11%" }} className="shrink-0">
                <span className="text-xs font-bold font-raleway" style={{ color: textPrimary }}>{row.kategori}</span>
              </div>
              <div style={{ width: "8%" }} className="shrink-0">
                <span className="text-xs font-bold font-raleway px-3 py-1 rounded" style={{ background: urgStyle.bg, color: urgStyle.color }}>{row.urgensi}</span>
              </div>
              <div style={{ width: "8%" }} className="shrink-0">
                <span className="text-xl font-bold font-inter" style={{ color: getScoreColor(row.score) }}>{row.score}</span>
              </div>
              <div style={{ width: "12%" }} className="shrink-0">
                <span className="text-xs font-raleway" style={{ color: row.disposisi ? textSecondary : (dark ? "#334155" : "#ccc") }}>{row.disposisi || "-"}</span>
              </div>
              <div style={{ width: "10%" }} className="shrink-0">
                <span className="text-xs font-raleway font-light" style={{ color: textSecondary }}>{row.waktu}</span>
              </div>
              <div style={{ width: "7%" }} className="shrink-0">
                <button onClick={() => navigate(`/laporan/${row.id}`)} className="text-xs font-light italic underline font-raleway transition hover:opacity-70" style={{ color: "#008cff" }}>Detail</button>
              </div>
              <div style={{ width: "8%" }} className="shrink-0">
                <span className="text-xs font-bold font-raleway px-3 py-1 rounded" style={{ background: statStyle.bg, color: statStyle.color }}>{row.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======= MOBILE CARD VIEW (hidden di desktop) ======= */}
      <div className="md:hidden">
        {data.length === 0 ? <EmptyState /> : (
          <div className="flex flex-col divide-y" style={{ borderColor: dark ? "#1e293b" : "#f1f5f9" }}>
            {data.map((row) => {
              const urgStyle = getUrgensiStyle(row.urgensi);
              const statStyle = getStatusStyle(row.status);
              return (
                <div key={row.id} className="p-4" style={{ background: cardBg }}>
                  {/* Top row: nomor + status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-raleway" style={{ color: textSecondary }}>{row.id}</span>
                    <span className="text-xs font-bold font-raleway px-2.5 py-1 rounded" style={{ background: statStyle.bg, color: statStyle.color }}>{row.status}</span>
                  </div>

                  {/* Text laporan */}
                  <p className="text-sm font-raleway mb-3 line-clamp-2" style={{ color: textPrimary }}>{row.text}</p>

                  {/* Badge row: kategori + urgensi + score */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-xs font-bold font-raleway px-2.5 py-1 rounded-full" style={{ background: dark ? "rgba(62,139,243,0.15)" : "rgba(62,139,243,0.1)", color: "#3e8bf3" }}>
                      {row.kategori}
                    </span>
                    <span className="text-xs font-bold font-raleway px-2.5 py-1 rounded-full" style={{ background: urgStyle.bg, color: urgStyle.color }}>
                      {row.urgensi}
                    </span>
                    <span className="text-xs font-bold font-inter" style={{ color: getScoreColor(row.score) }}>
                      Score: {row.score}
                    </span>
                  </div>

                  {/* Bottom row: waktu + disposisi + detail */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-raleway" style={{ color: textSecondary }}>{row.waktu}</span>
                      {row.disposisi && (
                        <span className="text-xs font-raleway" style={{ color: textSecondary }}>→ {row.disposisi}</span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/laporan/${row.id}`)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold font-raleway text-white transition hover:opacity-90"
                      style={{ background: "#3e8bf3" }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination />}
    </section>
  );
}