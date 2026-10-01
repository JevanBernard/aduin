// Satu sumber untuk base URL API; buang "/" di akhir agar tidak jadi "/api//auth/login"
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/+$/, "");
