import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";

function checkAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Não autorizado");
  }

  const token = authHeader.split(" ")[1];
  const decoded: any = verifyToken(token);

  if (!decoded || decoded.role !== "ADMIN") {
    throw new Error("Acesso negado");
  }
}

// BUSCAR PRODUTO
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    checkAdmin(req);

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        productimage: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 403 }
    );
  }
}

// ATUALIZAR PRODUTO
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    checkAdmin(req);

    const { id } = await context.params;

    const body = await req.json();

    const {
      name,
      slug,
      priceCents,
      description,
      imageUrl,
    } = body;

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        slug,
        priceCents,
        description,
        productimage: {
  deleteMany: {},
  create: [
            {
              url: imageUrl,
            },
          ],
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// EXCLUIR PRODUTO
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    checkAdmin(req);

    const { id } = await context.params;

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}