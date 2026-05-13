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

    const terms = expandTerms(q).slice(0, 10);

    const conditions = terms.flatMap((term) => {
      const compact = term.replace(/\s|-/g, "");

      return [
        // NAME
        {
          name: {
            contains: term,
          },
        },

        {
          name: {
            contains: compact,
          },
        },

        // SLUG
        {
          slug: {
            contains: term,
          },
        },

        {
          slug: {
            contains: compact,
          },
        },

        // BRAND
        {
          brand: {
            contains: term,
          },
        },

        // SKU
        {
          sku: {
            contains: term,
          },
        },

        // DESCRIPTION
        {
          description: {
            contains: term,
          },
        },

        // CATEGORY
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
      ];
    });

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

      take: 80,
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
            .filter(
              (term): term is string =>
                Boolean(term && term.length > 1)
            )
            .join(" ")
        );

        let score = 0;

        for (const term of terms) {
          const compact = term.replace(/\s|-/g, "");

          // NOME
          if (
            product.name &&
            normalize(product.name).includes(term)
          ) {
            score += 30;
          }

          // MATCH COMPACTO
          if (
            product.name &&
            normalize(product.name)
              .replace(/\s|-/g, "")
              .includes(compact)
          ) {
            score += 25;
          }

          // MARCA
          if (
            product.brand &&
            normalize(product.brand).includes(term)
          ) {
            score += 18;
          }

          // SKU
          if (
            product.sku &&
            normalize(product.sku).includes(term)
          ) {
            score += 20;
          }

          // SLUG
          if (
            product.slug &&
            normalize(product.slug).includes(term)
          ) {
            score += 10;
          }

          // DESCRIÇÃO
          if (
            product.description &&
            normalize(product.description).includes(term)
          ) {
            score += 6;
          }

          // MATCH GERAL
          if (searchable.includes(term)) {
            score += 3;
          }
        }

        // COMEÇA COM A BUSCA
        if (searchable.startsWith(q)) {
          score += 60;
        }

        return {
          ...product,
          score,
        };
      })
      .filter((product) => product.score > 0)
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