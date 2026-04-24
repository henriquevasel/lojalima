import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { aplicarMarkupProdutos } from "@/app/lib/product";
import { productsWithImage } from "@/app/lib/productsWithImage";

export async function GET() {

  const products = await prisma.product.findMany({
    where: {
      active: true,
      sku: { in: productsWithImage } // 🔥 só produtos com imagem
    },
    include: { productimage: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return NextResponse.json(aplicarMarkupProdutos(products));
}