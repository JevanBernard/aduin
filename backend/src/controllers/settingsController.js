const prisma = require("../config/database");

const DEFAULT_KATEGORI = [
  "Infrastruktur", "Lingkungan", "Air & Sanitasi", "Bencana",
  "Transportasi", "Pelayanan Publik", "Ekonomi", "Keamanan",
  "Pendidikan", "Kesehatan",
];

const DEFAULT_DINAS = [
  { nama: "Dinas Pekerjaan Umum", singkatan: "PUPR" },
  { nama: "Dinas Lingkungan Hidup", singkatan: "DLH" },
  { nama: "PDAM", singkatan: "PDAM" },
  { nama: "BPBD", singkatan: "BPBD" },
  { nama: "Dinas Perhubungan", singkatan: "Dishub" },
  { nama: "Dinas Kesehatan", singkatan: "Dinkes" },
  { nama: "Dinas Pendidikan", singkatan: "Disdik" },
  { nama: "Dinas Sosial", singkatan: "Dinsos" },
];

async function getSetting(key, defaultValue) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  if (!setting) return defaultValue;
  return JSON.parse(setting.value);
}

async function setSetting(key, value) {
  return prisma.setting.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
}

// GET /api/settings/kategori
async function getKategori(req, res, next) {
  try {
    const data = await getSetting("kategori", DEFAULT_KATEGORI);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// PUT /api/settings/kategori
async function updateKategori(req, res, next) {
  try {
    const { kategori } = req.body;
    if (!Array.isArray(kategori)) {
      return res.status(400).json({ success: false, message: "kategori harus array" });
    }
    await setSetting("kategori", kategori);
    res.json({ success: true, data: kategori });
  } catch (err) { next(err); }
}

// GET /api/settings/dinas
async function getDinas(req, res, next) {
  try {
    const data = await getSetting("dinas", DEFAULT_DINAS);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// PUT /api/settings/dinas
async function updateDinas(req, res, next) {
  try {
    const { dinas } = req.body;
    if (!Array.isArray(dinas)) {
      return res.status(400).json({ success: false, message: "dinas harus array" });
    }
    await setSetting("dinas", dinas);
    res.json({ success: true, data: dinas });
  } catch (err) { next(err); }
}

module.exports = { getKategori, updateKategori, getDinas, updateDinas };