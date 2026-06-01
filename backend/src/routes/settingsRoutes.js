const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getKategori, updateKategori,
  getDinas, updateDinas,
} = require("../controllers/settingsController");

router.get("/kategori", auth, getKategori);
router.put("/kategori", auth, updateKategori);
router.get("/dinas", auth, getDinas);
router.put("/dinas", auth, updateDinas);

module.exports = router;