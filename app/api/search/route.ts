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

   const conditions = terms.flatMap((term) => [
  {
    name: {
      contains: term,
      
    },
  },

  {
    brand: {
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

    OR: [
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

      ...conditions,
    ],
  },

      include: {
        productimage: {
          take: 1,
        },
      },

      take: 200,
    });

   const scored = products
  .map((product) => {

    const name = normalize(product.name || "");
    const brand = normalize(product.brand || "");
    const slug = normalize(product.slug || "");
    const description = normalize(product.description || "");

  let score = 0;

// NOME EXATO
if (name === q) {
  score += 10000;
}

// FRASE COMPLETA
if (name.includes(q)) {
  score += 5000;
}

for (const term of terms) {

  // começa com o termo
  if (name.startsWith(term)) {
    score += 120;
  }

  // palavra exata
  if (name.split(" ").includes(term)) {
    score += 90;
  }

  // contém o termo
  if (name.includes(term)) {
    score += 50;
  }

  // marca
  if (brand.includes(term)) {
    score += 25;
  }

  // slug
  if (slug.includes(term)) {
    score += 15;
  }

  // descrição
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
  .slice(0, 8);

    return NextResponse.json(scored);

  } catch (error) {
    console.error("Erro na busca:", error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}