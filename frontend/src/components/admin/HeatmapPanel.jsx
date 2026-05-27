import { useTheme } from "../../context/ThemeContext";

export default function HeatmapPanel({
  data, summary, selectedDetail, loadingDetail,
  selectedIdx, onSelectWilayah, onClose,
}) {
  const { dark } = useTheme();
  const border = dark ? "#1e293b" : "#E2E8F0";
  const textPrimary = dark ? "#e2e8f0" : "#1E293B";
  const textSecondary = dark ? "#94a3b8" : "#64748B";

  return (
    <aside
      className="w-full lg:w-64 xl:w-72 flex flex-col overflow-y-auto shrink-0"
      style={{ borderLeft: `1px solid ${border}`, background: dark ? "#0f172a" : "#fff" }}
    >
      {/* Summary dari API */}
      <div className="p-3" style={{ borderBottom: `1px solid ${border}` }}>
        <h2 className="text-xs font-bold mb-2 font-raleway" style={{ color: textPrimary }}>
          Ringkasan Wilayah
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Total", v: summary.total.toLocaleString("id"), c: "#3B82F6" },
            { l: "Urgent", v: summary.urgent.toLocaleString("id"), c: "#DC2626" },
            { l: "Wilayah", v: `${summary.wilayah} Kab/Kota`, c: "#059669" },
            { l: "Cluster", v: `${summary.clusters} isu`, c: "#7C3AED" },
          ].map((s, i) => (
            <div key={i} className="rounded-md p-2" style={{ background: dark ? "#111827" : "#F8FAFC", border: `1px solid ${border}` }}>
              <p className="text-[9px] font-semibold uppercase font-raleway" style={{ color: textSecondary }}>{s.l}</p>
              <p className="text-sm font-extrabold font-inter" style={{ color: s.c }}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail wilayah terpilih ATAU ranking */}
      {selectedIdx !== null ? (
        <div className="p-3 flex-1">
          {loadingDetail ? (
            <p className="text-xs font-raleway animate-pulse text-center py-8" style={{ color: textSecondary }}>
              Memuat detail...
            </p>
          ) : selectedDetail ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-extrabold font-raleway" style={{ color: textPrimary }}>
                  {selectedDetail.kabupaten_kota}
                </h3>
                <button onClick={onClose} className="text-[10px] font-raleway" style={{ color: textSecondary }}>
                  ✕ tutup
                </button>
              </div>

              {/* Count cards */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 rounded-md p-2 text-center" style={{ background: dark ? "#172554" : "#EFF6FF" }}>
                  <p className="text-[9px] font-raleway" style={{ color: textSecondary }}>Laporan</p>
                  <p className="text-base font-extrabold font-inter text-blue-600">{selectedDetail.count}</p>
                </div>
                <div className="flex-1 rounded-md p-2 text-center" style={{ background: dark ? "#450a0a" : "#FEF2F2" }}>
                  <p className="text-[9px] font-raleway" style={{ color: textSecondary }}>Urgent</p>
                  <p className="text-base font-extrabold font-inter text-red-600">{selectedDetail.urgent}</p>
                </div>
              </div>

              {/* Top kategori dari API */}
              {selectedDetail.top_categories?.length > 0 && (
                <>
                  <h4 className="text-[11px] font-bold mb-2 font-raleway" style={{ color: textPrimary }}>
                    Kategori Terbanyak
                  </h4>
                  {selectedDetail.top_categories.map((cat, i) => {
                    const colors = ["#3B82F6", "#059669", "#D97706", "#8B5CF6", "#EC4899"];
                    return (
                      <div key={i} className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-raleway w-20 shrink-0" style={{ color: textSecondary }}>
                          {cat.name}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: dark ? "#1e293b" : "#F1F5F9" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.percentage * 2.5}%`, background: colors[i % colors.length] }}
                          />
                        </div>
                        <span className="text-[10px] font-bold font-inter w-10 text-right" style={{ color: textPrimary }}>
                          {cat.percentage}%
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Top issues dari API */}
              {selectedDetail.top_issues?.length > 0 && (
                <>
                  <h4 className="text-[11px] font-bold mt-4 mb-2 font-raleway" style={{ color: textPrimary }}>
                    Isu Terpanas
                  </h4>
                  {selectedDetail.top_issues.map((isu, i) => (
                    <div key={i} className="py-1.5" style={{ borderBottom: `1px solid ${dark ? "#1e293b" : "#F1F5F9"}` }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold font-raleway truncate mr-2" style={{ color: textPrimary }}>
                          {isu.issue}
                        </span>
                        <span className="text-xs font-extrabold font-inter shrink-0" style={{ color: isu.priority_score > 80 ? "#DC2626" : "#D97706" }}>
                          {isu.priority_score}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 rounded-full" style={{ background: dark ? "#1e293b" : "#F1F5F9" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${isu.priority_score}%`,
                              background: isu.priority_score > 80 ? "#DC2626" : "#D97706",
                            }}
                          />
                        </div>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded font-raleway shrink-0"
                          style={{
                            background: isu.status === "DITERIMA" || isu.status === "DIANALISIS"
                              ? (dark ? "#450a0a" : "#FEE2E2")
                              : (dark ? "#451a03" : "#FEF3C7"),
                            color: isu.status === "DITERIMA" || isu.status === "DIANALISIS" ? "#DC2626" : "#D97706",
                          }}
                        >
                          {isu.status === "SELESAI" ? "Selesai" : isu.status === "DITINDAKLANJUTI" || isu.status === "DIDISPOSISI" ? "Proses" : "Belum"}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* CTA */}
              <button className="w-full mt-3 py-2 rounded-md text-[11px] font-bold font-raleway text-white bg-blue-600 hover:bg-blue-700 transition">
                Lihat Semua Laporan {selectedDetail.kabupaten_kota} →
              </button>
            </>
          ) : null}
        </div>
      ) : (
        /* Default: ranking wilayah */
        <div className="p-3 flex-1">
          <h3 className="text-[11px] font-bold mb-2 font-raleway" style={{ color: textPrimary }}>
            Ranking Wilayah
          </h3>
          {[...data].sort((a, b) => b.count - a.count).map((kab, i) => {
            const maxCount = Math.max(...data.map((d) => d.count), 1);
            return (
              <button
                key={i}
                onClick={() => onSelectWilayah(data.indexOf(kab))}
                className="flex items-center gap-2 w-full p-1.5 rounded-md mb-0.5 text-left transition hover:opacity-80"
              >
                <span className="text-[10px] font-extrabold font-inter w-5 text-right" style={{ color: "#9ca3af" }}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold font-raleway truncate" style={{ color: textPrimary }}>{kab.name}</p>
                  <div className="h-1 rounded-full mt-1" style={{ background: dark ? "#1e293b" : "#F1F5F9" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(kab.count / maxCount) * 100}%`,
                        background: `rgba(${kab.color},${kab.opacity + 0.2})`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold font-inter" style={{ color: textPrimary }}>{kab.count}</p>
                  <p className="text-[9px] font-semibold font-raleway text-red-600">{kab.urgent} urgent</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}