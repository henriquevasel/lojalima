import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 TOKEN
    const emailToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");

    const emailVerifyExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        emailVerifyToken: hashedToken,
        emailVerifyExpires,
      },
    });

    // 🔗 LINK CORRETO (DIRETO NA API)
   const verifyLink = `https://lojaliamelima.com.br/api/verify-email?token=${emailToken}`;
    console.log("🔥 BASE URL:", process.env.NEXT_PUBLIC_SITE_URL);

    await sendVerificationEmail(email, verifyLink);

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