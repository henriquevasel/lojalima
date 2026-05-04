import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendResetEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 🔥 não revela se existe ou não
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // ✅ AQUI ESTAVA O PROBLEMA
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 1000 * 60 * 60), // 1h
      },
    });

    const link = `https://lojaliamelima.com.br/reset-password?token=${token}`;

    await sendResetEmail(email, link);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro no forgot-password:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}