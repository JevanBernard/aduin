// Basemap tanpa API key. Ganti penyedia cukup dengan mengubah TILE_PROVIDER.
const PROVIDERS = {
  // OSM Deutschland
  osmde: {
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  // OSM standar (kebijakan: trafik ringan saja)
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  // OSM Humanitarian
  hot: {
    url: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles: <a href="https://www.hotosm.org/">HOT</a>',
  },
};

const TILE_PROVIDER = "osmde";

export const TILE = PROVIDERS[TILE_PROVIDER];
