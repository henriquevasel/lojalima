import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import { getFinalPrice } from "@/app/lib/price";

export const revalidate = 3600;

export async function GET() {

  const products = await prisma.product.findMany({

    where: {
      active: true,

      highlight: true,

      stock: {
        quantity: {
          gt: 0,
        },
      },

      productimage: {
        some: {
          url: {
            notIn: ["", "null"],
          },
        },
      },
    },

    include: {

      promotion: true,

      productimage: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },

    orderBy: {
      updatedAt: "desc",
    },

    take: 20,
  });

  const adjustedProducts = products.map((product) => {

    const originalPrice =
      calcularPrecoVenda(product.priceCents);

    const promotionalPrice =
      getFinalPrice({
        ...product,
        priceCents: originalPrice,
      });

    return {
      ...product,

      priceCentsOriginal:
        originalPrice,

      priceCents:
        promotionalPrice,

      hasPromotion:
        promotionalPrice <
        originalPrice,
    };
  });

  return NextResponse.json(
    adjustedProducts
  );
}