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
  const seguranca = await prisma.category.create({
    data: { name: "Segurança", slug: "seguranca", sortOrder: 1 },
  });

  const redes = await prisma.category.create({
    data: { name: "Redes", slug: "redes", sortOrder: 2 },
  });

  const energia = await prisma.category.create({
    data: { name: "Energia", slug: "energia", sortOrder: 3 },
  });

  const dataCenter = await prisma.category.create({
    data: { name: "Data Center", slug: "data-center", sortOrder: 4 },
  });

  const controleAcesso = await prisma.category.create({
    data: { name: "Controle de Acesso", slug: "controle-de-acesso", sortOrder: 5 },
  });

  // Subcategorias Segurança
  const cftv = await prisma.category.create({
    data: { name: "CFTV", slug: "cftv", parentId: seguranca.id, sortOrder: 1 },
  });

  const camerasIp = await prisma.category.create({
    data: { name: "Câmeras IP", slug: "cameras-ip", parentId: cftv.id, sortOrder: 1 },
  });

  const alarmes = await prisma.category.create({
    data: { name: "Alarmes", slug: "alarmes", parentId: seguranca.id, sortOrder: 2 },
  });

  // Subcategorias Redes
  const switches = await prisma.category.create({
    data: { name: "Switches", slug: "switches", parentId: redes.id, sortOrder: 1 },
  });

  const roteadores = await prisma.category.create({
    data: { name: "Roteadores", slug: "roteadores", parentId: redes.id, sortOrder: 2 },
  });

  // Subcategorias Energia
  const nobreaks = await prisma.category.create({
    data: { name: "Nobreaks", slug: "nobreaks", parentId: energia.id, sortOrder: 1 },
  });

  // Subcategorias Data Center
  const racks = await prisma.category.create({
    data: { name: "Racks", slug: "racks", parentId: dataCenter.id, sortOrder: 1 },
  });

  // Subcategorias Controle de Acesso
  const biometria = await prisma.category.create({
    data: { name: "Biometria / Facial", slug: "biometria-facial", parentId: controleAcesso.id, sortOrder: 1 },
  });

  const tags: { name: string; slug: string }[] = [
    { name: "Promoções", slug: "promocoes" },
    { name: "Mais vendidos", slug: "mais-vendidos" },
    { name: "Lançamentos", slug: "lancamentos" },
  ];

  const tagCats = await prisma.category.createMany({ data: tags });
  // pega ids das tags
  const promocoes = await prisma.category.findUnique({ where: { slug: "promocoes" } });
  const maisVendidos = await prisma.category.findUnique({ where: { slug: "mais-vendidos" } });

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
    // cam1 em Câmeras IP, CFTV, Segurança, Promoções, Mais vendidos
    { productId: cam1.id, categoryId: camerasIp.id },
    { productId: cam1.id, categoryId: cftv.id },
    { productId: cam1.id, categoryId: seguranca.id },
    ...(promocoes ? [{ productId: cam1.id, categoryId: promocoes.id }] : []),
    ...(maisVendidos ? [{ productId: cam1.id, categoryId: maisVendidos.id }] : []),

    // sw1 em Switches, Redes
    { productId: sw1.id, categoryId: switches.id },
    { productId: sw1.id, categoryId: redes.id },

    // nb1 em Nobreaks, Energia
    { productId: nb1.id, categoryId: nobreaks.id },
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
        