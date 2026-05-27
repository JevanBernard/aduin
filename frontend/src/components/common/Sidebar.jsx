import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const MENU_ICONS = [
  { label: "Overview", src: "/src/assets/icons/overview.svg", path: "/" },
  { label: "Peta", src: "/src/assets/icons/map.svg", path: "/peta" },
  { label: "Laporan", src: "/src/assets/icons/laporan.svg", path: "/laporan" },
  { label: "Tren", src: "/src/assets/icons/tren.svg", path: "/tren" },
  { label: "Pengaturan", src: "/src/assets/icons/pengaturan.svg", path: "/settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    // Tutup sidebar di mobile setelah klik
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-20
          flex flex-col items-center py-6
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: dark ? "#0a0f1a" : "#fff",
          borderRight: `1px solid ${dark ? "#1e293b" : "#f0f0f0"}`,
          position: "fixed",
        }}
        role="navigation"
        aria-label="Menu navigasi utama"
      >
        {/* ====== LOGO (atas) ====== */}
        <div className="shrink-0 mb-4 cursor-pointer" onClick={() => handleNav("/")}>
          <img
            src="/src/assets/logo.jpg"
            alt="ADUIN Logo"
            className="w-12 h-12 rounded-xl object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<span style="font-family:Pridi;font-size:48px;color:#021d54">a</span>';
            }}
          />
        </div>

        {/* ====== MENU ICONS (tengah) ====== */}
        <nav
          className="flex-1 flex flex-col items-center justify-center gap-3"
          aria-label="Menu utama"
        >
          {MENU_ICONS.map((item, i) => {
            // Cek apakah halaman ini yang sedang aktif
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={i}
                onClick={() => handleNav(item.path)}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-80 cursor-pointer"
                style={{
                  background: isActive
                    ? dark
                      ? "rgba(62,139,243,0.15)"
                      : "rgba(62,139,243,0.08)"
                    : "transparent",
                }}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-7 h-7"
                  style={{
                    filter: isActive
                      ? "none"
                      : dark
                        ? "brightness(0.4)"
                        : "brightness(0) opacity(0.35)",
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* ====== LOGOUT (bawah) ====== */}
        <div className="shrink-0 mt-4">
          <button
            onClick={() => {
              // TODO: nanti tambah logic logout (clear token, redirect ke /login)
              navigate("/login");
            }}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-red-500/10 cursor-pointer"
            title="Logout"
            aria-label="Logout"
          >
            <img
              src="/src/assets/icons/logout.svg"
              alt="Logout"
              className="w-7 h-7"
              style={{
                filter: dark ? "brightness(0.4)" : "brightness(0) opacity(0.35)",
              }}
            />
          </button>
        </div>
      </aside>
    </>
  );
}