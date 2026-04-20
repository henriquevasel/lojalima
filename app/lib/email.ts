import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ================= EMAIL DE VERIFICAÇÃO =================
export async function sendVerificationEmail(email: string, link: string) {
  try {
    const response = await resend.emails.send({
      from: "Loja Lima & Lima <contato@lojalimaelima.com.br>",
      to: email,
      subject: "Confirme seu email",
      html: `
        <h2>Confirme sua conta</h2>
        <p>Clique no botão abaixo para ativar sua conta:</p>

        <a href="${link}" 
           style="
             display:inline-block;
             padding:12px 20px;
             background:#000;
             color:#fff;
             border-radius:8px;
             text-decoration:none;
           ">
          Confirmar email
        </a>

        <p style="margin-top:20px;font-size:12px;color:#666;">
          Se o botão não funcionar, copie e cole este link no navegador:<br/>
          ${link}
        </p>
      `,
    });

    console.log("📧 EMAIL VERIFICAÇÃO ENVIADO:", response);
  } catch (error) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", error);
  }
}

// ================= EMAIL DE PEDIDO =================
export async function sendOrderEmail(order: any) {
  try {
    const produtos = order.orderitem
      .map((item: any) => `${item.name} x${item.qty}`)
      .join("<br/>");

    await resend.emails.send({
      from: "Loja Lima & Lima <contato@lojalimaelima.com.br>",
      to: [process.env.COMPANY_EMAIL as string, order.customerEmail],
      subject: `🛒 Novo Pedido #${order.id.slice(0, 8)}`,
      html: `
        <h2>Novo pedido recebido</h2>

        <p><strong>Cliente:</strong> ${order.customerName}</p>
        <p><strong>Whats:</strong> ${order.customerWhats}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>

        <h3>🛒 Produtos</h3>
        <p>${produtos}</p>

        <h3>💰 Total</h3>
        <p><strong>R$ ${(order.totalCents / 100).toFixed(2)}</strong></p>
      `,
    });

    console.log("📧 EMAIL DE PEDIDO ENVIADO");
  } catch (error) {
    console.error("❌ ERRO AO ENVIAR EMAIL DE PEDIDO:", error);
  }
}