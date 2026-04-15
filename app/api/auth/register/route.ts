import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ================= VALIDAÇÃO =================
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // ================= VERIFICA USUÁRIO =================
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // ================= HASH SENHA =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= TOKEN + EXPIRAÇÃO =================
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    // ================= CRIA USUÁRIO =================
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        emailVerifyToken: emailToken,
        emailVerifyExpires,
      },
    });

    // ================= LINK =================
    const verifyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${emailToken}`;

    await sendVerificationEmail(email, verifyLink);

    // ================= RESPONSE =================
    return NextResponse.json({
      success: true,
      message: "Conta criada! Verifique seu email antes de entrar.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao registrar" },
      { status: 500 }
    );
  }
}