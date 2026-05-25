
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET!;

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const body = await req.json();

    const { name } = body;

    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar" },
      { status: 500 }
    );
  }
}
