"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesGrid() {

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {

    async function load() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }

    load();

  }, []);

  return (

    <section style={{ marginBottom: 70 }}>

      <h2 style={{ marginBottom: 25 }}>Explore por categoria</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: 20
        }}
      >

        {categories.map((cat) => (

          <Link key={cat.id} href={`/loja?category=${cat.slug}`}>

            <div
              style={{
                background: "#111",
                borderRadius: 16,
                padding: 20,
                textAlign: "center",
                cursor: "pointer"
              }}
            >

             <div
  style={{
    height: 120,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <Image
    src={cat.icon || "/icons/camera.png"}
    alt={cat.name}
    width={120}
    height={120}
    style={{
      objectFit: "contain"
    }}
  />
</div>

              <div style={{ fontSize: 13 }}>
                {cat.name}
              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>

  );

}