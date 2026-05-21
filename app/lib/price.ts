export function getFinalPrice(product: any) {
  const promotion = product.promotion;

  if (!promotion || !promotion.active) {
    return product.priceCents;
  }

  const now = new Date();

  if (
    promotion.startsAt &&
    now < new Date(promotion.startsAt)
  ) {
    return product.priceCents;
  }

  if (
    promotion.endsAt &&
    now > new Date(promotion.endsAt)
  ) {
    return product.priceCents;
  }

  if (promotion.discountType === "percentage") {
    return Math.round(
      product.priceCents -
      (product.priceCents * promotion.discountValue) / 100
    );
  }

  if (promotion.discountType === "fixed") {
    return Math.round(
      product.priceCents -
      promotion.discountValue * 100
    );
  }

  return product.priceCents;
}