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
  { key: "id", label: "No. Laporan", width: "11%" },
  { key: "text", label: "Text Laporan", width: "22%" },
  { key: "kategori", label: "Kategori", width: "11%" },
  { key: "urgensi", label: "Urgensi", width: "8%" },
  { key: "score", label: "Score", width: "8%" },
  { key: "status", label: "Status", width: "8%" },
  { key: "disposisi", label: "Disposisi", width: "12%" },
  { key: "waktu", label: "Waktu", width: "12%" },
  { key: "aksi", label: "Aksi", width: "8%" },
];

export default function LaporanTable({ data }) {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const textPrimary = dark ? "#e2e8f0" : "#000";
  const textSecondary = dark ? "#94a3b8" : "#626262";
  const borderColor = dark ? "#1e293b" : "rgba(0,0,0,0.08)";

  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {/* Table header */}
      <div
        className="flex items-center px-6 py-4"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        {COLUMNS.map((col) => (
          <div key={col.key} style={{ width: col.width }} className="shrink-0">
            <span className="text-sm font-bold font-raleway" style={{ color: textPrimary }}>
              {col.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table rows */}
      {data.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-raleway" style={{ color: textSecondary }}>
            Tidak ada laporan yang sesuai filter
          </p>
        </div>
      ) : (
        data.map((row, idx) => {
          const urgStyle = getUrgensiStyle(row.urgensi);
          const statStyle = getStatusStyle(row.status);

          return (
            <div
              key={row.id}
              className="flex items-center px-6 py-3 transition-colors duration-150 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              style={{ borderBottom: `1px solid ${dark ? "#1e293b22" : "#f1f5f9"}` }}
            >
              {/* No. Laporan */}
              <div style={{ width: "11%" }} className="shrink-0">
                <span className="text-xs font-raleway" style={{ color: textSecondary }}>{row.id}</span>
              </div>

              {/* Text Laporan */}
              <div style={{ width: "22%" }} className="shrink-0 pr-3">
                <span
                  className="text-xs font-raleway block truncate"
                  style={{ color: textSecondary }}
                  title={row.text}
                >
                  {row.text}
                </span>
              </div>

              {/* Kategori */}
              <div style={{ width: "11%" }} className="shrink-0">
                <span className="text-xs font-bold font-raleway" style={{ color: textPrimary }}>
                  {row.kategori}
                </span>
              </div>

              {/* Urgensi */}
              <div style={{ width: "8%" }} className="shrink-0">
                <span
                  className="text-xs font-bold font-raleway px-3 py-1 rounded"
                  style={{ background: urgStyle.bg, color: urgStyle.color }}
                >
                  {row.urgensi}
                </span>
              </div>

              {/* Score */}
              <div style={{ width: "8%" }} className="shrink-0">
                <span
                  className="text-xl font-bold font-inter"
                  style={{ color: getScoreColor(row.score) }}
                >
                  {row.score}
                </span>
              </div>

              {/* Status */}
              <div style={{ width: "8%" }} className="shrink-0">
                <span
                  className="text-xs font-bold font-raleway px-3 py-1 rounded"
                  style={{ background: statStyle.bg, color: statStyle.color }}
                >
                  {row.status}
                </span>
              </div>

              {/* Disposisi */}
              <div style={{ width: "12%" }} className="shrink-0">
                <span className="text-xs font-raleway" style={{ color: row.disposisi ? textSecondary : (dark ? "#334155" : "#ccc") }}>
                  {row.disposisi || "-"}
                </span>
              </div>

              {/* Waktu */}
              <div style={{ width: "12%" }} className="shrink-0">
                <span className="text-xs font-raleway font-light" style={{ color: textSecondary }}>
                  {row.waktu}
                </span>
              </div>

              {/* Aksi */}
              <div style={{ width: "8%" }} className="shrink-0">
                <button
                  onClick={() => navigate(`/laporan/${row.id}`)}
                  className="text-xs font-light italic underline font-raleway transition hover:opacity-70"
                  style={{ color: "#008cff" }}
                >
                  Detail
                </button>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}