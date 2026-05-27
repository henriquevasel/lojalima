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
    href: "/produto/kit-4-cameras-analogicas-fullhd",
    image: "/kits/kit3.jpg",
  },

];

export default function HomeKitSection() {

  return (

    <div className={s.grid}>

      {kits.map((kit, index) => (

        <Link
          key={index}
          href={kit.href}
          className={s.card}
        >

          <img
            src={kit.image}
            alt="Kit promocional"
            className={s.image}
          />

        </Link>

      ))}

    </div>
  );
}