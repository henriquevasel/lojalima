import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  expandTerms,
  normalize,
  tokenize,
} from "@/app/lib/search";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const rawQuery = searchParams.get("q") || "";

    const q = normalize(rawQuery);

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const terms = expandTerms(q).slice(0, 10);

    const conditions = terms.flatMap((term) => [
      {
        name: {
          contains: term,
          mode: "insensitive" as const,
        },
      },

      {
        brand: {
          contains: term,
          mode: "insensitive" as const,
        },
      },

      {
        slug: {
          contains: term,
          mode: "insensitive" as const,
        },
      },

      {
        sku: {
          contains: term,
          mode: "insensitive" as const,
        },
      },

      {
        description: {
          contains: term,
          mode: "insensitive" as const,
        },
      },

      {
        productcategory: {
          some: {
            category: {
              name: {
                contains: term,
                mode: "insensitive" as const,
              },
            },
          },
        },
      },
    ]);

    const products = await prisma.product.findMany({
      where: {
        active: true,

        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },

          {
            slug: {
              contains: q,
              mode: "insensitive",
            },
          },

          ...conditions,
        ],
      },

      include: {
        productimage: {
          take: 1,
        },
      },

      take: 300,
    });

    const queryTokens = tokenize(q);

    const filtered = products.filter((product) => {
      const text = normalize(`
        ${product.name || ""}
        ${product.brand || ""}
        ${product.slug || ""}
        ${product.description || ""}
        ${product.sku || ""}
      `);

      return queryTokens.every((token) =>
        text.includes(token)
      );
    });

    const scored = filtered
      .map((product) => {
        const name = normalize(product.name || "");
        const brand = normalize(product.brand || "");
        const slug = normalize(product.slug || "");
        const description = normalize(product.description || "");

        const compactName = name.replace(/\s/g, "");
        const compactQuery = q.replace(/\s/g, "");

        let score = 0;

        // Nome exato
        if (name === q) {
          score += 10000;
        }

        // Busca compacta (VIP1220B)
        if (compactName.includes(compactQuery)) {
          score += 3000;
        }

        // Frase completa
        if (name.includes(q)) {
          score += 5000;
        }

        for (const term of terms) {
          if (name.startsWith(term)) {
            score += 120;
          }

          if (name.split(" ").includes(term)) {
            score += 90;
          }

          if (name.includes(term)) {
            score += 50;
          }

          if (brand.includes(term)) {
            score += 25;
          }

          if (slug.includes(term)) {
            score += 15;
          }

          if (description.includes(term)) {
            score += 5;
          }
        }

        return {
          ...product,
          score,
        };
      })
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return NextResponse.json(scored);
  } catch (error) {
    console.error("Erro na busca:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}