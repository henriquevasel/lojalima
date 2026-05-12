import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";
import { limparCarrinho } from "@/app/lib/cart";
import client from "@/app/lib/mercadopago";
import { Preference } from "mercadopago";
import { cookies } from "next/headers";
import { getUserId } from "@/app/lib/getUserId";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import { sendOrderEmail } from "@/app/lib/email";

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
        
        endereco,
        numero,
        couponCode
        
    } = body;

    



    if (!endereco || !endereco.cep) {
  return NextResponse.json(
    { error: "Endereço não informado" },
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
        product: {
  include: {
    productimage: true,
    stock: true
  }
},
        productvariant: true
      }
    });

    if (!cartItems.length) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    const response = await fetch(
  "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
      "Accept": "application/json",
      "User-Agent":
        "Lima e Lima Ecommerce (contato@lojalimaelima.com.br)"
    },

    body: JSON.stringify({

      from: {
        postal_code: "89251155"
      },

      to: {
        postal_code: endereco.cep.replace(/\D/g, "")
      },

      products: [
        {
          id: "1",
          width: 20,
          height: 5,
          length: 30,
          weight: 1,
          insurance_value: 100,
          quantity: cartItems.length
        }
      ],

      options: {
        receipt: false,
        own_hand: false
      }
    })
  }
);

const freteData = await response.json();

const melhorOpcao = Array.isArray(freteData)
  ? freteData.find(
      (item: any) =>
        !item.error &&
        item.price &&
        Number(item.price) > 0
    )
  : null;

if (!melhorOpcao) {
  return NextResponse.json(
    { error: "Erro ao calcular frete" },
    { status: 400 }
  );
}

const freteCents = Math.round(
  Number(melhorOpcao.price) * 100
);


    // ================= TOTAL =================
    let discountCents = 0;
    let totalCents = 0;

    for (const item of cartItems) {

      const stockQty =
  item.product.stock?.quantity || 0;

if (stockQty < item.qty) {
  return NextResponse.json(
    {
      error: `Produto ${item.product.name} sem estoque`
    },
    { status: 400 }
  );
}

    const basePrice =
  item.productvariant?.priceCents ??
  item.product.priceCents;

const price = calcularPrecoVenda(basePrice);

totalCents += price * item.qty;

    }

    totalCents += freteCents || 0;

    if (couponCode) {

  const coupon = await prisma.coupon.findUnique({
    where: {
      code: couponCode
    }
  });

  if (
    coupon &&
    coupon.active
  ) {

    const subtotal = totalCents;

    // validade
    if (
      coupon.expires_at &&
      new Date(coupon.expires_at) < new Date()
    ) {
      throw new Error("Cupom expirado");
    }

    // mínimo
    if (
      subtotal >= Number(coupon.min_purchase)
    ) {

      if (coupon.type === "percent") {

        discountCents =
          Math.round(
            subtotal *
            (Number(coupon.value) / 100)
          );

      }

      if (coupon.type === "fixed") {

        discountCents =
          Number(coupon.value) * 100;

      }

    }

  }

}

    if (totalCents <= 0) {
      return NextResponse.json(
        { error: "Total inválido" },
        { status: 400 }
      );
    }

    totalCents =
  Math.max(
    totalCents - discountCents,
    0
  );

  // 🔥 DESCONTO PIX
if (paymentMethod === "pix") {
  totalCents = Math.round(totalCents * 0.95);
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

  // 🔥 ENDEREÇO (aqui embaixo, organizado)
  cep: endereco?.cep || "",
  city: endereco?.cidade || "",
  state: endereco?.uf || "",
  street: endereco?.logradouro || "",
  neighborhood: endereco?.bairro || "",
  number: numero || "",

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

      

      return { order, payment };

    });

    const fullOrder = await prisma.order.findUnique({
  where: { id: result.order.id },
  include: { orderitem: true }
});




    // ================= MERCADO PAGO =================

    const preference = new Preference(client);

const baseUrl = "https://lojalimaelima.com.br";

const preferenceData = await preference.create({
  body: {
    items: [

  ...cartItems.map(item => ({
    id: String(item.productId),
    title: item.product.name,
    quantity: item.qty,

    unit_price:
      calcularPrecoVenda(
        item.productvariant?.priceCents ??
        item.product.priceCents
      ) / 100,

    currency_id: "BRL"
  })),

  {
    id: "frete",
    title: "Frete",
    quantity: 1,
    unit_price: (freteCents || 0) / 100,
    currency_id: "BRL"
  },

  ...(discountCents > 0
    ? [{
        id: "discount",
        title: "Cupom de desconto",
        quantity: 1,
        unit_price: -(discountCents / 100),
        currency_id: "BRL"
      }]
    : []),

    ...(paymentMethod === "pix"
  ? [{
      id: "pix-discount",
      title: "Desconto PIX 5%",
      quantity: 1,
      unit_price: -(
        Math.round(totalCents * 0.05) / 100
      ),
      currency_id: "BRL"
    }]
  : []),

],

  payer: {
  email: customerEmail,
  identification: {
    type: "CPF",
    number: customerCpf.replace(/\D/g, "") // 🔥 IMPORTANTE
  }
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