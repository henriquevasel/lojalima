import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

// ================= EMAIL DE VERIFICAÇÃO =================
export async function sendVerificationEmail(email: string, link: string) {
  try {
    const resend = getResendClient();

    if (!resend) {
      console.warn("RESEND_API_KEY não configurada. Email de verificação não enviado.");
      return;
    }

    await resend.emails.send({
      from: "Loja Lima & Lima <contato@lojalimaelima.com.br>",
      to: email,
      subject: "Confirme seu email",
      html: `
        <div style="font-family:Arial,sans-serif;text-align:center;padding:20px">
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
            Se não funcionar:<br/> ${link}
          </p>
        </div>
      `,
    });

    console.log("📧 EMAIL VERIFICAÇÃO ENVIADO");
  } catch (error) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", error);
  }
}

// ================= EMAIL DE PEDIDO =================
export async function sendOrderEmail(order: any) {
  try {
    const resend = getResendClient();

    if (!resend) {
      console.warn("RESEND_API_KEY não configurada. Email de pedido não enviado.");
      return;
    }

    const produtosHTML = order.orderitem
      .map(
        (item: any) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:center;">
            ${item.qty}
          </td>
        </tr>
      `
      )
      .join("");

    await resend.emails.send({
      from: "Loja Lima & Lima <contato@lojalimaelima.com.br>",
      to: [process.env.COMPANY_EMAIL as string, order.customerEmail],
      subject: `🛒 Pedido confirmado #${order.id.slice(0, 8)}`,
      html: `
      <div style="background:#f6f6f6;padding:30px 0;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;font-family:Arial,sans-serif;color:#333;">

          <!-- HEADER COM LOGO -->
          <div style="background:#000;padding:20px;text-align:center;">
            <img 
              src="https://behalf-remember-promotional-nyc.trycloudflare.com/produtos/logo.png"
              alt="Logo"
              style="max-height:60px;"
            />
          </div>

          <!-- CONTEÚDO -->
          <div style="padding:20px;">

            <h3 style="margin-top:0;">🧾 Pedido #${order.id.slice(0, 8)}</h3>

            <!-- CLIENTE -->
            <h4>👤 Dados do Cliente</h4>
            <p><strong>Nome:</strong> ${order.customerName}</p>
            <p><strong>Whats:</strong> ${order.customerWhats}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>CPF:</strong> ${order.customerCpf || "-"}</p>

            <!-- ENDEREÇO -->
            <h4 style="margin-top:20px;">📍 Endereço de Entrega</h4>
            <p>
              ${order.street || ""}, ${order.number || ""}<br/>
              ${order.neighborhood || ""}<br/>
              ${order.city || ""} - ${order.state || ""}<br/>
              CEP: ${order.cep || ""}
            </p>

            <!-- PRODUTOS -->
            <h4 style="margin-top:20px;">🛒 Produtos</h4>

            <table width="100%" style="border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="text-align:left;border-bottom:2px solid #000;">
                  <th style="padding:8px 0;">Produto</th>
                  <th style="padding:8px 0;text-align:center;">Qtd</th>
                </tr>
              </thead>
              <tbody>
                ${produtosHTML}
              </tbody>
            </table>

            <!-- TOTAL -->
            <div style="margin-top:20px;padding:15px;background:#f1f1f1;border-radius:8px;text-align:right;">
              <span style="font-size:14px;">Total:</span><br/>
              <strong style="font-size:20px;">
                R$ ${(order.totalCents / 100).toFixed(2)}
              </strong>
            </div>

          </div>

          <!-- FOOTER -->
          <div style="background:#fafafa;padding:15px;text-align:center;font-size:12px;color:#777;">
            <p>Este é um email automático.</p>
            <p>Loja Lima & Lima © ${new Date().getFullYear()}</p>
          </div>

        </div>
      </div>
      `,
    });

    console.log("📧 EMAIL DE PEDIDO ENVIADO (BONITO)");
  } catch (error) {
    console.error("❌ ERRO AO ENVIAR EMAIL DE PEDIDO:", error);
  }
}