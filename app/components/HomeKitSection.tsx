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
    href: "/produto/kit-4-cameras-ip-fullhd",
    image: "/kits/kit3.jpg",
  },


];

export default function HomeKitSection() {

  return (

    <>

      {/* HEADER */}
     <section className={s.grid}>

  {/* CARD GRANDE */}
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
  <div className={s.rightGrid}>

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

  </div>

</section>

    </>

  );
}