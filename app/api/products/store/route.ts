import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page") || "1");

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

    // 🔥 evita produtos muito baratos/genéricos
    priceCents: {
      gt: 10000,
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

  if (search) {

    const terms = search
      .split(" ")
      .filter(t => t.length > 1);

    where.AND = [
      ...(where.AND || []),

      ...terms.map(term => ({
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
            brand: {
              contains: term,
            },
          },
          {
            productcategory: {
              some: {
                category: {
                  name: {
                    contains: term,
                  },
                },
              },
            },
          },
        ],
      })),
    ];
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

  return NextResponse.json(products);
}