import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { aplicarMarkupProdutos } from "@/app/lib/product";

export async function GET() {

  const products = await prisma.product.findMany({
    where: {
      active: true,
      featured: true
    },
    include: {
      productimage: true
    },
    take: 8
  });

  NextResponse.json(aplicarMarkupProdutos(products))
}