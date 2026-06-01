const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getStats,
  getHeatmap,
  getHeatmapDetail,
  getPriorities,
  getTrends,
  getDistribusi,
  getTopWilayah,
} = require("../controllers/dashboardController");

router.get("/stats", auth, getStats);
router.get("/heatmap", auth, getHeatmap);
router.get("/heatmap/:kabupatenKota", auth, getHeatmapDetail);
router.get("/priorities", auth, getPriorities);
router.get("/trends", auth, getTrends);
router.get("/distribusi", auth, getDistribusi);
router.get("/top-wilayah", auth, getTopWilayah);

module.exports = router;