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
LISTAR PRODUTOS
========================= */
export async function GET(
  req: Request
) {

  try {

    checkAdmin(req);

    const products =
      await prisma.product.findMany({
        orderBy: {
          id: "desc",
        },

        include: {
          productimage: true,
        },
      });

    return NextResponse.json(
      products
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
CRIAR PRODUTO
========================= */
export async function POST(
  req: Request
) {

  try {

    checkAdmin(req);

    const body =
      await req.json();

    const {
      name,
      slug,
      priceCents,
      description,
      imageUrl,
    } = body;

    /* =========================
    VALIDAÇÕES
    ========================= */
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

    /* =========================
    SLUG DUPLICADO
    ========================= */
    const existingSlug =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
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

    /* =========================
    CREATE
    ========================= */
    const product =
      await prisma.product.create({
        data: {
          name,

          slug,

          priceCents,

          description,

          active: true,

          productimage: {
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
      "❌ ERRO CREATE PRODUCT:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao criar produto",
      },
      {
        status: 500,
      }
    );
  }
}