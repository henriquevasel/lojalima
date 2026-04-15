import { calcularPrecoVenda } from "./pricing";

export function aplicarMarkupProdutos(products: any[]) {
  return products.map((p) => ({
    ...p,
    priceCents: calcularPrecoVenda(p.priceCents),
  }));
}