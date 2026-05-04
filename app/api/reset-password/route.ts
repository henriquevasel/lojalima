import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 🔒 validações básicas
    if (!token || !password) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // 🔐 hash do token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 🔎 busca usuário
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    // 🔐 hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 atualiza usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao resetar senha:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}