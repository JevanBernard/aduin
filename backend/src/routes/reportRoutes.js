const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireRole } = auth;
const {
  getReports,
  getReportById,
  getReportByNumber,
  trackReport,
  createReport,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// Batasi spam di endpoint publik (tiap laporan memicu 2 panggilan ML).
// Catatan: di serverless counter bersifat per-instance, jadi ini hanya pengaman dasar.
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak laporan dari alamat ini, coba lagi nanti" },
});
const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak permintaan, coba lagi nanti" },
});

// Public (warga)
router.post("/", createLimiter, createReport);
router.get("/track/:reportNumber", trackLimiter, trackReport);

// Protected (admin) — /by-number harus di atas /:id
router.get("/", auth, getReports);
router.get("/by-number/:reportNumber", auth, getReportByNumber);
router.get("/:id", auth, getReportById);
router.put("/:id/status", auth, requireRole("SUPER_ADMIN", "ADMIN"), updateReportStatus);
router.delete("/:id", auth, requireRole("SUPER_ADMIN", "ADMIN"), deleteReport);

module.exports = router;
