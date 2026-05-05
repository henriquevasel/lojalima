import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserId } from "@/app/lib/getUserId";
import { calcularPrecoVenda } from "@/app/lib/pricing";

// ==========================
// GET - Buscar carrinho
// ==========================
export async function GET() {
  try {
    const userId = await getUserId();
     
    if (!userId) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const cartItems = await prisma.cartitem.findMany({
      where: { userId },
      include: {
        product: { include: { productimage: true } },
        productvariant: true,
      },
    });

    // 🔥 AQUI ESTÁ A CORREÇÃO
    const cartWithMarkup = cartItems.map((item) => {
      const basePrice =
  item.productvariant?.priceCents ?? item.product.priceCents;

      const priceCents = calcularPrecoVenda(basePrice);

      return {
        ...item,

        // preço final do item (importante pro frontend)
        priceCents,

        // produto com preço atualizado
       product: {
  ...item.product,
  sku: item.product.sku,
  images: item.product.productimage, // ✅ ESSA LINHA NOVA
  priceCents: calcularPrecoVenda(item.product.priceCents),
},

        // variante (se existir)
      productvariant: item.productvariant
  ? {
      ...item.productvariant,
      priceCents: calcularPrecoVenda(item.productvariant.priceCents ?? 0),
    }
  : null,
      };
    });

    return NextResponse.json(cartWithMarkup);

  } catch (error: any) {
    if (
      error.message === "UNAUTHORIZED" ||
      error.message === "INVALID_TOKEN"
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao buscar carrinho" },
      { status: 500 }
    );
  }
}

// ==========================
// POST - Adicionar item
// ==========================
export async function POST(req: Request) {
  try {
    const userId = await getUserId();

      if (!userId) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, variantId, qty } = body;

    if (!productId) {
      return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
    }

    const existing = await prisma.cartitem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existing) {
      await prisma.cartitem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + (qty || 1) },
      });
    } else {
      await prisma.cartitem.create({
        data: {
          userId,
          productId,
          variantId: variantId || null,
          qty: qty || 1,
        },
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (
      error.message === "UNAUTHORIZED" ||
      error.message === "INVALID_TOKEN"
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao adicionar item" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE - Limpar carrinho
// ==========================
export async function DELETE() {
  try {
    const userId = await getUserId();

        if (!userId) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    await prisma.cartitem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    if (
      error.message === "UNAUTHORIZED" ||
      error.message === "INVALID_TOKEN"
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao limpar carrinho" },
      { status: 500 }
    );
  }
}