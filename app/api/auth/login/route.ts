import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET não definido");
    }

    // ================= VALIDAÇÃO =================
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha obrigatórios" },
        { status: 400 }
      );
    }

    // ================= USUÁRIO =================
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    // 🔥 ================= BLOQUEIO EMAIL (ANTES DA SENHA) =================
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: "Verifique seu email antes de entrar",
          code: "EMAIL_NOT_VERIFIED"
        },
        { status: 403 }
      );
    }

    // ================= SENHA =================
    const senhaValida = await bcrypt.compare(
      password,
      user.password
    );

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    await prisma.user.update({
  where: { id: user.id },
  data: {
    lastLoginAt: new Date(),
  },
});

    // ================= TOKEN =================
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ================= RESPONSE =================
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    // ================= COOKIE =================
    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("💥 ERRO LOGIN:", error);

    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}