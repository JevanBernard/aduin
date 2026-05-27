import { useTheme } from "../../context/ThemeContext";
import { MONTHS } from "../../data/dashboardData";

export default function TrendChart({ data }) {
  const { dark } = useTheme();
  const max = Math.max(...data);

  return (
    <section
      className="rounded-2xl px-5 pt-4 pb-3"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "2px solid #fff",
      }}
      aria-label="Grafik tren laporan per bulan"
    >
      <h2
        className="text-xl font-bold text-center mb-3.5 font-raleway"
        style={{ color: dark ? "#e2e8f0" : "#000" }}
      >
        Tren Kategori
      </h2>

      <div className="flex items-end gap-1.5 px-1" style={{ height: 140 }} role="img" aria-label="Grafik batang tren bulanan">
        {data.map((val, i) => {
          const h = max > 0 ? (val / max) * 100 : 0;
          const isMax = val === max;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end" style={{ height: 110 }}>
                <div
                  className="w-full rounded transition-all duration-500 ease-out"
                  style={{
                    height: `${h}%`,
                    borderRadius: 4,
                    background: isMax ? "#e8a020" : dark ? "#2563eb" : "#9cc6ff",
                    minHeight: val > 0 ? 4 : 0,
                  }}
                  title={`${MONTHS[i]}: ${val} laporan`}
                />
              </div>
              <span
                className="text-xs font-bold font-inter"
                style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)" }}
              >
                {MONTHS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
