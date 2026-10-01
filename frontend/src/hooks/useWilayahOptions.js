import { useState, useEffect } from "react";

import { API_URL } from "../utils/apiUrl";

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