import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const code = body.code?.trim().toUpperCase();
    const subtotal = Number(body.subtotal || 0);

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Cupom inválido" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: {
        code,
      },
    });

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        message: "Cupom não encontrado",
      });
    }

    if (!coupon.active) {
      return NextResponse.json({
        valid: false,
        message: "Cupom desativado",
      });
    }

    if (
      coupon.expires_at &&
      new Date(coupon.expires_at) < new Date()
    ) {
      return NextResponse.json({
        valid: false,
        message: "Cupom expirado",
      });
    }

    if (subtotal < Number(coupon.min_purchase)) {
      return NextResponse.json({
        valid: false,
        message: `Compra mínima de R$ ${Number(
          coupon.min_purchase
        ).toFixed(2)}`,
      });
    }

    let discount = 0;

    if (coupon.type === "percent") {
      discount = subtotal * (Number(coupon.value) / 100);
    }

    if (coupon.type === "fixed") {
      discount = Number(coupon.value);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        valid: false,
        message: "Erro ao validar cupom",
      },
      {
        status: 500,
      }
    );
  }
}