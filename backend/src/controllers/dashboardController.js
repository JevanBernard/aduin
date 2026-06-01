const prisma = require("../config/database");

function getStartDate(period) {
  const now = new Date();
  if (period === "7d") return new Date(now - 7 * 24 * 60 * 60 * 1000);
  if (period === "30d") return new Date(now - 30 * 24 * 60 * 60 * 1000);
  if (period === "90d") return new Date(now - 90 * 24 * 60 * 60 * 1000);
  return null;
}

// Helper baru — handle semua jenis period termasuk custom
function getDateFilter(query) {
  const { period = "7d", start, end } = query;

  if (period === "custom" && start && end) {
    return { createdAt: { gte: new Date(start), lte: new Date(end) } };
  }

  const startDate = getStartDate(period);
  if (startDate) return { createdAt: { gte: startDate } };

  return {};
}

// GET /api/dashboard/stats
async function getStats(req, res, next) {
  try {
    const { period = "7d", start, end } = req.query;

    let dateFilter = {};
    if (period === "custom" && start && end) {
      dateFilter = { createdAt: { gte: new Date(start), lte: new Date(end) } };
    } else {
      const startDate = getStartDate(period);
      if (startDate) dateFilter = { createdAt: { gte: startDate } };
    }

    const [total, urgent, belum, proses, selesai, kategoriGroup] = await Promise.all([
      prisma.report.count({ where: dateFilter }),
      prisma.report.count({ where: { ...dateFilter, urgensi: "tinggi" } }),
      prisma.report.count({ where: { ...dateFilter, status: "DITERIMA" } }),
      prisma.report.count({ where: { ...dateFilter, status: { in: ["DIANALISIS", "DIDISPOSISI", "DITINDAKLANJUTI"] } } }),
      prisma.report.count({ where: { ...dateFilter, status: "SELESAI" } }),
      prisma.report.groupBy({
        by: ["categories"],
        where: dateFilter,
        _count: true,
      }),
    ]);

    // Hitung kategori terbanyak
    const kategoriCount = {};
    await prisma.report.findMany({ where: dateFilter, select: { categories: true } }).then((reports) => {
      reports.forEach((r) => {
        r.categories.forEach((cat) => {
          kategoriCount[cat] = (kategoriCount[cat] || 0) + 1;
        });
      });
    });
    const topKategori = Object.entries(kategoriCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    res.json({
      success: true,
      data: {
        total,
        urgent,
        kategori: topKategori,
        belum,
        proses,
        selesai,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/heatmap
async function getHeatmap(req, res, next) {
  try {
    const { period = "7d", start, end } = req.query;

    let dateFilter = {};
    if (period === "custom" && start && end) {
      dateFilter = { createdAt: { gte: new Date(start), lte: new Date(end) } };
    } else {
      const startDate = getStartDate(period);
      if (startDate) dateFilter = { createdAt: { gte: startDate } };
    }

    const reports = await prisma.report.findMany({
      where: dateFilter,
      select: {
        kabupatenKota: true,
        urgensi: true,
        latitude: true,
        longitude: true,
        categories: true,
      },
    });

    // Agregasi per kabupaten/kota
    const wilayahMap = {};
    reports.forEach((r) => {
      const key = r.kabupatenKota;
      if (!wilayahMap[key]) {
        wilayahMap[key] = {
          kabupaten_kota: key,
          count: 0,
          urgent: 0,
          lat: r.latitude,
          lng: r.longitude,
          kategoriCount: {},
        };
      }
      wilayahMap[key].count++;
      if (r.urgensi === "tinggi") wilayahMap[key].urgent++;
      r.categories.forEach((cat) => {
        wilayahMap[key].kategoriCount[cat] = (wilayahMap[key].kategoriCount[cat] || 0) + 1;
      });
    });

    // Format output
    const data = Object.values(wilayahMap).map((w) => {
      const totalKat = Object.values(w.kategoriCount).reduce((a, b) => a + b, 0);
      const top_categories = Object.entries(w.kategoriCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({
          name,
          percentage: Math.round((count / totalKat) * 100),
        }));

      return {
        kabupaten_kota: w.kabupaten_kota,
        count: w.count,
        urgent: w.urgent,
        lat: w.lat,
        lng: w.lng,
        top_categories,
      };
    });

    res.json({ success: true, data, clusters: 0 });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/heatmap/:kabupatenKota
async function getHeatmapDetail(req, res, next) {
  try {
    const { kabupatenKota } = req.params;
    const { period = "7d" } = req.query;

    const startDate = getStartDate(period);
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const reports = await prisma.report.findMany({
      where: {
        kabupatenKota: { contains: kabupatenKota, mode: "insensitive" },
        ...dateFilter,
      },
      select: {
        categories: true,
        urgensi: true,
        text: true,
        priorityScore: true,
        status: true,
      },
      orderBy: { priorityScore: "desc" },
    });

    const count = reports.length;
    const urgent = reports.filter((r) => r.urgensi === "tinggi").length;

    // Top kategori
    const kategoriCount = {};
    reports.forEach((r) => {
      r.categories.forEach((cat) => {
        kategoriCount[cat] = (kategoriCount[cat] || 0) + 1;
      });
    });
    const totalKat = Object.values(kategoriCount).reduce((a, b) => a + b, 0);
    const top_categories = Object.entries(kategoriCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        percentage: totalKat > 0 ? Math.round((count / totalKat) * 100) : 0,
      }));

    // Top issues
    const top_issues = reports.slice(0, 3).map((r) => ({
      issue: r.text.substring(0, 50) + (r.text.length > 50 ? "..." : ""),
      priority_score: r.priorityScore || 0,
      status: r.status,
    }));

    res.json({
      success: true,
      data: { kabupaten_kota: kabupatenKota, count, urgent, top_categories, top_issues },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/priorities
async function getPriorities(req, res, next) {
  try {
    const { period = "7d" } = req.query;
    const startDate = getStartDate(period);
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const reports = await prisma.report.findMany({
      where: { ...dateFilter, priorityScore: { not: null } },
      orderBy: { priorityScore: "desc" },
      take: 5,
      select: {
        id: true,
        text: true,
        priorityScore: true,
        kabupatenKota: true,
        kecamatan: true,
        categories: true,
        status: true,
      },
    });

    const data = reports.map((r, i) => ({
      rank: i + 1,
      issue: r.text.substring(0, 40) + (r.text.length > 40 ? "..." : ""),
      score: Math.round(r.priorityScore),
      wilayah: `${r.kecamatan}, ${r.kabupatenKota}`,
      status: r.status,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/trends
async function getTrends(req, res, next) {
  try {
    const { kategori, wilayah } = req.query;
    const dateFilter = getDateFilter(req.query);
    const period = req.query.period || "30d";

    const baseFilter = {
      ...dateFilter,
      ...(kategori && kategori !== "Semua Kategori" && { categories: { has: kategori } }),
      ...(wilayah && wilayah !== "Semua Wilayah" && { kabupatenKota: { contains: wilayah, mode: "insensitive" } }),
    };

    let labels = [];
    if (period === "7d") labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    else if (period === "30d") labels = ["Mg 1", "Mg 2", "Mg 3", "Mg 4"];
    else labels = ["Bulan 1", "Bulan 2", "Bulan 3"];

    const startDate = getStartDate(period);
    const reports = await prisma.report.findMany({
      where: { ...baseFilter, ...(startDate && { createdAt: { gte: startDate } }) },
      select: { createdAt: true, urgensi: true, status: true },
      orderBy: { createdAt: "asc" },
    });

    const bucketSize = Math.ceil(reports.length / labels.length) || 1;
    const totalData = labels.map((_, i) => reports.slice(i * bucketSize, (i + 1) * bucketSize).length);
    const urgentData = labels.map((_, i) => reports.slice(i * bucketSize, (i + 1) * bucketSize).filter((r) => r.urgensi === "tinggi").length);
    const selesaiData = labels.map((_, i) => reports.slice(i * bucketSize, (i + 1) * bucketSize).filter((r) => r.status === "SELESAI").length);

    res.json({
      success: true,
      data: {
        labels,
        datasets: [
          { name: "Total Laporan", color: "#3e8bf3", data: totalData },
          { name: "Urgent", color: "#ff0000", data: urgentData },
          { name: "Selesai", color: "#1a8c3c", data: selesaiData },
        ],
        subtitle: `${kategori || "Semua kategori"} · ${period === "7d" ? "7 hari" : period === "30d" ? "30 hari" : "90 hari"} terakhir${wilayah ? ` · ${wilayah}` : ""}`,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/distribusi
async function getDistribusi(req, res, next) {
  try {
    const { wilayah } = req.query;
    const dateFilter = getDateFilter(req.query);

    const reports = await prisma.report.findMany({
      where: {
        ...dateFilter,
        ...(wilayah && wilayah !== "Semua Wilayah" && { kabupatenKota: { contains: wilayah, mode: "insensitive" } }),
      },
      select: { categories: true },
    });

    const kategoriCount = {};
    reports.forEach((r) => {
      r.categories.forEach((cat) => {
        kategoriCount[cat] = (kategoriCount[cat] || 0) + 1;
      });
    });

    const total = Object.values(kategoriCount).reduce((a, b) => a + b, 0);
    const COLORS = {
      "Infrastruktur": "#3e8bf3", "Lingkungan": "#1a8c3c", "Transportasi": "#eb7600",
      "Air & Sanitasi": "#0891b2", "Bencana": "#dc2626", "Pelayanan Publik": "#7c3aed",
      "Ekonomi": "#f59e0b", "Keamanan": "#374151", "Pendidikan": "#0d9488", "Kesehatan": "#db2777",
    };

    const data = Object.entries(kategoriCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: COLORS[name] || "#94a3b8",
      }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/top-wilayah
async function getTopWilayah(req, res, next) {
  try {
    const { kategori } = req.query;
    const dateFilter = getDateFilter(req.query);

    const reports = await prisma.report.findMany({
      where: {
        ...dateFilter,
        ...(kategori && kategori !== "Semua Kategori" && { categories: { has: kategori } }),
      },
      select: { kabupatenKota: true },
    });

    const wilayahCount = {};
    reports.forEach((r) => {
      wilayahCount[r.kabupatenKota] = (wilayahCount[r.kabupatenKota] || 0) + 1;
    });

    const data = Object.entries(wilayahCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], i) => ({ rank: i + 1, name, count }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getHeatmap, getHeatmapDetail, getPriorities, getTrends, getDistribusi, getTopWilayah };