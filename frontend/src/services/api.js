const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem("aduin_user"));
    return user?.token || null;
  } catch {
    return null;
  }
}

async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem("aduin_user");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// Helper convert period object ke query string
function periodToQuery(period) {
  if (!period) return "period=7d";
  if (typeof period === "string") return `period=${period}`;

  let query = "";
  if (period.type === "custom" && period.start && period.end) {
    query = `period=custom&start=${period.start}&end=${period.end}`;
  } else {
    query = `period=${period.value || "7d"}`;
  }

  // Tambah extra params kalau ada (kategori, wilayah)
  if (period.kategori) query += `&kategori=${encodeURIComponent(period.kategori)}`;
  if (period.wilayah) query += `&wilayah=${encodeURIComponent(period.wilayah)}`;

  return query;
}

// ============ AUTH ============

export async function loginAPI(email, password) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ============ DASHBOARD ============

export async function getDashboardStats(period) {
  return fetchAPI(`/dashboard/stats?${periodToQuery(period)}`);
}

export async function getHeatmapData(period) {
  return fetchAPI(`/dashboard/heatmap?${periodToQuery(period)}`);
}

export async function getWilayahDetail(kabupatenKota) {
  return fetchAPI(`/dashboard/heatmap/${encodeURIComponent(kabupatenKota)}`);
}

export async function getPriorities(period) {
  return fetchAPI(`/dashboard/priorities?${periodToQuery(period)}`);
}

export async function getTrends(period) {
  return fetchAPI(`/dashboard/trends?${periodToQuery(period)}`);
}

export async function getDistribusi(period) {
  return fetchAPI(`/dashboard/distribusi?${periodToQuery(period)}`);
}

export async function getTopWilayah(period) {
  return fetchAPI(`/dashboard/top-wilayah?${periodToQuery(period)}`);
}

// ============ REPORTS ============

export async function getReports(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/reports?${query}`);
}

export async function getReportById(id) {
  return fetchAPI(`/reports/${id}`);
}

export async function createReport(data) {
  return fetchAPI("/reports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReportStatus(id, data) {
  return fetchAPI(`/reports/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteReport(id) {
  return fetchAPI(`/reports/${id}`, { method: "DELETE" });
}

export async function trackReport(reportNumber) {
  return fetchAPI(`/reports/track/${reportNumber}`);
}

// ============ SETTINGS ============

export async function getKategoriSettings() {
  return fetchAPI("/settings/kategori");
}

export async function updateKategoriSettings(kategori) {
  return fetchAPI("/settings/kategori", {
    method: "PUT",
    body: JSON.stringify({ kategori }),
  });
}

export async function getDinasSettings() {
  return fetchAPI("/settings/dinas");
}

export async function updateDinasSettings(dinas) {
  return fetchAPI("/settings/dinas", {
    method: "PUT",
    body: JSON.stringify({ dinas }),
  });
}