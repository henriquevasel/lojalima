import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getMercadoPagoClient } from "@/app/lib/mercadopago";
import { Payment } from "mercadopago";
import crypto from "crypto";
import { payment_status } from "@prisma/client";
import { sendOrderEmail } from "@/app/lib/email";

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

    // 🔐 (opcional)
    if (WEBHOOK_SECRET) {
      crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    }

    const body = JSON.parse(rawBody);

    // 🔥 RESPONDE IMEDIATO (ESSENCIAL)
    const response = NextResponse.json({ ok: true });

    // 🔥 PROCESSA DEPOIS (SEM TRAVAR O MP)
    processWebhook(body);

    return response;

  } catch (error) {
    console.error("❌ Erro webhook:", error);
    return NextResponse.json({ ok: true });
  }
}

// 🔥 SUA LÓGICA ORIGINAL (MOVIDA PRA CÁ)
async function processWebhook(body: any) {
  try {
    const client = getMercadoPagoClient();
    if (!client) return;

    if (body.type !== "payment") return;

    const paymentId = body?.data?.id;
    if (!paymentId) return;

    console.log("Webhook recebido:", paymentId);

    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({
      id: paymentId,
    });

    console.log("STATUS DO PAGAMENTO:", payment.status);

    const orderId = payment.external_reference;
    if (!orderId) return;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitem: true,
        user: true,
      },
    });

    if (!order) return;

    const status = mapPayment_status(payment.status);
    let shouldSendEmail = false;

    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          status,
          externalId: String(paymentId),
        },
      });

      if (status === payment_status.approved) {
        if (order.status === "paid") return;

        console.log("✅ Pagamento aprovado:", paymentId);

        await tx.order.update({
          where: { id: orderId },
          data: { status: "paid" },
        });

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

        await tx.cartitem.deleteMany({
          where: { userId: order.userId },
        });

        shouldSendEmail = true;
      }
    });

    if (shouldSendEmail) {
  const fullOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderitem: true,
    },
  });

  if (fullOrder) {
    await sendOrderEmail(fullOrder);
  }
}

  } catch (err) {
    console.error("❌ Erro async webhook:", err);
  }
}