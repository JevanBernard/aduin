const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const coords = {
  'Denpasar': { lat: -8.65, lng: 115.2167 },
  'Badung': { lat: -8.5833, lng: 115.1833 },
  'Gianyar': { lat: -8.5368, lng: 115.3268 },
  'Tabanan': { lat: -8.54, lng: 115.1167 },
  'Karangasem': { lat: -8.45, lng: 115.6 },
  'Buleleng': { lat: -8.2167, lng: 115.0833 },
  'Klungkung': { lat: -8.5333, lng: 115.4 },
  'Bangli': { lat: -8.45, lng: 115.35 },
  'Jembrana': { lat: -8.36, lng: 114.6333 },
};

async function fix() {
  const reports = await prisma.report.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, reportNumber: true, kabupatenKota: true },
  });

  console.log("Laporan tanpa koordinat:", reports.length);

  for (const r of reports) {
    const c = coords[r.kabupatenKota];
    if (c) {
      await prisma.report.update({
        where: { id: r.id },
        data: { latitude: c.lat, longitude: c.lng },
      });
      console.log("Fixed:", r.reportNumber, "-", r.kabupatenKota);
    } else {
      console.log("Skip:", r.reportNumber, "-", r.kabupatenKota);
    }
  }

  console.log("Selesai!");
  await prisma.$disconnect();
}

fix().catch(console.error);