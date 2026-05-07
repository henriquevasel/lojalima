import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Seed inicial");

  // =========================
  // TAGS FIXAS DA HOME
  // =========================

  const tags = [
    {
      name: "Promoções",
      slug: "promocoes",
    },
    {
      name: "Mais vendidos",
      slug: "mais-vendidos",
    },
    {
      name: "Lançamentos",
      slug: "lancamentos",
    },
  ];

  await prisma.category.createMany({
    data: tags,
    skipDuplicates: true,
  });

  console.log("✅ Tags criadas");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });