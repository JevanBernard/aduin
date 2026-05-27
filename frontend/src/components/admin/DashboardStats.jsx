import { useTheme } from "../../context/ThemeContext";

const STAT_CONFIG = [
  { key: "total", label: "Total Laporan", bg: "rgba(62,139,243,0.1)", color: "#3e8bf3" },
  { key: "urgent", label: "Urgent", bg: "rgba(240,13,13,0.1)", color: "#f00d0d" },
  { key: "kategori", label: "Kategori Terbanyak", bg: "rgba(26,140,60,0.1)", color: "#1a8c3c", isText: true },
  { key: "belum", label: "Belum Tindaklanjut", bg: "rgba(240,13,13,0.1)", color: "#f00d0d" },
  { key: "proses", label: "Proses", bg: "rgba(235,118,0,0.1)", color: "#eb7600" },
  { key: "selesai", label: "Selesai", bg: "rgba(26,140,60,0.1)", color: "#1a8c3c" },
];

function StatCard({ label, value, bgColor, textColor, isText }) {
  const { dark } = useTheme();

  return (
    <article
      className="rounded-xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        background: dark ? `${bgColor.replace("0.1", "0.06")}` : bgColor,
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "transparent"}`,
        borderRadius: 13,
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: dark ? "#94a3b8" : "#000", fontFamily: "Raleway" }}
      >
        {label}
      </p>
      <p
        className="leading-none transition-all duration-300"
        style={{
          fontSize: isText ? 24 : 40,
          fontWeight: 700,
          color: textColor,
          fontFamily: isText ? "Raleway" : "Inter",
        }}
      >
        {value}
      </p>
    </article>
  );
}

export default function DashboardStats({ stats, animating }) {
  return (
    <section
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 transition-opacity duration-300"
      style={{ opacity: animating ? 0.5 : 1 }}
      aria-label="Statistik ringkasan"
    >
      {STAT_CONFIG.map((cfg) => (
        <StatCard
          key={cfg.key}
          label={cfg.label}
          value={stats[cfg.key]}
          bgColor={cfg.bg}
          textColor={cfg.color}
          isText={cfg.isText}
        />
      ))}
    </section>
  );
}
