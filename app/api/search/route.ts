  import { NextResponse } from "next/server";
  import { prisma } from "@/app/lib/prisma";

  export async function GET(req: Request) {

    try {

      const { searchParams } = new URL(req.url);

      let q = searchParams.get("q") || "";

      q = q.trim().toLowerCase();

      if (q.length < 2) {
        return NextResponse.json([]);
      }

  const terms = q.split(" ").filter(t => t.length > 1);

const products = await prisma.product.findMany({
  where: {
    active: true,

    AND: terms.map(term => ({
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

      return NextResponse.json([], { status: 500 });

    }

  }