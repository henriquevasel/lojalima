import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email obrigatório." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Não revelar se o e-mail existe ou não
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "Se existir uma conta com esse e-mail, enviaremos uma nova confirmação.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          error: "Este e-mail já foi confirmado.",
        },
        { status: 400 }
      );
    }

    if (
  user.emailLastSent &&
  Date.now() - new Date(user.emailLastSent).getTime() < 60 * 1000
) {
  return NextResponse.json(
    {
      error:
        "Aguarde 1 minuto antes de solicitar outro e-mail.",
    },
    {
      status: 429,
    }
  );
}

    // Novo token
    const emailToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: hashedToken,
        emailVerifyExpires: expires,
      },
    });

    const verifyLink = `https://lojalimaelima.com.br/api/verify-email?token=${emailToken}`;

    const emailResult = await sendVerificationEmail(
      user.email,
      verifyLink
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailStatus: emailResult.success ? "sent" : "failed",
        emailLastSent: new Date(),
        emailLastError: emailResult.error,
        resendEmailId: emailResult.response?.data?.id ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Novo e-mail enviado.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao reenviar e-mail." },
      { status: 500 }
    );
  }
}