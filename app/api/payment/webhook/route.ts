import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import client from "@/app/lib/mercadopago";
import { Payment } from "mercadopago";
import crypto from "crypto";
import { payment_status } from "@prisma/client";

const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET as string;

// 🔥 MAPEAMENTO CORRETO
function mapPayment_status(status: string | undefined): payment_status {
  switch (status) {
    case "approved":
      return payment_status.approved;
    case "pending":
    case "in_process":
      return payment_status.pending;
    case "rejected":
    case "cancelled":
      return payment_status.rejected;
    default:
      return payment_status.pending;
  }
}

export async function POST(req: Request) {
  try {
    console.log("🔥 WEBHOOK CHEGOU");

    const rawBody = await req.text();

    // 🔐 (opcional) validação de assinatura
    if (WEBHOOK_SECRET) {
      const hash = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      // ⚠️ você pode validar header aqui depois se quiser
      // const signature = req.headers.get("x-signature");
    }

    const body = JSON.parse(rawBody);

    // 🔒 filtra eventos
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body?.data?.id;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    console.log("Webhook recebido:", paymentId);

    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({
      id: paymentId,
    });

    console.log("STATUS DO PAGAMENTO:", payment.status);

    const orderId = payment.external_reference;

    if (!orderId) {
      console.log("❌ Sem external_reference");
      return NextResponse.json({ ok: true });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitem: true,
        user: true,
      },
    });

    if (!order) {
      console.log("❌ Pedido não encontrado:", orderId);
      return NextResponse.json({ ok: true });
    }

    const status = mapPayment_status(payment.status);

    await prisma.$transaction(async (tx) => {
      // 🔁 sempre sincroniza pagamento
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          status,
          externalId: String(paymentId),
        },
      });

      // 🎯 só executa lógica quando aprovado
      if (status === payment_status.approved) {
        // 🛑 evita duplicação
        if (order.status === "paid") {
          console.log("⚠️ Pedido já estava pago");
          return;
        }

        console.log("✅ Pagamento aprovado:", paymentId);

        await tx.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        });

        // 📦 atualizar estoque
        for (const item of order.orderitem) {
          if (item.variantId) {
            await tx.stock.updateMany({
              where: { variantId: item.variantId },
              data: {
                quantity: { decrement: item.qty },
              },
            });
          } else {
            await tx.stock.updateMany({
              where: { productId: item.productId },
              data: {
                quantity: { decrement: item.qty },
              },
            });
          }
        }

        // 🛒 limpar carrinho
        await tx.cartitem.deleteMany({
          where: { userId: order.userId },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Erro webhook:", error);

    // ⚠️ IMPORTANTE: sempre retorna 200 pro Mercado Pago
    return NextResponse.json({ ok: true });
  }
}