import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🗑 Limpando categorias antigas...");

  await prisma.productcategory.deleteMany();

  await prisma.category.deleteMany({
    where: {
      slug: {
        in: [
          "cameras",
          "seguranca",
          "redes",
          "energia",
          "audio",
          "acessorios",
        ]
      }
    }
  });

  console.log("✅ Categorias antigas removidas");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });