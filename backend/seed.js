const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@aduin.go.id" },
    update: {},
    create: {
      email: "admin@aduin.go.id",
      password: hashed,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "operator@aduin.go.id" },
    update: {},
    create: {
      email: "operator@aduin.go.id",
      password: await bcrypt.hash("operator123", 10),
      name: "Operator",
      role: "ADMIN",
    },
  });

  console.log("Seed berhasil — 2 user dibuat");
}

main().catch(console.error).finally(() => prisma.$disconnect());