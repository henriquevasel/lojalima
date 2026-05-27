"use client";

import Link from "next/link";
import s from "@/app/styles/homeKits.module.css";

const kits = [
  {
    title: "KIT 4 CÂMERAS IP COM IA",
    price: "R$ 4.990",
    href: "/produto/kit-4-cameras-ip-ia-fullhd",
    image: "/kits/kit1.jpg",
    large: true,
  },

  {
    title: "KIT 4 CÂMERAS IP FULL HD",
    price: "R$ 2.410",
    href: "/produto/kit-4-cameras-ip-fullhd",
    image: "/kits/kit2.jpg",
  },

  {
    title: "KIT CÂMERAS ANALÓGICAS",
    price: "R$ 1.403",
    href: "/produto/kit-4-cameras-analogicas-fullhd",
    image: "/kits/kit3.jpg",
  },
];

export default function HomeKitSection() {

  return (

    <section className={s.section}>

      <div className={s.container}>

        <div className={s.header}>
          <h2>Kits e Promoções</h2>
          <p>
            Soluções completas para sua empresa,
            residência ou projeto.
          </p>
        </div>

        <div className={s.grid}>

          {kits.map((kit, index) => (

            <Link
              key={index}
              href={kit.href}
              className={`${s.card} ${kit.large ? s.large : ""}`}
            >

              <img
                src={kit.image}
                alt={kit.title}
                className={s.image}
              />

              <div className={s.overlay} />

              <div className={s.content}>

                <span className={s.badge}>
                  PROMOÇÃO
                </span>

                <h3>{kit.title}</h3>

                <div className={s.price}>
                  {kit.price}
                </div>

                <button className={s.button}>
                  Comprar agora
                </button>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}