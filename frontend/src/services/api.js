// Base API configuration
// Nanti ganti mock data dengan actual API calls ke Express backend

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // TODO: Add auth token
      // "Authorization": `Bearer ${getToken()}`
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ============ DASHBOARD ============

export async function getDashboardStats(period = "7d") {
  return fetchAPI(`/dashboard/stats?period=${period}`);
}

export async function getHeatmapData(period = "7d") {
  return fetchAPI(`/dashboard/heatmap?period=${period}`);
}

export async function getPriorities(period = "7d") {
  return fetchAPI(`/dashboard/priorities?period=${period}`);
}

export async function getTrends(period = "7d") {
  return fetchAPI(`/dashboard/trends?period=${period}`);
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

export async function trackReport(reportNumber) {
  return fetchAPI(`/reports/track/${reportNumber}`);
}

export async function batchUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_URL}/reports/batch`, {
    method: "POST",
    body: formData,
  }).then((r) => r.json());
}

// ============ HEATMAP ============

export async function getWilayahDetail(kabupatenKota) {
  return fetchAPI(`/dashboard/heatmap/${encodeURIComponent(kabupatenKota)}`);
}
