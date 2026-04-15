"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";

export default function BuscaClient() {

  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const [q, setQ] = useState(qParam);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  useEffect(() => {
    async function load() {
      if (!q) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await fetch("/api/search?q=" + q);
      const data = await res.json();

      setProducts(data);
      setLoading(false);
    }

    load();
  }, [q]);

  return (
    <div className="search-page">

      <h1>Resultados para: {q}</h1>

      {loading && <p>Buscando...</p>}

      <div className="products-grid">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p>Nenhum produto encontrado</p>
      )}

    </div>
  );
}