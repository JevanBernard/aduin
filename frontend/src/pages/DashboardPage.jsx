import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { dashboardData } from "../data/dashboardData";
import { getDashboardStats, getPriorities, getTrends } from "../services/api";

// Components
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import DashboardStats from "../components/admin/DashboardStats";
import HeatmapPeta from "../components/admin/HeatmapPeta";
import PriorityBoard from "../components/admin/PriorityBoard";
import TrendChart from "../components/admin/TrendChart";

export default function DashboardPage() {
  const { dark } = useTheme();
  const [period, setPeriod] = useState({ type: "preset", value: "7d" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback key untuk mock data
  const getPeriodKey = () => {
    if (period.type === "preset") {
      const map = { "7d": "7 Hari Terakhir", "30d": "30 Hari Terakhir", "90d": "90 Hari Terakhir" };
      return map[period.value] || "7 Hari Terakhir";
    }
    return "90 Hari Terakhir";
  };

  // Fetch data dari API
  useEffect(() => {
    const periodKey = period.type === "preset" ? period.value
      : period.type === "custom" ? `custom&start=${period.start}&end=${period.end}`
      : "7d";

    async function fetchData() {
      setAnimating(true);
      setLoading(true);
      try {
        const [stats, priorities, trends] = await Promise.all([
          getDashboardStats(period),
          getPriorities(period),
          getTrends(period),
        ]);

        setDashData({
          stats: stats.data,
          priority: priorities.data,
          trend: trends.data.datasets[0]?.data || [],
        });
      } catch (err) {
        console.error("Gagal fetch dashboard:", err);
        // Fallback ke mock data kalau API error / belum tersambung
        setDashData(dashboardData[getPeriodKey()]);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimating(false), 400);
      }
    }

    fetchData();
  }, [period]);

  // Gunakan data API kalau ada, kalau tidak fallback ke mock
  const data = dashData || dashboardData[getPeriodKey()];

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#0f172a" : "#f7f9fc" }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main
        className="min-w-0 overflow-y-auto ml-0 lg:ml-20"
        style={{ padding: "clamp(16px, 3vw, 40px)" }}
        role="main"
      >
        <div className="max-w-[1320px] mx-auto">
          <Header
            period={period}
            onPeriodChange={setPeriod}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-raleway" style={{ color: dark ? "#64748b" : "#94a3b8" }}>
                Memuat data...
              </span>
            </div>
          )}

          <DashboardStats stats={data.stats} animating={animating} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
            <HeatmapPeta period={period} />
            <div
              className="flex flex-col gap-4 transition-opacity duration-300"
              style={{ opacity: animating ? 0.5 : 1 }}
            >
              <PriorityBoard data={data.priority} />
              <TrendChart data={data.trend} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}