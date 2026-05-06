import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🗑 Limpando catálogo...");

  await prisma.productcategory.deleteMany();

  await prisma.productimage.deleteMany();

  await prisma.stock.deleteMany();

  await prisma.productvariant.deleteMany();

  await prisma.product.deleteMany();

  console.log("✅ Catálogo limpo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });