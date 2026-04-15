import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, link: string) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirme seu email",
      html: `
        <h2>Confirme sua conta</h2>
        <a href="${link}">Confirmar email</a>
      `,
    });

    console.log("EMAIL ENVIADO:", response);

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL:", error);
  }
}

export async function sendOrderEmail(order: any) {
  try {

    const produtos = order.orderitem
      .map((item: any) => `${item.name} x${item.qty}`)
      .join("<br/>");

    await resend.emails.send({
      from: "onboarding@resend.dev",

      // 🔥 email da loja (pode trocar depois)
      to: "marketinglimaelima@gmail.com",

      subject: `🛒 Novo Pedido #${order.id.slice(0,8)}`,

      html: `
        <h2>Novo pedido recebido</h2>

        <p><strong>Cliente:</strong> ${order.customerName}</p>
        <p><strong>Whats:</strong> ${order.customerWhats}</p>

        <h3>📍 Endereço</h3>
        <p>
          ${order.street}<br/>
          ${order.neighborhood}<br/>
          ${order.city} - ${order.state}<br/>
          CEP: ${order.cep}
        </p>

        <h3>🛒 Produtos</h3>
        <p>${produtos}</p>

        <h3>💰 Total</h3>
        <p>R$ ${(order.totalCents / 100).toFixed(2)}</p>
      `
    });

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL DE PEDIDO:", error);
  }
}