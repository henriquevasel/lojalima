import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/auth";

function checkAdmin(req: Request) {

  const authHeader =
    req.headers.get("authorization");

  // =========================
  // AUTH HEADER
  // =========================
  if (!authHeader) {
    throw new Error("Não autorizado");
  }

  // =========================
  // BEARER
  // =========================
  if (
    !authHeader.startsWith("Bearer ")
  ) {
    throw new Error("Token inválido");
  }

  const token =
    authHeader.split(" ")[1];

  // =========================
  // VERIFY TOKEN
  // =========================
  const decoded: any =
    verifyToken(token);

  if (
    !decoded ||
    decoded.role !== "ADMIN"
  ) {
    throw new Error("Acesso negado");
  }
}

/* =========================
BUSCAR PRODUTO
========================= */
export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    checkAdmin(req);

    const { id } =
      await context.params;

    const productId =
      Number(id);

    // =========================
    // VALIDAR ID
    // =========================
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        include: {
          productimage: true,
        },
      });

    // =========================
    // PRODUTO NÃO ENCONTRADO
    // =========================
    if (!product) {
      return NextResponse.json(
        {
          error:
            "Produto não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      product
    );

  } catch (error) {

    return NextResponse.json(
      {
        error: "Não autorizado",
      },
      {
        status: 403,
      }
    );
  }
}

/* =========================
ATUALIZAR PRODUTO
========================= */
export async function PUT(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    checkAdmin(req);

    const { id } =
      await context.params;

    const productId =
      Number(id);

    // =========================
    // VALIDAR ID
    // =========================
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    const {
      name,
      slug,
      priceCents,
      description,
      imageUrl,
    } = body;

    // =========================
    // VALIDAÇÕES
    // =========================
    if (
      !name ||
      !slug ||
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof priceCents !==
        "number" ||
      priceCents < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Preço inválido",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // PRODUTO EXISTE?
    // =========================
    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Produto não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // SLUG DUPLICADO
    // =========================
    const slugExists =
      await prisma.product.findFirst({
        where: {
          slug,
          NOT: {
            id: productId,
          },
        },
      });

    if (slugExists) {
      return NextResponse.json(
        {
          error:
            "Slug já existe",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // UPDATE
    // =========================
    const product =
      await prisma.product.update({
        where: {
          id: productId,
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
                url:
                  imageUrl ||
                  "/produtos/placeholder.jpg",
              },
            ],
          },
        },
      });

    return NextResponse.json(
      product
    );

  } catch (error) {

    console.error(
      "❌ ERRO UPDATE PRODUCT:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao atualizar produto",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
EXCLUIR PRODUTO
========================= */
export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    checkAdmin(req);

    const { id } =
      await context.params;

    const productId =
      Number(id);

    // =========================
    // VALIDAR ID
    // =========================
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // PRODUTO EXISTE?
    // =========================
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Produto não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // DELETE
    // =========================
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {

    console.error(
      "❌ ERRO DELETE PRODUCT:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao excluir produto",
      },
      {
        status: 500,
      }
    );
  }
}