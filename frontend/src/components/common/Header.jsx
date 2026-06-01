import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { PERIODS } from "../../data/dashboardData";
import { ChevronDownIcon, SunIcon, MoonIcon, SearchIcon, MenuIcon, SettingsIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../../hooks/useAuth";

// ============ PERIOD DROPDOWN (UPDATED) ============
export function PeriodDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dropdownRef = useRef(null);
  const { dark } = useTheme();
  const navigate = useNavigate();

  const PRESETS = [
    { label: "7 Hari Terakhir", value: "7d" },
    { label: "30 Hari Terakhir", value: "30d" },
    { label: "90 Hari Terakhir", value: "90d" },
  ];

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowCustom(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Label yang tampil di tombol
  const getDisplayLabel = () => {
    if (selected.type === "preset") {
      return PRESETS.find((p) => p.value === selected.value)?.label || "Pilih Periode";
    }
    if (selected.type === "custom") {
      return `${formatDate(selected.start)} – ${formatDate(selected.end)}`;
    }
    return "Pilih Periode";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const handlePreset = (preset) => {
    onChange({ type: "preset", value: preset.value });
    setOpen(false);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (startDate && endDate) {
      onChange({ type: "custom", start: startDate, end: endDate });
      setOpen(false);
      setShowCustom(false);
    }
  };

  const handleCustomReset = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold font-raleway cursor-pointer transition hover:opacity-90"
        style={{
          border: `1px solid ${dark ? "#334155" : "#d8d8d8"}`,
          background: dark ? "#1e293b" : "#fff",
          color: dark ? "#94a3b8" : "#626262",
          maxWidth: 260,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="truncate">{getDisplayLabel()}</span>
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-50"
          style={{
            background: dark ? "#1e293b" : "#fff",
            border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
            width: showCustom ? 320 : 220,
            transition: "width 0.2s ease",
          }}
        >
          {/* Preset options */}
          <div style={{ borderBottom: `1px solid ${dark ? "#334155" : "#f1f5f9"}` }}>
            <p
              className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider font-raleway"
              style={{ color: dark ? "#475569" : "#94a3b8" }}
            >
              Periode Cepat
            </p>
            {PRESETS.map((p) => {
              const isSelected = selected.type === "preset" && selected.value === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p)}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-raleway transition hover:opacity-80"
                  style={{
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "#3e8bf3" : dark ? "#e2e8f0" : "#333",
                    background: isSelected
                      ? dark ? "rgba(62,139,243,0.1)" : "rgba(62,139,243,0.05)"
                      : "transparent",
                  }}
                >
                  {p.label}
                  {isSelected && <span className="text-blue-500">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Custom range toggle */}
          <div>
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-raleway font-semibold transition hover:opacity-80"
              style={{
                color: selected.type === "custom" ? "#3e8bf3" : dark ? "#94a3b8" : "#64748b",
                background: selected.type === "custom"
                  ? dark ? "rgba(62,139,243,0.1)" : "rgba(62,139,243,0.05)"
                  : "transparent",
              }}
            >
              <span>Rentang Kustom</span>
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                className={`transition-transform ${showCustom ? "rotate-180" : ""}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Date picker fields */}
            {showCustom && (
              <div className="px-4 pb-4 pt-1">
                <div className="flex flex-col gap-2.5">
                  {/* Start date */}
                  <div>
                    <label
                      className="block text-[11px] font-semibold mb-1 font-raleway"
                      style={{ color: dark ? "#94a3b8" : "#64748b" }}
                    >
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm font-raleway outline-none transition"
                      style={{
                        background: dark ? "#0f172a" : "#f8fafc",
                        border: `1.5px solid ${dark ? "#334155" : "#e2e8f0"}`,
                        color: dark ? "#e2e8f0" : "#1e293b",
                      }}
                    />
                  </div>

                  {/* End date */}
                  <div>
                    <label
                      className="block text-[11px] font-semibold mb-1 font-raleway"
                      style={{ color: dark ? "#94a3b8" : "#64748b" }}
                    >
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 rounded-lg text-sm font-raleway outline-none transition"
                      style={{
                        background: dark ? "#0f172a" : "#f8fafc",
                        border: `1.5px solid ${dark ? "#334155" : "#e2e8f0"}`,
                        color: dark ? "#e2e8f0" : "#1e293b",
                      }}
                    />
                  </div>

                  {/* Validation message */}
                  {startDate && endDate && new Date(startDate) > new Date(endDate) && (
                    <p className="text-[11px] font-raleway text-red-500">
                      Tanggal awal tidak boleh lebih dari tanggal akhir
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleCustomReset}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold font-raleway transition"
                      style={{
                        border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                        color: dark ? "#94a3b8" : "#64748b",
                        background: "transparent",
                      }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCustomApply}
                      disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold font-raleway text-white transition"
                      style={{
                        background: startDate && endDate && new Date(startDate) <= new Date(endDate)
                          ? "#3e8bf3" : (dark ? "#1e293b" : "#e2e8f0"),
                        color: startDate && endDate && new Date(startDate) <= new Date(endDate)
                          ? "#fff" : (dark ? "#475569" : "#94a3b8"),
                        cursor: startDate && endDate && new Date(startDate) <= new Date(endDate)
                          ? "pointer" : "not-allowed",
                      }}
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ THEME TOGGLE ============
export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer transition shadow-lg"
      style={{ background: dark ? "#1e293b" : "#021D54" }}
      title={dark ? "Light Mode" : "Dark Mode"}
      aria-label={dark ? "Aktifkan light mode" : "Aktifkan dark mode"}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// ============ PROFILE DROPDOWN ============
export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { dark } = useTheme();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Ambil data user dari localStorage
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("aduin_user")); }
    catch { return null; }
  })();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "SA";

  // Tutup kalau klik di luar
  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-11 h-11 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
        style={{
          border: `3px solid ${dark ? "#334155" : "#e2e8f0"}`,
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
        }}
        aria-label="Menu profil"
      >
        <span className="text-white font-bold text-sm font-raleway">{initials}</span>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden z-50 w-56"
          style={{
            background: dark ? "#1e293b" : "#fff",
            border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* User info */}
          <div className="p-4" style={{ borderBottom: `1px solid ${dark ? "#334155" : "#f1f5f9"}` }}>
            <p className="font-bold text-sm font-raleway" style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>
              {user?.name || "Super Admin"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: dark ? "#64748b" : "#94a3b8" }}>
              {user?.email || "admin@aduin.go.id"}
            </p>
            <span
              className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-raleway"
              style={{ background: "rgba(62,139,243,0.15)", color: "#3e8bf3" }}
            >
              {user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role === "ADMIN" ? "Admin" : "Viewer"}
            </span>
          </div>

          {/* Menu items */}
          <button
            onClick={() => { navigate("/settings"); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-raleway font-medium text-left transition hover:opacity-80"
            style={{ color: dark ? "#94a3b8" : "#475569" }}
          >
            <span>⚙️</span> Pengaturan
          </button>

          <button
            onClick={() => { navigate("/laporan"); setOpen(false); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-raleway font-medium text-left transition hover:opacity-80"
            style={{ color: dark ? "#94a3b8" : "#475569" }}
          >
            <span>📋</span> Kelola Laporan
          </button>

          {/* Logout */}
          <div style={{ borderTop: `1px solid ${dark ? "#334155" : "#f1f5f9"}` }}>
            <button
              onClick={() => { logout(navigate); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-raleway font-semibold text-left text-red-500 transition hover:opacity-80"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SEARCH BAR ============
export function SearchBar() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/laporan?search=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-72">
      <SearchIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari Laporan, Lokasi...."
        className="w-full pl-11 pr-4 py-3 rounded-lg text-sm font-semibold font-raleway outline-none transition"
        style={{
          background: dark ? "rgba(255,255,255,0.06)" : "rgba(164,158,158,0.2)",
          color: dark ? "#e2e8f0" : "#333",
        }}
        aria-label="Cari laporan atau lokasi"
      />
    </form>
  );
}

// ============ HEADER (combines all) ============
export default function Header({ period, onPeriodChange, onMenuClick }) {
  const { dark } = useTheme();

  return (
    <header className="mb-3">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg transition"
            style={{ color: dark ? "#e2e8f0" : "#000" }}
            onClick={onMenuClick}
            aria-label="Buka menu navigasi"
          >
            <MenuIcon />
          </button>

          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight"
              style={{ color: dark ? "#e2e8f0" : "#000", fontFamily: "Raleway" }}
            >
              Welcome Back Super Admin!
            </h1>
            <p className="text-sm mt-1 font-pridi" style={{ color: dark ? "#64748b" : "#021d54" }}>
              Analisis Digital Untuk Insight Nusantara
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <PeriodDropdown selected={period} onChange={onPeriodChange} />
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>

      {/* Search row */}
      <div className="flex justify-end mb-4">
        <SearchBar />
      </div>

      {/* Divider */}
      <hr style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)" }} />
    </header>
  );
}
