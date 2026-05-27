import { useTheme } from "../../context/ThemeContext";

export default function HeatmapPeta() {
  const { dark } = useTheme();

  return (
    <section
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "2px solid #fff",
        minHeight: 400,
      }}
      aria-label="Peta heatmap sebaran masalah"
    >
      {/* Header */}
      <div
        className="px-5 py-3.5"
        style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}
      >
        <h2 className="text-xl font-bold font-raleway" style={{ color: dark ? "#e2e8f0" : "#000" }}>
          Peta Heatmap
        </h2>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ height: 500 }}>
        {/*
          TODO: Ganti iframe ini dengan react-leaflet + leaflet.heat
          Install: npm install react-leaflet leaflet leaflet.heat
          
          Contoh implementasi:
          <MapContainer center={[-8.65, 115.21]} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HeatmapLayer points={heatmapData} />
          </MapContainer>
        */}
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=115.05%2C-8.85%2C115.35%2C-8.55&layer=mapnik&marker=-8.65%2C115.21"
          className="w-full h-full border-0"
          style={{ filter: dark ? "invert(0.9) hue-rotate(180deg) saturate(0.5)" : "none" }}
          title="Peta heatmap laporan"
          loading="lazy"
        />

        {/* Badge */}
        <div
          className="absolute bottom-3 left-3 rounded-lg px-3 py-1.5 text-xs shadow-sm"
          style={{
            background: dark ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)",
            color: dark ? "#64748b" : "#64748b",
            backdropFilter: "blur(4px)",
            border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
          }}
        >
          Leaflet.js + OpenStreetMap (placeholder)
        </div>
      </div>
    </section>
  );
}
