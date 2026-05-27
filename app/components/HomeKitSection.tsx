"use client";

import Link from "next/link";
import s from "@/app/styles/homeKits.module.css";

const kits = [

  {
    href: "/produto/kit-4-cameras-ip-ia-fullhd",
    image: "/kits/kit1.jpg",
  },

  {
    href: "/produto/kit-4-cameras-ip-fullhd",
    image: "/kits/kit2.jpg",
  },

  {
    href: "/produto/kit-cupom",
    image: "/kits/kit3.jpg",
  },

  {
    href: "/produto/kit-antena",
    image: "/kits/kit4.jpg",
  },

];

export default function HomeKitSection() {

  return (

    <div className={s.grid}>

      {/* GRANDE */}
      <Link
        href={kits[0].href}
        className={s.card}
      >
        <img
          src={kits[0].image}
          alt=""
          className={s.image}
        />
      </Link>

      {/* DIREITA */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gap: 18,
        }}
      >

        {/* MÉDIO */}
        <Link
          href={kits[1].href}
          className={s.card}
        >
          <img
            src={kits[1].image}
            alt=""
            className={s.image}
          />
        </Link>

        {/* PEQUENOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >

          <Link
            href={kits[2].href}
            className={s.card}
          >
            <img
              src={kits[2].image}
              alt=""
              className={s.image}
            />
          </Link>

          <Link
            href={kits[3].href}
            className={s.card}
          >
            <img
              src={kits[3].image}
              alt=""
              className={s.image}
            />
          </Link>

        </div>

      </div>

    </div>
  );
}