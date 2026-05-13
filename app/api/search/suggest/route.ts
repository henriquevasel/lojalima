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

    const terms = expandTerms(q).slice(0, 5);

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
    ]);

    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: conditions,
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
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}