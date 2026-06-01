const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getReports,
  getReportById,
  trackReport,
  createReport,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// Public (warga)
router.post("/", createReport);
router.get("/track/:reportNumber", trackReport);

// Protected (admin)
router.get("/", auth, getReports);
router.get("/:id", auth, getReportById);
router.put("/:id/status", auth, updateReportStatus);
router.delete("/:id", auth, deleteReport);

module.exports = router;