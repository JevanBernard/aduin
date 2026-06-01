const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const WILAYAH_BALI = [
  { nama: "Denpasar", latitude: -8.6500, longitude: 115.2167 },
  { nama: "Badung", latitude: -8.5833, longitude: 115.1833 },
  { nama: "Gianyar", latitude: -8.5368, longitude: 115.3268 },
  { nama: "Tabanan", latitude: -8.5400, longitude: 115.1167 },
  { nama: "Karangasem", latitude: -8.4500, longitude: 115.6000 },
  { nama: "Buleleng", latitude: -8.2167, longitude: 115.0833 },
  { nama: "Klungkung", latitude: -8.5333, longitude: 115.4000 },
  { nama: "Bangli", latitude: -8.4500, longitude: 115.3500 },
  { nama: "Jembrana", latitude: -8.3600, longitude: 114.6333 },
];

async function main() {
  // Seed users
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@aduin.go.id" },
    update: {},
    create: { email: "admin@aduin.go.id", password: hashed, name: "Super Admin", role: "SUPER_ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "operator@aduin.go.id" },
    update: {},
    create: { email: "operator@aduin.go.id", password: await bcrypt.hash("operator123", 10), name: "Operator", role: "ADMIN" },
  });

  console.log("Users seeded");

  // Seed wilayah
  for (const w of WILAYAH_BALI) {
    await prisma.wilayah.upsert({
      where: { nama: w.nama },
      update: { latitude: w.latitude, longitude: w.longitude },
      create: w,
    });
  }

  console.log("Wilayah seeded — 9 kabupaten/kota Bali");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());