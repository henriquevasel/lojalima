import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!product) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    );
  }

  const updated =
    await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        promoMonth: !product.promoMonth,
      },
    });

  return NextResponse.json(updated);
}