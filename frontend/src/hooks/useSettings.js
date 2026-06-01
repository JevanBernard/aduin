import { useState, useEffect } from "react";
import { getKategoriSettings, getDinasSettings } from "../services/api";

// Cache sederhana supaya tidak fetch berulang
let cachedKategori = null;
let cachedDinas = null;

export function useKategori() {
  const [kategori, setKategori] = useState(cachedKategori || []);
  const [loading, setLoading] = useState(!cachedKategori);

  useEffect(() => {
    if (cachedKategori) return;
    getKategoriSettings()
      .then((res) => {
        if (res?.data) {
          cachedKategori = res.data;
          setKategori(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { kategori, loading };
}

export function useDinas() {
  const [dinas, setDinas] = useState(cachedDinas || []);
  const [loading, setLoading] = useState(!cachedDinas);

  useEffect(() => {
    if (cachedDinas) return;
    getDinasSettings()
      .then((res) => {
        if (res?.data) {
          cachedDinas = res.data;
          setDinas(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { dinas, loading };
}

// Reset cache setelah update settings
export function resetSettingsCache() {
  cachedKategori = null;
  cachedDinas = null;
}