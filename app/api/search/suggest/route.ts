import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { productsWithImage } from "@/app/lib/productsWithImage";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  let q = searchParams.get("q") || "";

  q = q.trim().toLowerCase();

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,

  
      OR: [
        {
          name: {
            contains: q
          }
        },
        {
          slug: {
            contains: q
          }
        },
        {
          brand: {
            contains: q
          }
        }
      ]
    },

    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      productimage: {
        take: 1,
        select: {
          url: true
        }
      }
    },

    take: 5
  });

  return NextResponse.json(products);
}