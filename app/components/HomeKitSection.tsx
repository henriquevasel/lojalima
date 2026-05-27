"use client";

import Link from "next/link";
import s from "@/app/styles/homeKits.module.css";

export default function HomeKitBanner() {

  return (

    <Link
      href="/produto/kit-4-cameras-ip-ia-fullhd"
      className={s.banner}
    >

      <div className={s.imageArea}>

        <img
          src="/kits/kit1.png"
          alt="Kit câmeras"
          className={s.image}
        />

        <div className={s.content}>

          <span className={s.badge}>
            PROMOÇÃO ATÉ 29/05
          </span>

          <h2>
            KIT 4 CÂMERAS IP COM IA
          </h2>

          <p>
            Solução completa com gravador,
            HD, integração e monitoramento.
          </p>

          <div className={s.priceArea}>

            <div className={s.oldPrice}>
              R$ 5.890
            </div>

            <div className={s.price}>
              R$ 4.990
            </div>

            <button className={s.button}>
              comprar
            </button>

          </div>

        </div>

      </div>

    </Link>
  );
}