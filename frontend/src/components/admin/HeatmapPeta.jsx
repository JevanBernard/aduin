import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../../context/ThemeContext";
import { getHeatmapData } from "../../services/api";

function getUrgencyColor(urgent, total) {
  const ratio = total > 0 ? urgent / total : 0;
  if (ratio >= 0.3) return { color: "239,68,68", opacity: 0.5 };
  if (ratio >= 0.15) return { color: "251,191,36", opacity: 0.45 };
  return { color: "34,197,94", opacity: 0.4 };
}

function getBubbleSize(count, maxCount) {
  const min = 10, max = 40;
  if (maxCount === 0) return min;
  return Math.round(min + (count / maxCount) * (max - min));
}

function FitBounds({ data }) {
  const map = useMap();
  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map((d) => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 11 });
    }
  }, [data, map]);
  return null;
}

export default function HeatmapPeta({ period }) {
  const { dark } = useTheme();
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHeatmapData(period)
      .then((res) => {
        if (!res?.data) return;
        const maxCount = Math.max(...res.data.map((w) => w.count), 1);
        const mapped = res.data
          .filter((w) => w.lat && w.lng)
          .map((w) => {
            const { color, opacity } = getUrgencyColor(w.urgent, w.count);
            return {
              name: w.kabupaten_kota,
              lat: w.lat,
              lng: w.lng,
              size: getBubbleSize(w.count, maxCount),
              count: w.count,
              urgent: w.urgent,
              color,
              opacity,
            };
          });
        setWilayahList(mapped);
      })
      .catch(() => setWilayahList([]))
      .finally(() => setLoading(false));
  }, [period]);

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <section
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
        boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.08)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "2px solid #fff",
        minHeight: 400,
        zIndex: 0
      }}
      aria-label="Peta heatmap sebaran masalah"
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 shrink-0"
        style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}
      >
        <h2 className="text-xl font-bold font-raleway" style={{ color: dark ? "#e2e8f0" : "#000" }}>
          Peta Heatmap
        </h2>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: 400 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: dark ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.5)" }}>
            <p className="text-xs font-raleway animate-pulse" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
              Memuat peta...
            </p>
          </div>
        )}

        <MapContainer
          center={[-8.45, 115.25]}
          zoom={10}
          style={{ height: "400px", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {wilayahList.length > 0 && <FitBounds data={wilayahList} />}

          {wilayahList.map((kab, i) => (
            <div key={i}>
              {/* Outer glow */}
              <CircleMarker
                center={[kab.lat, kab.lng]}
                radius={kab.size * 0.9}
                pathOptions={{
                  fillColor: `rgba(${kab.color},${kab.opacity * 0.3})`,
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
                  fillColor: `rgba(${kab.color},${kab.opacity})`,
                  fillOpacity: 0.85,
                  color: `rgba(${kab.color},0.6)`,
                  weight: 1.5,
                }}
              >
                <Tooltip direction="top" permanent className="custom-tooltip">
                  <div style={{ textAlign: "center", fontFamily: "Raleway, sans-serif" }}>
                    <div style={{ fontSize: kab.size > 25 ? 13 : 11, fontWeight: 800, fontFamily: "Inter, sans-serif", color: dark ? "#e2e8f0" : "#1e293b" }}>
                      {kab.count}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: dark ? "#94a3b8" : "#475569" }}>
                      {kab.name}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            </div>
          ))}
        </MapContainer>

        {/* Legend */}
        <div
          className="absolute bottom-3 left-3 rounded-lg px-3 py-2 z-[10]"
          style={{
            background: dark ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.92)",
            border: `1px solid ${dark ? "#1e293b" : "#E2E8F0"}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex gap-3">
            {[
              { l: "Urgent", c: "rgba(239,68,68,0.5)", s: 12 },
              { l: "Sedang", c: "rgba(251,191,36,0.45)", s: 9 },
              { l: "Normal", c: "rgba(34,197,94,0.4)", s: 7 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="rounded-full shrink-0" style={{ width: item.s, height: item.s, background: item.c }} />
                <span className="text-[9px] font-raleway" style={{ color: dark ? "#94a3b8" : "#64748B" }}>{item.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {!loading && wilayahList.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
            <p className="text-xs font-raleway px-3 py-1.5 rounded-lg"
              style={{ background: dark ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)", color: dark ? "#94a3b8" : "#64748b" }}>
              Belum ada data laporan
            </p>
          </div>
        )}
      </div>
    </section>
  );
}