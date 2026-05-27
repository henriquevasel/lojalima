"use client";

import Link from "next/link";
import s from "@/app/styles/homeKits.module.css";

const kits = [

  {
    href: "/produtos/kit-4-cameras-ip-ia-fullhd",
    image: "/produtos/kit1.jpg",
  },

  {
    href: "/produtos/kit-4-cameras-ip-fullhd",
    image: "/produtos/kit2.jpg",
  },

  {
    href: "/produtos/kit-4-cameras-analogicas-fullhd",
    image: "/kits/kit3.jpg",
  },

];

export default function HomeKitSection() {

  return (

    <section className={s.grid}>

      {/* CARD 1 */}
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

      {/* CARD 2 */}
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

      {/* CARD 3 */}
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

    </section>

  );
}