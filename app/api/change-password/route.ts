
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    // TOKEN
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // JWT
    const JWT_SECRET = process.env.JWT_SECRET!;

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // BODY
    const body = await req.json();

    const { currentPassword, newPassword } = body;

    // USER
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // VALIDAR SENHA ATUAL
    const senhaCorreta = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    // NOVA SENHA
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // UPDATE
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao alterar senha" },
      { status: 500 }
    );
  }
}
