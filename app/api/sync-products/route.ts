import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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

export async function GET() {
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

    // 🔥 agrupa produtos por SKU
    const grouped = new Map();

    for (const item of data) {

      const sku = String(item.SKU);

      const estoque =
        Number(item.ESTOQUE || 0) -
        Number(item.RESERVADO || 0);

      if (!grouped.has(sku)) {

        grouped.set(sku, {
          sku,
          name: item.DESCRICAO,
          brand: item.MARCA,
          ean: item.EAN,
          image:
  item.URL_IMAGEM ||
  "/produtos/placeholder.jpg",
          price: Math.round(Number(item.PRECO) * 100),
          stock: estoque,
        });

      } else {

        grouped.get(sku).stock += estoque;

      }
    }

    let created = 0;
    let updated = 0;

    for (const product of grouped.values()) {

      const slug = slugify(product.name);

      const existing = await prisma.product.findUnique({
        where: {
          sku: product.sku,
        },
        include: {
          stock: true,
          productimage: true,
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
            description: product.name,
            priceCents: product.price,
            active: true,

            stock: {
              create: {
                quantity: product.stock,
              },
            },

            productimage: {
              create: {
                url: product.image,
                alt: product.name,
                sortOrder: 1,
              },
            },
          },
        });

        created++;

      } else {

        // =========================
        // UPDATE PRODUCT
        // =========================

        await prisma.product.update({
          where: {
            id: existing.id,
          },
          data: {
            name: product.name,
            brand: product.brand,
            ean: product.ean,
            priceCents: product.price,
          },
        });

        // =========================
        // UPDATE STOCK
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
        // UPDATE IMAGE
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