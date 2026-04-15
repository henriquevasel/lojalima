import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      name: {
        contains: q
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
     productimage:  {
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