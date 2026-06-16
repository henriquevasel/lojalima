import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { aplicarMarkupProdutos } from "@/app/lib/product";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { productimage: true },
    orderBy: { priceCents: "desc" },
    take: 6,
  });

  NextResponse.json(aplicarMarkupProdutos(products))
}