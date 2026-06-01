const prisma = require("../config/database");
const generateReportId = require("../utils/generateReportId");

// GET /api/reports
async function getReports(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      kategori,
      wilayah,
      period = "7d",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const now = new Date();
    let startDate = null;
    if (period === "7d") startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    else if (period === "30d") startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    else if (period === "90d") startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);

    const where = {
      ...(search && {
        OR: [
          { reportNumber: { contains: search, mode: "insensitive" } },
          { text: { contains: search, mode: "insensitive" } },
          { kabupatenKota: { contains: search, mode: "insensitive" } },
          { disposisiDinas: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && status !== "Semua Status" && {
        status: status === "PROSES"
          ? { in: ["DIDISPOSISI", "DITINDAKLANJUTI"] }
          : status,
      }),
      ...(kategori && kategori !== "Semua Kategori" && {
        categories: { has: kategori },
      }),
      ...(wilayah && wilayah !== "Semua Wilayah" && {
        kabupatenKota: { contains: wilayah, mode: "insensitive" },
      }),
      ...(startDate && { createdAt: { gte: startDate } }),
    };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [{ priorityScore: "desc" }, { createdAt: "desc" }],
        include: {
          statusHistories: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/:id
async function getReportById(req, res, next) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: {
        statusHistories: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan" });
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/by-number/:reportNumber
async function getReportByNumber(req, res, next) {
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
    if (!report) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan" });
    }
    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/track/:reportNumber (untuk warga cek status)
async function trackReport(req, res, next) {
  try {
    const report = await prisma.report.findUnique({
      where: { reportNumber: req.params.reportNumber },
      select: {
        reportNumber: true,
        text: true,
        status: true,
        kabupatenKota: true,
        kecamatan: true,
        createdAt: true,
        categories: true,
        urgensi: true,
        disposisiDinas: true,
        catatanAdmin: true,
        photoUrls: true,  // ← tambah ini
        statusHistories: {
          orderBy: { createdAt: "asc" },
          select: { status: true, note: true, createdAt: true },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ success: false, message: "Nomor laporan tidak ditemukan" });
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// POST /api/reports (dari form warga)
async function createReport(req, res, next) {
  try {
    const {
      text,
      reporterName,
      kabupatenKota,
      kecamatan,
      detailLokasi,
      photoUrls = [],
    } = req.body;

    if (!text || !kabupatenKota || !kecamatan) {
      return res.status(400).json({
        success: false,
        message: "Text, kabupaten/kota, dan kecamatan wajib diisi",
      });
    }

    const reportNumber = generateReportId();

    // Lookup koordinat dari DB
    const wilayah = await prisma.wilayah.findUnique({
      where: { nama: kabupatenKota },
    });

    // ============ PANGGIL KEDUA ML SERVICE PARALEL ============
    let categories = [];
    let urgensi = null;
    let urgencyScore = null;
    let priorityScore = null;

    try {
      const [kategoriRes, urgensiRes] = await Promise.allSettled([
        // API 1: Klasifikasi Kategori (Syukron)
        fetch("https://keluhan-multilabel-classification-api-production.up.railway.app/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }).then((r) => r.json()),

        // API 2: Klasifikasi Urgensi (Desti)
        fetch("https://destiys-urgensi-keluhan-api.hf.space/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teks_keluhan: text }),
        }).then((r) => r.json()),
      ]);

      console.log("Kategori response:", JSON.stringify(kategoriRes));
      console.log("Urgensi response:", JSON.stringify(urgensiRes));

      // Proses hasil kategori
      if (kategoriRes.status === "fulfilled" && kategoriRes.value?.success) {
        const preds = kategoriRes.value.predictions || [];
        const labelMap = {
          "kategori_infrastruktur": "Infrastruktur",
          "kategori_lingkungan": "Lingkungan",
          "kategori_air_sanitasi": "Air & Sanitasi",
          "kategori_bencana": "Bencana",
          "kategori_transportasi": "Transportasi",
          "kategori_pelayanan_publik": "Pelayanan Publik",
          "kategori_ekonomi": "Ekonomi",
          "kategori_keamanan": "Keamanan",
          "kategori_pendidikan": "Pendidikan",
          "kategori_kesehatan": "Kesehatan",
        };
        categories = preds
          .map((p) => labelMap[p.label] || p.label)
          .filter(Boolean);
      }

      // Proses hasil urgensi
      if (urgensiRes.status === "fulfilled" && urgensiRes.value?.status_code === 200) {
        const data = urgensiRes.value;
        const label = data.kategori?.toLowerCase();

        urgensi = label === "tinggi" ? "tinggi"
          : label === "sedang" ? "sedang"
          : "rendah";

        const rawProb = data.raw_probabilities || {};
        urgencyScore = Math.round((rawProb.tinggi || 0) * 100);

        const baseScore = urgensi === "tinggi" ? 70
          : urgensi === "sedang" ? 40
          : 10;
        priorityScore = Math.min(Math.round(baseScore + urgencyScore * 0.3), 100);
      }

      console.log("ML Result — Kategori:", categories, "| Urgensi:", urgensi, "| Score:", priorityScore);
    } catch (mlErr) {
      // ML error tidak gagalkan laporan
      console.warn("ML Service error:", mlErr.message);
    }
    // ============ END ML SERVICE ============

    const report = await prisma.report.create({
      data: {
        reportNumber,
        text,
        reporterName: reporterName || null,
        kabupatenKota,
        kecamatan,
        detailLokasi: detailLokasi || null,
        photoUrls,
        latitude: wilayah?.latitude || null,
        longitude: wilayah?.longitude || null,
        categories,
        urgensi,
        urgencyScore,
        priorityScore,
        status: "DITERIMA",
        statusHistories: {
          create: {
            status: "DITERIMA",
            note: "Laporan diterima oleh sistem",
            changedBy: null,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Laporan berhasil dikirim",
      data: { reportNumber: report.reportNumber, id: report.id },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/reports/:id/status (admin update)
async function updateReportStatus(req, res, next) {
  try {
    const { status, disposisiDinas, catatanAdmin } = req.body;
    const { id } = req.params;

    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan" });
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(disposisiDinas !== undefined && { disposisiDinas }),
        ...(catatanAdmin !== undefined && { catatanAdmin }),
        statusHistories: {
          create: {
            status: status || existing.status,
            note: catatanAdmin || null,
            changedBy: req.user?.id || null,
          },
        },
      },
      include: {
        statusHistories: { orderBy: { createdAt: "asc" } },
      },
    });

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reports/:id (admin)
async function deleteReport(req, res, next) {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Laporan berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReports,
  getReportById,
  getReportByNumber,
  trackReport,
  createReport,
  updateReportStatus,
  deleteReport,
};