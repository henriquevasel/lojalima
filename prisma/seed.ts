import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helper
const cents = (v: number) => Math.round(v * 100);

async function main() {
  // limpa (ordem certa por causa de FK)
  await prisma.productcategory.deleteMany();
  await prisma.productimage.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.productvariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ====== Categorias estilo loja grande (Intelbras-like) ======
  // Top-level
// ====== Categorias SIMPLES (AJUSTADAS PRO SEU PROJETO) ======

const cameras = await prisma.category.create({
  data: { name: "Câmeras", slug: "cameras", sortOrder: 1 },
});

const seguranca = await prisma.category.create({
  data: { name: "Segurança", slug: "seguranca", sortOrder: 2 },
});

const redes = await prisma.category.create({
  data: { name: "Redes", slug: "redes", sortOrder: 3 },
});

const energia = await prisma.category.create({
  data: { name: "Energia", slug: "energia", sortOrder: 4 },
});

const audio = await prisma.category.create({
  data: { name: "Áudio e Vídeo", slug: "audio", sortOrder: 5 },
});

const acessorios = await prisma.category.create({
  data: { name: "Acessórios", slug: "acessorios", sortOrder: 6 },
});

const tags: { name: string; slug: string }[] = [
  { name: "Promoções", slug: "promocoes" },
  { name: "Mais vendidos", slug: "mais-vendidos" },
  { name: "Lançamentos", slug: "lancamentos" },
];

await prisma.category.createMany({
  data: tags,
  skipDuplicates: true // 🔥 evita erro se rodar mais de uma vez
});

// pega ids das tags
const promocoes = await prisma.category.findUnique({
  where: { slug: "promocoes" }
});

const maisVendidos = await prisma.category.findUnique({
  where: { slug: "mais-vendidos" }
});

const lancamentos = await prisma.category.findUnique({
  where: { slug: "lancamentos" }
});
  // ====== Produtos fake pra testar ======
  const cam1 = await prisma.product.create({
    data: {
      name: "Câmera IP Full HD",
      slug: "camera-ip-full-hd",
      description: "Câmera IP para monitoramento interno/externo (exemplo).",
      priceCents: cents(349.9),
      active: true,
      featured: true,
      brand: "Intelbras (exemplo)",
      productimage: {
        create: [
          { url: "/produtos/camera1.jpg", alt: "Câmera IP", sortOrder: 1 },
        ],
      },
      stock: { create: { quantity: 15 } },
    },
  });

  const sw1 = await prisma.product.create({
    data: {
      name: "Switch 8 Portas Gigabit",
      slug: "switch-8-portas-gigabit",
      description: "Switch para redes pequenas e médias (exemplo).",
      priceCents: cents(229.9),
      active: true,
      featured: false,
      productimage: {
        create: [{ url: "/produtos/switch1.jpg", alt: "Switch", sortOrder: 1 }],
      },
      stock: { create: { quantity: 40 } },
    },
  });

  const nb1 = await prisma.product.create({
    data: {
      name: "Nobreak 1200VA",
      slug: "nobreak-1200va",
      description: "Nobreak para proteção e autonomia (exemplo).",
      priceCents: cents(899.0),
      active: true,
      featured: false,
      productimage: {
        create: [{ url: "/produtos/nobreak1.jpg", alt: "Nobreak", sortOrder: 1 }],
      },
      stock: { create: { quantity: 8 } },
    },
  });

  // Variações exemplo
  const cam1v1 = await prisma.productvariant.create({
    data: { productId: cam1.id, name: "2MP", priceCents: cents(349.9), active: true },
  });
  const cam1v2 = await prisma.productvariant.create({
    data: { productId: cam1.id, name: "4MP", priceCents: cents(429.9), active: true },
  });
  await prisma.stock.create({ data: { variantId: cam1v1.id, quantity: 10 } });
  await prisma.stock.create({ data: { variantId: cam1v2.id, quantity: 5 } });

  // Liga produto em múltiplas categorias (N:N) — Opção B
const links = [
  // cam1 em câmeras + segurança
  { productId: cam1.id, categoryId: cameras.id },
  { productId: cam1.id, categoryId: seguranca.id },

  // sw1 em redes
  { productId: sw1.id, categoryId: redes.id },

  // nb1 em energia
  { productId: nb1.id, categoryId: energia.id },
];

  await prisma.productcategory.createMany({ data: links });

  console.log("✅ Seed finalizado: categorias + produtos criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
        