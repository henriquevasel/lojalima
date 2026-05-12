import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { cep } = body;

    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      return NextResponse.json(
        { error: "CEP inválido" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          "Accept": "application/json",
          "User-Agent": "Aplicação"
        },

        body: JSON.stringify({

          from: {
            postal_code: "89200000" // TEU CEP
          },

          to: {
            postal_code: cepLimpo
          },

          products: [
            {
              id: "1",
              width: 20,
              height: 5,
              length: 30,
              weight: 1,
              insurance_value: 100,
              quantity: 1
            }
          ],

          options: {
            receipt: false,
            own_hand: false
          },

          services: "1,2"
        })
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Erro ao calcular frete" },
      { status: 500 }
    );

  }

}