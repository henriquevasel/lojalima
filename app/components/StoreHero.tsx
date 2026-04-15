"use client";

import styles from "@/app/styles/loja.module.css";

export default function StoreHero() {
  return (
    <section className={styles.hero}>

      <div className={styles.heroOverlay}></div>

      <div className={styles.heroContent}>

        <h1 style={{ fontSize: 34, marginBottom: 10 }}>
          Segurança eletrônica profissional
        </h1>

        <p style={{ opacity: 0.8, marginBottom: 25 }}>
          Câmeras • Alarmes • Controle de acesso • Redes
        </p>

        <a
          href="https://wa.me/554738423235"
          style={{
            background: "#22c55e",
            padding: "12px 22px",
            borderRadius: 10,
            color: "#000",
            fontWeight: 700,
            textDecoration: "none"
          }}
        >
          Falar no WhatsApp
        </a>

      </div>

    </section>
  );
}