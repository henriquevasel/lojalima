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
      .filter(t => t.length > 1);

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

          // busca separada por palavras
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

      include: {
        productimage: {
          take: 1,
        },
      },

      take: 8,

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error("Erro na busca:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}