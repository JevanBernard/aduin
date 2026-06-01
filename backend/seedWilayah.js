const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const WILAYAH_DATA = [
  { nama: "Denpasar", latitude: -8.65, longitude: 115.2167, kecamatan: ["Denpasar Barat", "Denpasar Selatan", "Denpasar Timur", "Denpasar Utara"] },
  { nama: "Badung", latitude: -8.5833, longitude: 115.1833, kecamatan: ["Abiansemal", "Kuta", "Kuta Selatan", "Kuta Utara", "Mengwi", "Petang"] },
  { nama: "Gianyar", latitude: -8.5368, longitude: 115.3268, kecamatan: ["Blahbatuh", "Gianyar", "Payangan", "Sukawati", "Tampaksiring", "Tegallalang", "Ubud"] },
  { nama: "Tabanan", latitude: -8.54, longitude: 115.1167, kecamatan: ["Baturiti", "Kediri", "Kerambitan", "Marga", "Penebel", "Pupuan", "Selemadeg", "Tabanan"] },
  { nama: "Karangasem", latitude: -8.45, longitude: 115.6, kecamatan: ["Abang", "Bebandem", "Karangasem", "Kubu", "Manggis", "Rendang", "Selat", "Sidemen"] },
  { nama: "Buleleng", latitude: -8.2167, longitude: 115.0833, kecamatan: ["Banjar", "Buleleng", "Gerokgak", "Kubutambahan", "Sawan", "Seririt", "Sukasada", "Tejakula"] },
  { nama: "Klungkung", latitude: -8.5333, longitude: 115.4, kecamatan: ["Banjarangkan", "Dawan", "Klungkung", "Nusa Penida"] },
  { nama: "Bangli", latitude: -8.45, longitude: 115.35, kecamatan: ["Bangli", "Kintamani", "Susut", "Tembuku"] },
  { nama: "Jembrana", latitude: -8.36, longitude: 114.6333, kecamatan: ["Jembrana", "Melaya", "Mendoyo", "Negara", "Pekutatan"] },
];

async function main() {
  for (const w of WILAYAH_DATA) {
    await prisma.wilayah.upsert({
      where: { nama: w.nama },
      update: { latitude: w.latitude, longitude: w.longitude, kecamatan: w.kecamatan },
      create: w,
    });
    console.log("Seeded:", w.nama);
  }
  console.log("Selesai!");
  await prisma.$disconnect();
}

main().catch(console.error);