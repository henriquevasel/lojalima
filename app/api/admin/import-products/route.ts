import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

/* =========================
FUNÇÃO DE CATEGORIA
========================= */

function getCategorySlug(name: string) {
  const n = name.toLowerCase();

  if (
    n.includes("camera") ||
    n.includes("vhd") ||
    n.includes("vhl") ||
    n.includes("vip") ||
    n.includes("mhdx") ||
    n.includes("imhdx") ||
    n.includes("invd") ||
    n.includes("invu") ||
    n.includes("nvd") ||
    n.includes("nvr")
  ) return "cameras";

  if (
    n.includes("acionador") ||
    n.includes("fechadura") ||
    n.includes("controle de acesso") ||
    n.includes("portao") ||
    n.includes("alarme")
  ) return "seguranca";

  if (
    n.includes("roteador") ||
    n.includes("switch") ||
    n.includes("wifi")
  ) return "redes";

  if (
    n.includes("nobreak") ||
    n.includes("fonte") ||
    n.includes("inversor") ||
    n.includes("bateria") ||
    n.includes("energia") ||
    n.includes("power")
  ) return "energia";

  if (
    n.includes("arandela") ||
    n.includes("acustica")
  ) return "audio";

  const acessoriosTerms = [
    "cabo",
    "conector",
    "plug",
    "adaptador",
    "extensao",
    "extensão",
    "patch",
    "cord",
    "keystone",
    "rj45"
  ];

  if (acessoriosTerms.some(term => n.includes(term))) {
    return "acessorios";
  }

  // 🔥 ESSENCIAL
  return "acessorios";
}

/* =========================
IMPORTAÇÃO
========================= */

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "EcommerceGold.xlsx");
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    for (const item of data) {
      if (!item.CODPROD || !item.DESCRPROD) continue;

      const name = item.DESCRPROD;

      // ✅ SKU (UMA ÚNICA VEZ)
      const sku = String(item.CODPROD);

      // 🔥 SLUG BASE
      const baseSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // 🔥 SLUG FINAL ÚNICO
      const generatedSlug = `${baseSlug}-${sku}`;

      /* 🔥 categoria */
      const categorySlug = getCategorySlug(name);

      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      /* 🔥 preço */
      const price = parseFloat(
        String(item.PRECO || "0").replace(",", ".")
      );

      const priceCents = Math.round(price * 100);

      /* 🔥 UPSERT */
      await prisma.product.upsert({
        where: { sku },

        update: {
          name,
          slug: generatedSlug,
          priceCents,
          brand: item.MARCA,
          active: item.FORA_LINHA !== "S",

          productcategory: category
  ? {
      deleteMany: {},
      create: [
        {
          categoryId: category.id,
        },
      ],
    }
  : undefined,
        },

        create: {
          name,
          slug: generatedSlug,
          description: name,
          priceCents,
          brand: item.MARCA,
          sku,
          active: true,

          productcategory: category
  ? {
      create: [
        {
          categoryId: category.id,
        },
      ],
    }
  : undefined,
        },
      });
    }

    return NextResponse.json({ message: "Importação concluída 🚀" });

  } catch (error: any) {
    console.error("ERRO REAL:", error);

    return NextResponse.json(
      { error: error.message || "Erro ao importar" },
      { status: 500 }
    );
  }
}