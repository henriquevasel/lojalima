import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    console.log("🔑 TOKEN RECEBIDO:", token);

    if (!token) {
      return NextResponse.json(
        { error: "Token não informado" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpires: {
          gte: new Date(),
        },
      },
    });

    console.log("👤 USER ENCONTRADO:", user);

    if (!user) {
      console.log("❌ TOKEN INVÁLIDO OU EXPIRADO");
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    console.log("✅ EMAIL VERIFICADO COM SUCESSO");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?verified=true`
    );

  } catch (error) {
    console.error("💥 ERRO NO VERIFY:", error);

    return NextResponse.json(
      { error: "Erro ao verificar email" },
      { status: 500 }
    );
  }
}