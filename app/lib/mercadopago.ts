import { MercadoPagoConfig } from "mercadopago";

export function getMercadoPagoClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return null;
  }

  return new MercadoPagoConfig({
    accessToken,
  });
}