import { useTheme } from "../../context/ThemeContext";
import { KATEGORI_FILTER, URGENSI_FILTER } from "../../data/heatmapData";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component untuk update view saat data berubah
function FitBounds({ data }) {
  const map = useMap();
  if (data.length > 0) {
    const bounds = data.map((d) => [d.lat, d.lng]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
  }
  return null;
}

// Parse warna dari string "r,g,b" ke format leaflet
function parseColor(colorStr, opacity) {
  return `rgba(${colorStr},${opacity})`;
}

export default function HeatmapMap({
  data, selectedIdx, onSelectWilayah,
  filterKat, onFilterKat, filterUrg, onFilterUrg,
  kategoriFilter, urgensiFilter,
}) {
  const { dark } = useTheme();

  // Tile layer URL — dark mode pakai CartoDB dark
  const tileUrl = dark
  ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  
  const tileAttribution =
  '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

  return (
    <section className="flex-1 relative overflow-hidden flex flex-col">

      {/* Filter kategori */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5">
        {kategoriFilter.map((k) => (
          <button
            key={k}
            onClick={() => onFilterKat(k)}
            className="px-3 py-1 rounded-md text-xs font-semibold font-raleway transition"
            style={{
              background: filterKat === k ? (dark ? "#e2e8f0" : "#0F172A") : (dark ? "#1e293b" : "#fff"),
              color: filterKat === k ? (dark ? "#0f172a" : "#fff") : (dark ? "#94a3b8" : "#64748B"),
              border: `1px solid ${dark ? "#334155" : "#E2E8F0"}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Filter urgensi */}
      <div className="absolute top-12 left-3 z-[1000] flex gap-1.5">
        {URGENSI_FILTER.map((u) => (
          <button
            key={u.label}
            onClick={() => onFilterUrg(u.label)}
            className="px-2.5 py-0.5 rounded text-[11px] font-semibold font-raleway transition"
            style={{
              background: filterUrg === u.label ? u.color : (dark ? "#1e293b" : "#fff"),
              color: filterUrg === u.label ? "#fff" : u.color,
              border: `1px solid ${u.color}44`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {u.label}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[-8.45, 115.25]}
        zoom={10}
        className="flex-1 w-full z-0"
        style={{ minHeight: 400 }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <ZoomControl position="topright" />
        <TileLayer url={tileUrl} attribution={tileAttribution} />
        <FitBounds data={data} />

        {/* Bubble per wilayah */}
        {data.map((kab, i) => {
          const isSelected = selectedIdx === i;
          const fillColor = parseColor(kab.color, kab.opacity);
          const glowColor = parseColor(kab.color, kab.opacity * 0.3);

          return (
            <div key={`${kab.name}-${i}`}>
              {/* Outer glow circle */}
              <CircleMarker
                center={[kab.lat, kab.lng]}
                radius={kab.size * 0.9}
                pathOptions={{
                  fillColor: glowColor,
                  fillOpacity: 0.4,
                  stroke: false,
                }}
                interactive={false}
              />

              {/* Main bubble */}
              <CircleMarker
                center={[kab.lat, kab.lng]}
                radius={kab.size * 0.5}
                pathOptions={{
                  fillColor: fillColor,
                  fillOpacity: 0.85,
                  color: isSelected ? (dark ? "#e2e8f0" : "#0F172A") : `rgba(${kab.color},0.6)`,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectWilayah(i),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -kab.size * 0.4]}
                  permanent={true}
                  className="custom-tooltip"
                >
                  <div style={{
                    textAlign: "center",
                    fontFamily: "Raleway, sans-serif",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                  }}>
                    <div style={{
                      fontSize: kab.size > 35 ? 14 : kab.size > 25 ? 12 : 10,
                      fontWeight: 800,
                      fontFamily: "Inter, sans-serif",
                      color: dark ? "#e2e8f0" : "#1e293b",
                    }}>
                      {kab.count}
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: dark ? "#94a3b8" : "#475569",
                      marginTop: 1,
                    }}>
                      {kab.name}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 rounded-lg px-3 py-2 z-[1000]"
        style={{
          background: dark ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.92)",
          border: `1px solid ${dark ? "#1e293b" : "#E2E8F0"}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <p className="text-[10px] font-bold mb-1 font-raleway" style={{ color: dark ? "#e2e8f0" : "#1E293B" }}>
          Keterangan
        </p>
        <div className="flex gap-3">
          {[
            { l: "Banyak & Urgent", c: "rgba(239,68,68,0.5)", s: 14 },
            { l: "Sedang", c: "rgba(251,191,36,0.45)", s: 11 },
            { l: "Sedikit", c: "rgba(34,197,94,0.4)", s: 8 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="rounded-full shrink-0" style={{ width: item.s, height: item.s, background: item.c }} />
              <span className="text-[9px] font-raleway" style={{ color: dark ? "#94a3b8" : "#64748B" }}>{item.l}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] mt-1 font-raleway" style={{ color: dark ? "#475569" : "#94A3B8" }}>
          Ukuran = jumlah laporan · Warna = tingkat urgensi
        </p>
      </div>
    </section>
  );
}