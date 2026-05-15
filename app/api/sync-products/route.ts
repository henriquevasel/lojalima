import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function GET(req: Request) {
  try {


    const response = await fetch(
      "https://api.digitalsat.com.br/reseller/v4/product",
      {
        headers: {
          Authorization: `Bearer ${process.env.DIGITALSAT_TOKEN}`,
        },
        cache: "no-store",
      }
    );

  const data = await response.json();

    // =========================
    // AGRUPAR SKU
    // =========================
    const csvPath = path.join(
  process.cwd(),
  "data",
  "Produto.csv"
);

const fileBuffer =
  fs.readFileSync(csvPath);

const workbook =
  XLSX.read(fileBuffer, {
    type: "buffer",
  });

const sheetName =
  workbook.SheetNames[0];

const sheet =
  workbook.Sheets[sheetName];

const csvProducts =
  XLSX.utils.sheet_to_json(sheet);

  const csvMap = new Map();

csvProducts.forEach((p: any) => {
csvMap.set(
  String(Number(p["Código"] || 0)),
  p
);
});

    const grouped = new Map();

    for (const item of data) {

      const sku = String(Number(item.SKU));

      const estoque =
        Number(item.ESTOQUE || 0) -
        Number(item.RESERVADO || 0);

      if (!grouped.has(sku)) {
   const csvProduct: any =
  csvMap.get(sku);

        grouped.set(sku, {
          sku,
          name: item.DESCRICAO,
          brand: item.MARCA,
          ean: item.EAN,
description:
  csvProduct?.["Descrição"] ||
  csvProduct?.["Descrição técnica"] ||
  csvProduct?.["Descrição Curta"] ||
  item.DESCRICAO,

          image:
            item.URL_IMAGEM ||
            "/produtos/placeholder.jpg",

          group:
            item.GRUPO ||
            "Sem categoria",

          price: Math.round(Number(item.PRECO) * 100),

          stock: estoque,
        });

      } else {

        grouped.get(sku).stock += estoque;

      }
    }

    let created = 0;
    let updated = 0;

    // =========================
    // LOOP PRODUTOS
    // =========================

const products =
  Array.from(grouped.values()).slice(3000, 3547);

for (const product of products) {

      const slug = slugify(product.name);

      // =========================
      // CATEGORIA
      // =========================
const rawGroup =
  product.group?.toLowerCase() || "";

let categoryName = "Diversos";

// =========================
// INFORMÁTICA
// =========================

if (

  rawGroup.includes("informatica") ||
  rawGroup.includes("computador") ||
  rawGroup.includes("notebook") ||
  rawGroup.includes("pc")

) {
  categoryName = "Informática";
}

// =========================
// CONTROLE DE ACESSO
// =========================

else if (

  rawGroup.includes("controle de acesso") ||
  rawGroup.includes("acesso")

) {
  categoryName = "Controle de Acesso";
}

// =========================
// CFTV
// =========================

else if (

  rawGroup.includes("cftv") ||
  rawGroup.includes("dvr") ||
  rawGroup.includes("nvr") ||
  rawGroup.includes("camera") ||
  rawGroup.includes("video monitoramento")

) {
  categoryName = "CFTV";
}

// =========================
// CABEAMENTO
// =========================

else if (

  rawGroup.includes("cabeamento") ||
  rawGroup.includes("fios") ||
  rawGroup.includes("cabos") ||
  rawGroup.includes("cabo")

) {
  categoryName = "Cabeamento";
}

// =========================
// TELEFONIA
// =========================

else if (

  rawGroup.includes("telefonia") ||
  rawGroup.includes("telefone") ||
  rawGroup.includes("ramal") ||
  rawGroup.includes("pabx")

) {
  categoryName = "Telefonia";
}

// =========================
// ALARMES
// =========================

else if (

  rawGroup.includes("alarme") ||
  rawGroup.includes("sensor") ||
  rawGroup.includes("sirene") ||
  rawGroup.includes("incendio")

) {
  categoryName = "Alarmes";
}

// =========================
// ENERGIA
// =========================

else if (

  rawGroup.includes("nobreak") ||
  rawGroup.includes("energia") ||
  rawGroup.includes("fonte") ||
  rawGroup.includes("solar")

) {
  categoryName = "Energia";
}

// =========================
// REDES
// =========================

else if (

  rawGroup.includes("redes") ||
  rawGroup.includes("connect") ||
  rawGroup.includes("switch") ||
  rawGroup.includes("roteador") ||
  rawGroup.includes("router") ||
  rawGroup.includes("fibra") ||
  rawGroup.includes("access point") ||
  rawGroup.includes("rack") ||
  rawGroup.includes("wifi")

) {
  categoryName = "Redes";
}

// =========================
// AUTOMATIZADORES
// =========================

else if (

  rawGroup.includes("automat") ||
  rawGroup.includes("motor") ||
  rawGroup.includes("deslizante") ||
  rawGroup.includes("pivotante")

) {
  categoryName = "Automatizadores";
}

// =========================
// FECHADURAS
// =========================

else if (

  rawGroup.includes("fechadura")

) {
  categoryName = "Fechaduras";
}

// =========================
// PORTEIROS
// =========================

else if (

  rawGroup.includes("porteiro") ||
  rawGroup.includes("interfone") ||
  rawGroup.includes("video porteiro")

) {
  categoryName = "Porteiros";
}

// =========================
// MONITORES
// =========================

else if (

  rawGroup.includes("monitor")

) {
  categoryName = "Monitores";
}

const categorySlug =
  slugify(categoryName);

      let category =
        await prisma.category.findUnique({
          where: {
            slug: categorySlug,
          },
        });

      if (!category) {

        category =
          await prisma.category.create({
            data: {
  name: categoryName,
  slug: categorySlug,
  active: true,

  featured: [
    "CFTV",
    "Redes",
    "Alarmes",
    "Telefonia",
    "Controle de Acesso",
    "Energia",
    "Automatizadores",
    "Fechaduras"
  ].includes(categoryName),
},
          });

      }

      // =========================
      // PRODUTO EXISTE?
      // =========================

      const existing =
        await prisma.product.findUnique({
          where: {
            sku: product.sku,
          },
          include: {
            stock: true,
            productimage: true,
            productcategory: true,
          },
        });

      // =========================
      // CREATE
      // =========================

      if (!existing) {

        await prisma.product.create({
          data: {

            name: product.name,

            slug: `${slug}-${product.sku}`,

            sku: product.sku,

            ean: product.ean,

            brand: product.brand,

            supplier: "DigitalSat",

            description: product.description,

            priceCents: product.price,

            active: true,

            // =========================
            // ESTOQUE
            // =========================

            stock: {
              create: {
                quantity: product.stock,
              },
            },

            // =========================
            // IMAGEM
            // =========================

            productimage: {
              create: {
                url: product.image,
                alt: product.name,
                sortOrder: 1,
              },
            },

            // =========================
            // CATEGORIA
            // =========================

            productcategory: {
              create: {
                categoryId: category.id,
              },
            },
          },
        });

        created++;

      } else {

        // =========================
        // UPDATE PRODUTO
        // =========================

        await prisma.product.update({
          where: {
            id: existing.id,
          },
          data: {
            name: product.name,
            brand: product.brand,
            ean: product.ean,
            description: product.description,
            priceCents: product.price,
          },
        });

        // =========================
        // UPDATE ESTOQUE
        // =========================

        if (existing.stock) {

          await prisma.stock.update({
            where: {
              id: existing.stock.id,
            },
            data: {
              quantity: product.stock,
            },
          });

        } else {

          await prisma.stock.create({
            data: {
              productId: existing.id,
              quantity: product.stock,
            },
          });

        }

        // =========================
        // UPDATE IMAGEM
        // =========================

        if (existing.productimage.length > 0) {

          await prisma.productimage.update({
            where: {
              id: existing.productimage[0].id,
            },
            data: {
              url: product.image,
              alt: product.name,
            },
          });

        } else {

          await prisma.productimage.create({
            data: {
              productId: existing.id,
              url: product.image,
              alt: product.name,
              sortOrder: 1,
            },
          });

        }

        // =========================
        // CATEGORIA
        // =========================
await prisma.productcategory.deleteMany({
  where: {
    productId: existing.id,
  },
});

await prisma.productcategory.create({
  data: {
    productId: existing.id,
    categoryId: category.id,
  },
});
      

        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      total: grouped.size,
      created,
      updated,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Erro sincronizando produtos",
      },
      {
        status: 500,
      }
    );
  }
}