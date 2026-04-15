import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserId } from "@/app/lib/auth";

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderitem: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);

    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}