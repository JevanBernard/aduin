const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { requireRole } = auth;
const {
  getKategori, updateKategori,
  getDinas, updateDinas,
} = require("../controllers/settingsController");

router.get("/kategori", auth, getKategori);
router.put("/kategori", auth, requireRole("SUPER_ADMIN", "ADMIN"), updateKategori);
router.get("/dinas", auth, getDinas);
router.put("/dinas", auth, requireRole("SUPER_ADMIN", "ADMIN"), updateDinas);

module.exports = router;