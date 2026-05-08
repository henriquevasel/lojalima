"use client";

import Link from "next/link";
import styles from "@/app/styles/productCard.module.css";

export default function ProductCard({ product }: any) {

  // imagem principal
  const image = product?.productimage?.[0]?.url;

  const priceNumber = product.priceCents / 100;

  const price = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceNumber);

  const installment = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceNumber / 12);

  const description =
    product.description
      ? product.description.slice(0, 60) + "..."
      : "Produto profissional com alto desempenho.";

  return (
    <Link href={`/produto/${product.slug}`} className={styles.link}>

      <div className={styles.card}>

        {/* IMAGEM */}
        <div className={styles.imageWrapper}>

          <img
            src={image}
            alt={product.name}
            className={styles.image}

            onError={(e) => {
              e.currentTarget.src = "/produtos/placeholder.jpg";
            }}
          />

          {product.featured && (
            <div className={styles.badgeFeatured}>
              Mais vendido
            </div>
          )}

        </div>

        {/* INFO */}
        <div className={styles.info}>

          {product.brand && (
            <div className={styles.brand}>
              {product.brand}
            </div>
          )}

          <div className={styles.name}>
            {product.name}
          </div>

          <div className={styles.description}>
            {description}
          </div>

          <div className={styles.price}>
            {price}
          </div>

          <div className={styles.installments}>
            ou 12x de {installment || price} no cartão
          </div>

        </div>

      </div>

    </Link>
  );
}