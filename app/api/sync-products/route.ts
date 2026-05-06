import { NextResponse } from "next/server";

export async function GET() {
  try {

    const response = await fetch(
      "https://api.digitalsat.com.br/reseller/v4/product",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DIGITALSAT_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro ao conectar API",
          status: response.status,
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      total: data.length,
      firstProduct: data[0],
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}