import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import { getFinalPrice } from "@/app/lib/price";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page") || "1");
  const smartHome = search === "smart-home";

  const take = Number(searchParams.get("limit") || "60");

  const skip = (page - 1) * take;

  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const where: any = {
    active: true,

    // 🔥 somente produtos bons
    featured: true,

    // 🔥 somente com estoque
    stock: {
      quantity: {
        gt: 0,
      },
    },

    // 🔥 somente produtos com imagem
    productimage: {
      some: {
        url: {
          notIn: ["", "null"],
        },
      },
    },
  };

  /* =========================
  BUSCA
  ========================= */

  if (smartHome) {

    where.OR = [

      // automatizadores
      {
        productcategory: {
          some: {
            category: {
              slug: {
                contains: "automat",
              },
            },
          },
        },
      },

      // EWS
      {
        name: {
          contains: "EWS",
        },
      },

      // SMART
      {
        name: {
          contains: "SMART",
        },
      },

    ];

  } else if (search) {

  const terms = search
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0);

  where.AND = terms.map(term => ({
    OR: [
      {
        name: {
          contains: term,
        },
      },

      {
        slug: {
          contains: term,
        },
      },

      {
        sku: {
          contains: term,
        },
      },

      {
        brand: {
          contains: term,
        },
      },
    ],
  }));

}

  /* =========================
  CATEGORIA
  ========================= */

  if (category) {

    where.productcategory = {
      some: {
        category: {
          slug: category,
        },
      },
    };

  }

  /* =========================
  PREÇO
  ========================= */

  if (min || max) {

    where.priceCents = {
      ...(where.priceCents || {}),

      ...(min && {
        gte: Number(min) * 100,
      }),

      ...(max && {
        lte: Number(max) * 100,
      }),
    };

  }

  /* =========================
  ORDENAÇÃO
  ========================= */

  let orderBy: any = [
    {
      priority: "desc",
    },
    {
      createdAt: "desc",
    },
  ];

  if (sort === "price_asc") {
    orderBy = { priceCents: "asc" };
  }

  if (sort === "price_desc") {
    orderBy = { priceCents: "desc" };
  }

  /* =========================
  QUERY
  ========================= */

  const products = await prisma.product.findMany({
    where,

    include: {

      promotion: true,

      productimage: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },

    orderBy,
    take,
    skip,
  });

  /* =========================
  PREÇOS
  ========================= */

  const adjustedProducts = products.map((product) => {

    // preço original da tua lógica
    const originalPrice =
      calcularPrecoVenda(product.priceCents);

    // aplica promoção SOMENTE se existir
    const promotionalPrice =
      getFinalPrice({
        ...product,
        priceCents: originalPrice,
      });

    return {
      ...product,

      // preço original
      priceCentsOriginal:
        originalPrice,

      // preço final
      priceCents:
        promotionalPrice,

      // controla frontend
      hasPromotion:
        promotionalPrice <
        originalPrice,
    };
  });

  return NextResponse.json(adjustedProducts);
}