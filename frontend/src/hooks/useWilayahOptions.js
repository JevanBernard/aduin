import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://aduin-production.up.railway.app/api";

export function useWilayahOptions() {
  const [wilayahOptions, setWilayahOptions] = useState([
    "Semua Wilayah", "Denpasar", "Badung", "Gianyar", "Tabanan",
    "Karangasem", "Buleleng", "Klungkung", "Bangli", "Jembrana"
  ]);

  useEffect(() => {
    fetch(`${API_URL}/wilayah/public`)
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const options = ["Semua Wilayah", ...res.data.map(w => w.nama)];
          setWilayahOptions(options);
        }
      })
      .catch(() => {}); // fallback ke hardcode
  }, []);

  return wilayahOptions;
}