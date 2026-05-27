"use client";

import Link from "next/link";
import s from "@/app/styles/homeKitBanner.module.css";

export default function HomeKitBanner() {

  return (

    <Link
      href="/produto/kit-4-cameras-ip-ia-fullhd"
      className={s.banner}
    >

      {/* imagem */}
      <div className={s.imageArea}>

        <img
          src="/kits/kit1.png"
          alt="Kit câmeras"
          className={s.image}
        />

      </div>

      {/* conteúdo */}
      <div className={s.content}>

        <span className={s.badge}>
          PROMOÇÃO
        </span>

        <h2>
          KIT 4 CÂMERAS IP COM IA
        </h2>

        <p>
          Solução completa com câmeras,
          gravador, HD e integração.
        </p>

      </div>

      {/* preço */}
      <div className={s.priceArea}>

        <div className={s.oldPrice}>
          R$ 5.890
        </div>

        <div className={s.price}>
          R$ 4.990
        </div>

        <button className={s.button}>
          Comprar agora
        </button>

      </div>

    </Link>
  );
}