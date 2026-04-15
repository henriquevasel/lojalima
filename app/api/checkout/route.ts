import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";
import { limparCarrinho } from "@/app/lib/cart";
import client from "@/app/lib/mercadopago";
import { Preference } from "mercadopago";
import { cookies } from "next/headers";
import { getUserId } from "@/app/lib/getUserId";
import { calcularPrecoVenda } from "@/app/lib/pricing";

export async function POST(req: Request) {

  try {

    // ================= AUTENTICAÇÃO =================

const userId = await getUserId();

  if (!userId) {
  return NextResponse.json(
    { error: "Usuário não autenticado" },
    { status: 401 }
  );
}


    // ================= BODY =================

    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerWhats,
      customerCpf,
      customerObs,
      paymentMethod,
      freteCents
    } = body;

    if (!freteCents || freteCents <= 0) {
    return NextResponse.json(
        { error: "Frete não informado" },
        { status: 400 }
      );
    }

    if (!customerName || !customerWhats || !customerCpf) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    const allowedMethods = ["pix", "credito", "debito"];

    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Método de pagamento inválido" },
        { status: 400 }
      );
    }


    // ================= CARRINHO =================

    const cartItems = await prisma.cartitem.findMany({
      where: { userId },
      include: {
        product: { include: { productimage: true } },
        productvariant: true
      }
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      );
    }


    // ================= TOTAL =================

    let totalCents = 0;

    for (const item of cartItems) {

    const basePrice =
  item.productvariant?.priceCents ??
  item.product.priceCents;

const price = calcularPrecoVenda(basePrice);

totalCents += price * item.qty;

    }

    totalCents += freteCents || 0;

    if (totalCents <= 0) {
      return NextResponse.json(
        { error: "Total inválido" },
        { status: 400 }
      );
    }


    // ================= TRANSACTION =================

    const result = await prisma.$transaction(async (tx) => {

      const order = await tx.order.create({
        data: {
          userId,
          status: "pending",
          totalCents,
          shippingCents: freteCents || 0,
          customerName,
          customerEmail: customerEmail || "",
          customerWhats,
          customerCpf,
          customerObs: customerObs || "",

          orderitem: {
            create: cartItems.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              slug: item.product.slug,
              name: item.product.name,
         priceCents: calcularPrecoVenda(
  item.productvariant?.priceCents ??
  item.product.priceCents
),
              qty: item.qty,
              imageUrl: item.product.productimage[0]?.url || ""
            }))
          }
        }
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "mercadopago",
          status: "pending",
          amountCents: totalCents
        }
      });

      await limparCarrinho(userId);

      return { order, payment };

    });


    // ================= MERCADO PAGO =================

    const preference = new Preference(client);

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const preferenceData = await preference.create({
  body: {
    items: [
      ...cartItems.map(item => ({
        id: String(item.productId),
        title: item.product.name,
        quantity: item.qty,
       unit_price:
  calcularPrecoVenda(
    item.productvariant?.priceCents ?? item.product.priceCents
  ) / 100,
        currency_id: "BRL"
      })),
      {
        id: "frete",
        title: "Frete",
        quantity: 1,
        unit_price: (freteCents || 0) / 100,
        currency_id: "BRL"
      }
    ],

    payer: {
      name: customerName,
      email: customerEmail || "test@test.com"
    },

    payment_methods:
      paymentMethod === "pix"
        ? {
            excluded_payment_types: [
              { id: "credit_card" },
              { id: "debit_card" }
            ]
          }
        : {},

    external_reference: String(result.order.id),

    // 🔥 ESSENCIAL (webhook)
    notification_url: `${baseUrl}/api/payment/webhook`,

    // 🔥 ESSENCIAL (retorno correto)
    back_urls: {
      success: `${baseUrl}/pagamento/retorno?orderId=${result.order.id}`,
      failure: `${baseUrl}/pagamento/retorno?orderId=${result.order.id}`,
      pending: `${baseUrl}/pagamento/retorno?orderId=${result.order.id}`
    },

    auto_return: "approved"
  }
});

    // ================= RESPONSE =================

    return NextResponse.json({
      success: true,
      orderId: result.order.id,
      paymentId: result.payment.id,
      totalCents,
      customerCpf,
      paymentMethod,
      init_point: preferenceData.init_point
    });

  } catch (error) {

    console.log("ERRO CHECKOUT:", error);

    return NextResponse.json(
      { error: "Erro no checkout" },
      { status: 500 }
    );

  }

}