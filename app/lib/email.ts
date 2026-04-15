import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, link: string) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "henriquevasel9@gmail.com",
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