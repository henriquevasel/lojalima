import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const products =
    await prisma.product.findMany({

      where: {
        active: true,
        promoMonth: true,

        stock: {
          quantity: {
            gt: 0
          }
        }
      },

      include: {
        productimage: {
          orderBy: {
            sortOrder: "asc"
          },
          take: 1
        },

        promotion: true
      },

      orderBy: {
        updatedAt: "desc"
      },

      take: 20
    });

  return NextResponse.json(products);
}