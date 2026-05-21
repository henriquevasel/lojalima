"use client";

import Link from "next/link";
import styles from "@/app/styles/productCard.module.css";

export default function ProductCard({ product }: any) {
  console.log(product);

  // imagem principal
  const image =
    product?.productimage?.[0]?.url;

const priceNumber =
  Number(product?.priceCents || 0) / 100;

const originalPriceNumber =
  Number(product?.priceCentsOriginal || 0) / 100;

  const price = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceNumber);
  
  const installment = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
}).format(priceNumber / 3);

const originalPrice = new Intl.NumberFormat(
  "pt-BR",
  {
    style: "currency",
    currency: "BRL",
  }
).format(originalPriceNumber);


  const description =
    typeof product?.description === "string"
      ? product.description.slice(0, 60) + "..."
      : "Produto profissional com alto desempenho.";

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={styles.link}
    >

      <div className={styles.card}>

        {/* IMAGEM */}
        <div className={styles.imageWrapper}>

          {image ? (

            <img
              src={image}
              alt={product?.name || "Produto"}
              className={styles.image}
              loading="lazy"
            />

          ) : (

            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f3f4f6",
                color: "#666",
                fontSize: 13,
                borderRadius: 12,
              }}
            >
              Sem imagem
            </div>

          )}

          {product?.featured && (
            <div className={styles.badgeFeatured}>
              Mais vendido
            </div>
          )}

        </div>

        {/* INFO */}
        <div className={styles.info}>

          {product?.brand && (
            <div className={styles.brand}>
              {product.brand}
            </div>
          )}

          <div className={styles.name}>
            {product?.name || "Produto"}
          </div>

          <div className={styles.description}>
            {description}
          </div>

          <div className={styles.priceArea}>

  {product?.hasPromotion && (
    <div className={styles.oldPrice}>
      {originalPrice}
    </div>
  )}

  <div className={styles.price}>
    {price}
  </div>

</div>

          <div className={styles.installments}>
  3x de {installment} sem juros
</div>

          

        </div>

      </div>

    </Link>
  );
}