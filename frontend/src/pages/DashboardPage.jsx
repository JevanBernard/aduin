import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { dashboardData } from "../data/dashboardData";

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

  // Data based on selected period
  // TODO: Replace with API call → GET /api/dashboard/stats?period=7d
  // Mapping period ke data key (untuk mock data sementara)
  const getPeriodKey = () => {
    if (period.type === "preset") {
      const map = { "7d": "7 Hari Terakhir", "30d": "30 Hari Terakhir", "90d": "90 Hari Terakhir" };
      return map[period.value] || "7 Hari Terakhir";
    }
    // Custom range: untuk sekarang fallback ke 90 hari
    // Nanti backend yang handle filter by date range
    return "90 Hari Terakhir";
  };

  const data = dashboardData[getPeriodKey()];

  // Animate on period change
  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(t);
  }, [period]);

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
      className="min-h-screen flex transition-colors duration-300"
      style={{ background: dark ? "#0f172a" : "#f7f9fc" }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        className="flex-1 min-w-0 overflow-y-auto ml-0 lg:ml-20"
        style={{ padding: "clamp(16px, 3vw, 40px)" }}
        role="main"
      >
        <div className="max-w-[1320px] mx-auto">
          {/* Header: Welcome, Period, Theme, Profile, Search */}
          <Header
            period={period}
            onPeriodChange={setPeriod}  // sekarang nerima object { type, value } atau { type, start, end }
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Stat Cards */}
          <DashboardStats stats={data.stats} animating={animating} />

          {/* Map + Priority + Trend Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
            {/* Heatmap */}
            <HeatmapPeta />

            {/* Right column */}
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
