"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/loja.module.css";

export default function CategoriesSection() {

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

  <section style={{ marginBottom: 30 }}>

    <h2 className={styles.sectionTitle}>
      Explore por categoria
    </h2>

    <div className={styles.categories}>

      {Array.isArray(categories) && categories.map((cat) => (

        <Link key={cat.id} href={`/loja?category=${cat.slug}`}>

          <div className={styles.categoryItem}>

            <div className={styles.categoryIcon}>

              <Image
                src={`/produtos/${cat.slug}.png`}
                alt={cat.name}
                fill
                sizes="80px"
                className={styles.categoryImg}
              />

            </div>

            <div className={styles.categoryName}>
              {cat.name}
            </div>

          </div>

        </Link>

      ))}

    </div>

  </section>

);
}