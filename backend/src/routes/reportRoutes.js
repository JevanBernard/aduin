const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getReports,
  getReportById,
  getReportByNumber,
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
router.get("/by-number/:reportNumber", auth, getReportByNumber);
router.get("/:id", auth, getReportById);
router.put("/:id/status", auth, updateReportStatus);
router.delete("/:id", auth, deleteReport);

module.exports = router;

// Tambah sebelum route /:id
router.get("/by-number/:reportNumber", auth, async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({
      where: { reportNumber: req.params.reportNumber },
      include: {
        statusHistories: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true } } },
        },
      },
    });
    if (!report) return res.status(404).json({ success: false, message: "Laporan tidak ditemukan" });
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
});