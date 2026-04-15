import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserId } from "@/app/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    // 🔥 correção aqui
    const { id } = await context.params;

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderitem: true,
        payment: true
      }
    });

    if (!order || order.userId !== userId) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);

  } catch (error) {

    console.error("Erro ao buscar pedido:", error);

    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}