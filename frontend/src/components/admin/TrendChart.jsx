import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getTrendsBulanan } from "../../services/api";

export default function TrendChart() {
  const { dark } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendsBulanan()
      .then((res) => {
        if (res?.data) setChartData(res.data);
      })
      .catch(() => {
        // Fallback mock 7 bulan
        const months = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei"];
        setChartData(months.map((label) => ({ label, count: 0 })));
      })
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <section
      className="rounded-2xl px-5 pt-4 pb-3"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "2px solid #fff",
      }}
    >
      <h2 className="text-xl font-bold text-center mb-3.5 font-raleway" style={{ color: dark ? "#e2e8f0" : "#000" }}>
        Tren Laporan Bulanan
      </h2>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 140 }}>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        </div>
      ) : (
        <div className="flex items-end gap-1.5 px-1" style={{ height: 140 }}>
          {chartData.map((item, i) => {
            const h = max > 0 ? (item.count / max) * 100 : 0;
            const isMax = item.count === max && item.count > 0;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end" style={{ height: 110 }}>
                  <div
                    className="w-full rounded transition-all duration-500 ease-out"
                    style={{
                      height: `${h}%`,
                      background: isMax ? "#e8a020" : dark ? "#2563eb" : "#9cc6ff",
                      minHeight: item.count > 0 ? 4 : 0,
                    }}
                    title={`${item.label}: ${item.count} laporan`}
                  />
                </div>
                <span className="text-xs font-bold font-inter" style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.5)" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}