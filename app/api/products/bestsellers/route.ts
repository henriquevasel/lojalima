import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { aplicarMarkupProdutos } from "@/app/lib/product";

export async function GET() {

  // Agrupa vendas por produto
  const sales = await prisma.orderitem.groupBy({
    by: ["productId"],
    _sum: {
      qty: true,
    },
    orderBy: {
      _sum: {
        qty: "desc",
      },
    },
    take: 6,
  });

  // Se ainda não houver vendas
  if (sales.length === 0) {
    const fallback = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: { productimage: true },
      take: 6,
    });

    return NextResponse.json(aplicarMarkupProdutos(fallback));
  }

  const productIds = sales.map((s) => s.productId).filter(Boolean);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds as number[] },
    },
    include: { productimage: true },
  });

  return NextResponse.json(aplicarMarkupProdutos(products));
}