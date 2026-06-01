const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const prisma = require("../config/database");

// GET public — untuk form warga (HARUS di atas /:id)
router.get("/public", async (req, res, next) => {
  try {
    const data = await prisma.wilayah.findMany({ orderBy: { nama: "asc" } });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// GET semua wilayah — admin
router.get("/", auth, async (req, res, next) => {
  try {
    const data = await prisma.wilayah.findMany({ orderBy: { nama: "asc" } });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// POST tambah wilayah baru
router.post("/", auth, async (req, res, next) => {
  try {
    const { nama, latitude, longitude, kecamatan = [] } = req.body;
    if (!nama || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: "nama, latitude, longitude wajib diisi" });
    }
    const data = await prisma.wilayah.create({
      data: {
        nama,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        kecamatan,
      },
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// PUT update wilayah
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { nama, latitude, longitude, kecamatan } = req.body;
    const data = await prisma.wilayah.update({
      where: { id: req.params.id },
      data: {
        ...(nama && { nama }),
        ...(latitude && { latitude: parseFloat(latitude) }),
        ...(longitude && { longitude: parseFloat(longitude) }),
        ...(kecamatan !== undefined && { kecamatan }), // ← fix: !== undefined bukan &&
      },
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// DELETE wilayah
router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.wilayah.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Wilayah dihapus" });
  } catch (err) { next(err); }
});

module.exports = router;