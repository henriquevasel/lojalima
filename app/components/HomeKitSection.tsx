"use client";

import Link from "next/link";
import s from "@/app/styles/homeKits.module.css";

const kits = [
  {
    href: "/produto/kit-4-cameras-ip-ia-fullhd",
    image: "/produtos/kit1.jpg",
  },

  {
    href: "/produto/kit-4-cameras-ip-fullhd",
    image: "/produtos/kit2.jpg",
  },

  {
    href: "/produto/kit-cupom",
    image: "/produtos/kit3.jpg",
  },

  {
    href: "/produto/kit-antena",
    image: "/produtos/kit4.jpg",
  },
];

export default function HomeKitSection() {

  return (

    <section className={s.grid}>

      {/* ESQUERDA */}
      <Link
        href={kits[0].href}
        className={`${s.card} ${s.large}`}
      >
        <img
          src={kits[0].image}
          alt=""
          className={s.image}
        />
      </Link>

      {/* DIREITA */}
      <div className={s.right}>

        {/* TOPO */}
        <Link
          href={kits[1].href}
          className={`${s.card} ${s.medium}`}
        >
          <img
            src={kits[1].image}
            alt=""
            className={s.image}
          />
        </Link>

        {/* BAIXO */}
        <div className={s.bottom}>

          <Link
            href={kits[2].href}
            className={`${s.card} ${s.small}`}
          >
            <img
              src={kits[2].image}
              alt=""
              className={s.image}
            />
          </Link>

          <Link
            href={kits[3].href}
            className={`${s.card} ${s.small}`}
          >
            <img
              src={kits[3].image}
              alt=""
              className={s.image}
            />
          </Link>

        </div>

      </div>

    </section>
  );
}