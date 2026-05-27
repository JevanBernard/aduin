import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function FilterDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-semibold font-raleway transition"
        style={{
          border: `1px solid ${dark ? "#334155" : "#d8d8d8"}`,
          background: dark ? "#1e293b" : "#fff",
          color: dark ? "#94a3b8" : "#626262",
        }}
      >
        {selected}
        <svg width="9" height="9" viewBox="0 0 12 12" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 rounded-lg overflow-hidden z-50 min-w-[160px]"
          style={{
            background: dark ? "#1e293b" : "#fff",
            border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm font-raleway transition hover:opacity-80"
              style={{
                fontWeight: opt === selected ? 700 : 500,
                color: opt === selected ? "#3e8bf3" : (dark ? "#e2e8f0" : "#333"),
                background: opt === selected ? (dark ? "rgba(62,139,243,0.1)" : "rgba(62,139,243,0.05)") : "transparent",
              }}
            >
              {opt} {opt === selected && "✓"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}