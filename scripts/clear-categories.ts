import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🗑 Limpando relações produto/categoria...");

  await prisma.productcategory.deleteMany();

  console.log("✅ Relações removidas");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });