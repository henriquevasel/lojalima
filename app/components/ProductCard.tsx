"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/productCard.module.css";

export default function ProductCard({ product }: any) {

  // fallback local
  const localImages = [
    `/produtos/${product?.sku}-1.png`,
    `/produtos/${product?.sku}-1.jpg`,
    `/produtos/${product?.sku}-1.jpeg`,
    `/produtos/${product?.sku}-1.webp`,
  ];

  // prioridade:
  // 1. imagem da API
  // 2. imagem local
  // 3. placeholder
  const image =
    product?.productimage?.[0]?.url &&
    product.productimage[0].url !== "null"
      ? product.productimage[0].url
      : localImages[0];

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

          <Image
            src={image}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 25vw"
            className={styles.image}

            onError={(e) => {
              e.currentTarget.src =
                "/produtos/placeholder.jpg";
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