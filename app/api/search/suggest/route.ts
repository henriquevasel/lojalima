import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { expandTerms, normalize } from "@/app/lib/search";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const rawQuery = searchParams.get("q") || "";

    const q = normalize(rawQuery);

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const terms = expandTerms(q);

    const conditions = terms.flatMap((term) => [
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
        sku: {
          contains: term,
          
        },
      },

      {
        description: {
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
    ]);

    const products = await prisma.product.findMany({
      where: {
        active: true,

        OR: conditions,
      },

      include: {
        productimage: {
          take: 1,
        },
      },

      take: 40,
    });

    const scored = products
      .map((product) => {
        const searchable = normalize(
          [
            product.name,
            product.slug,
            product.brand,
            product.description,
            product.sku,
          ]
            .filter(Boolean)
            .join(" ")
        );

        let score = 0;

        for (const term of terms) {
          if (
            product.name &&
            normalize(product.name).includes(term)
          ) {
            score += 20;
          }

          if (
            product.brand &&
            normalize(product.brand).includes(term)
          ) {
            score += 12;
          }

          if (
            product.slug &&
            normalize(product.slug).includes(term)
          ) {
            score += 8;
          }

          if (
            product.description &&
            normalize(product.description).includes(term)
          ) {
            score += 4;
          }

          if (searchable.includes(term)) {
            score += 2;
          }
        }

        if (searchable.startsWith(q)) {
          score += 50;
        }

        return {
          ...product,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return NextResponse.json(scored);

  } catch (error) {
    console.error("Erro na busca:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}