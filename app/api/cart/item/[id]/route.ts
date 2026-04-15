import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserId } from "@/app/lib/auth";

// ==========================
// DELETE ITEM
// ==========================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const item = await prisma.cartitem.findFirst({
      where: {
        id: itemId,
        userId: userId
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    await prisma.cartitem.delete({
      where: {
        id: itemId
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.log("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Erro ao remover" },
      { status: 500 }
    );
  }
}

// ==========================
// UPDATE QTD
// ==========================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const newQty = Number(body.qty);

    if (isNaN(newQty) || newQty < 0) {
      return NextResponse.json(
        { error: "Quantidade inválida" },
        { status: 400 }
      );
    }

    const item = await prisma.cartitem.findFirst({
      where: {
        id: itemId,
        userId: userId
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    // se quantidade for 0 → remove
    if (newQty === 0) {
      await prisma.cartitem.delete({
        where: { id: itemId }
      });

      return NextResponse.json({ removed: true });
    }

    await prisma.cartitem.update({
      where: { id: itemId },
      data: { qty: newQty }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.log("UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Erro ao atualizar" },
      { status: 500 }
    );
  }
}