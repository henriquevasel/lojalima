import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import client from "@/app/lib/mercadopago";
import { Payment } from "mercadopago";
import crypto from "crypto";
import { payment_status } from "@prisma/client";
import { sendOrderEmail } from "@/app/lib/email";

const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET as string;

// 🔥 MAPEAMENTO
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
    console.log("🚀 NOVO WEBHOOK V2");

    const rawBody = await req.text();

    if (WEBHOOK_SECRET) {
      crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    }

    const body = JSON.parse(rawBody);

    // 🔥 DEBUG PRINCIPAL
    console.log("📦 BODY:", body);

    const response = NextResponse.json({ ok: true });

    processWebhook(body).catch((err) => {
      console.error("❌ ERRO BACKGROUND:", err);
    });

    return response;
  } catch (error) {
    console.error("❌ Erro webhook:", error);
    return NextResponse.json({ ok: true });
  }
}

async function processWebhook(body: any) {
  try {
    // 🔥 FILTRO FLEXÍVEL
    if (
      body.type !== "payment" &&
      body.action !== "payment.created" &&
      body.action !== "payment.updated"
    ) {
      console.log("⛔ Evento ignorado:", body);
      return;
    }

    const paymentId = body?.data?.id || body?.id;

    if (!paymentId) {
      console.log("❌ Sem paymentId");
      return;
    }

    console.log("💳 Payment ID:", paymentId);

    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({
      id: paymentId,
    });

    // 🔥 DEBUG CRÍTICO
    console.log("💰 PAYMENT:", payment);
    console.log("📌 STATUS:", payment.status);
    console.log("🧾 EXTERNAL REF:", payment.external_reference);

    const orderId = payment.external_reference;

    if (!orderId) {
      console.log("❌ Sem orderId (external_reference vazio)");
      return;
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
      return;
    }

    const status = mapPayment_status(payment.status);
    let shouldSendEmail = false;

    await prisma.$transaction(async (tx) => {
      // 🔥 UPSERT (CORRETO)
      await tx.payment.upsert({
        where: { orderId },
        update: {
          status,
          externalId: String(paymentId),
        },
        create: {
          orderId,
          provider: "mercadopago",
          status,
          amountCents: order.totalCents,
          externalId: String(paymentId),
        },
      });

      // 🔥 APROVADO
      if (status === payment_status.approved) {
        if (order.status === "paid") {
          console.log("⚠️ Pedido já estava pago");
          return;
        }

        console.log("✅ Pagamento aprovado:", paymentId);

        await tx.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        });

        // 🔥 BAIXA ESTOQUE
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

        // 🔥 LIMPA CARRINHO
        await tx.cartitem.deleteMany({
          where: { userId: order.userId },
        });

        shouldSendEmail = true;
      }
    });

    // 🔥 EMAIL
    if (shouldSendEmail) {
      const fullOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderitem: true,
        },
      });

      if (fullOrder) {
        console.log("📧 Enviando email...");
        await sendOrderEmail(fullOrder);
      } else {
        console.log("❌ Pedido não encontrado para email");
      }
    } else {
      console.log("⛔ Email não enviado (status não aprovado)");
    }
  } catch (err) {
    console.error("❌ Erro async webhook:", err);
  }
}