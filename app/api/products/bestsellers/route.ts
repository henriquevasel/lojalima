import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { aplicarMarkupProdutos } from "@/app/lib/product";


export async function GET() {

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

  let products: any[] = [];

  if (sales.length > 0) {
    const productIds = sales.map((s) => s.productId).filter(Boolean);

    products = await prisma.product.findMany({
      where: {
        id: { in: productIds as number[] },
       
      },
      include: { productimage: true },
    });
  }

  // 🔥 SE NÃO VEIO NADA → FALLBACK
 if (products.length === 0) {
  const fallback = await prisma.product.findMany({
    where: {
      active: true,
      
    },
    include: { productimage: true },
    take: 20 // 🔥 pega mais produtos
  });

  // 🔥 embaralha
  const shuffled = fallback.sort(() => 0.5 - Math.random());

  // 🔥 pega só 6
  products = shuffled.slice(0, 6);
}

  return NextResponse.json(aplicarMarkupProdutos(products));
}