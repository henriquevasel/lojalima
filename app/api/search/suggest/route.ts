import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    let q = searchParams.get("q") || "";

    q = q
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const terms = q
      .split(" ")
      .filter(term => term.length > 1);

    const products = await prisma.product.findMany({
      where: {
        active: true,

        OR: [
          // busca completa
          {
            name: {
              contains: q,
            },
          },

          {
            slug: {
              contains: q,
            },
          },

          {
            brand: {
              contains: q,
            },
          },

          // busca por palavras separadas
          ...terms.map(term => ({
            name: {
              contains: term,
            },
          })),

          ...terms.map(term => ({
            slug: {
              contains: term,
            },
          })),

          ...terms.map(term => ({
            brand: {
              contains: term,
            },
          })),

          // categoria
          ...terms.map(term => ({
            productcategory: {
              some: {
                category: {
                  name: {
                    contains: term,
                  },
                },
              },
            },
          })),
        ],
      },

      select: {
        id: true,
        name: true,
        slug: true,
        priceCents: true,

        productimage: {
          take: 1,
          select: {
            url: true,
          },
        },
      },

      take: 8,
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error("Erro na busca:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}