"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesCarousel() {

  const [categories, setCategories] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    async function load() {

      const res = await fetch("/api/categories");
      const data = await res.json();

      setCategories(data);
    }

    load();

  }, []);

  function scrollLeft() {
    containerRef.current?.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  }

  function scrollRight() {
    containerRef.current?.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  }

  return (

    <section style={{ marginBottom: 70 }}>

      <h2 style={{ marginBottom: 25 }}>
        Explore por categoria
      </h2>

      <div style={{ position: "relative" }}>

        {/* botão esquerda */}

        <button
          onClick={scrollLeft}
          style={{
            position: "absolute",
            left: -20,
            top: "35%",
            zIndex: 2,
            background: "#22c55e",
            border: "none",
            borderRadius: "50%",
            width: 35,
            height: 35,
            cursor: "pointer"
          }}
        >
          ‹
        </button>

        {/* categorias */}

        <div
          ref={containerRef}
          style={{
            display: "flex",
            gap: 40,
            overflowX: "auto",
            scrollBehavior: "smooth",
            padding: "10px 5px"
          }}
        >

    {categories
  .filter(cat =>
    [
      "seguranca",
      "redes",
      "energia",
      "informatica",
      "telefonia",
      "cftv",
      "cabeamento"
    ].includes(cat.slug)
  )
  .map((cat) => (

            <Link
              key={cat.id}
              href={`/loja?category=${cat.slug}`}
            >

              <div
                style={{
                  minWidth: 120,
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >

                <div
                  style={{
                    position: "relative",
                    height: 70,
                    width: 70,
                    margin: "0 auto 10px auto"
                  }}
                >

                  <Image
                    src={`/categorias/${cat.slug}.png`}
                    alt={cat.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />

                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  {cat.name}
                </div>

              </div>

            </Link>

          ))}

        </div>

        {/* botão direita */}

        <button
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: -20,
            top: "35%",
            zIndex: 2,
            background: "#22c55e",
            border: "none",
            borderRadius: "50%",
            width: 35,
            height: 35,
            cursor: "pointer"
          }}
        >
          ›
        </button>

      </div>

    </section>

  );

}