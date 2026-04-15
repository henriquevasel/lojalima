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

// LISTAR PRODUTOS
export async function GET(req: Request) {

  try {

    checkAdmin(req);

    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
      include: {
        productimage: true
      }
    });

    return NextResponse.json(products);

  } catch (error) {

    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 403 }
    );

  }

}



// CRIAR PRODUTO
export async function POST(req: Request) {

  try {

    checkAdmin(req);

    const body = await req.json();

    const {
      name,
      slug,
      priceCents,
      description,
      imageUrl
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        priceCents,
        description,
        active: true,
        productimage: {
          create: [
            {
              url: imageUrl
            }
          ]
        }
      }
    });

    return NextResponse.json(product);

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );

  }

}