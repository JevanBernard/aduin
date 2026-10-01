// Basemap tanpa API key. CARTO sekarang mewajibkan API key (tile diganti watermark),
// jadi dipakai Esri Canvas (abu-abu netral, mirip CARTO Positron/Dark Matter).
// Layer "base" tanpa label; layer "labels" (nama kota/jalan) ditumpuk di atasnya.
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
const ESRI_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const TILES = {
  light: {
    base: `${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    attribution: ESRI_ATTRIBUTION,
  },
  dark: {
    base: `${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: `${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    attribution: ESRI_ATTRIBUTION,
  },
};
