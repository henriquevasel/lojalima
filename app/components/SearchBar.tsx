"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function SearchBar() {

  const router = useRouter();

  const boxRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);


  /* =========================
  FECHAR AO CLICAR FORA
  ========================= */

  useEffect(() => {

    function handleClickOutside(e: any) {

      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  /* =========================
  BUSCA COM DELAY
  ========================= */

  useEffect(() => {

    if (search.length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {

      try {

        const res = await fetch(`/api/search?q=${search}`);

        if (!res.ok) return;

        const data = await res.json();

        setResults(data);
        setOpen(true);

      } catch (err) {

        console.log("Erro na busca", err);

      }

    }, 300);

    return () => clearTimeout(delay);

  }, [search]);


  /* =========================
  SUBMIT DA BUSCA
  ========================= */

  function handleSubmit(e: any) {

    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/busca?q=${search}`);

    setOpen(false);

  }


  return (

    <div ref={boxRef} style={{ position: "relative" }}>

      {/* INPUT */}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          style={{
            padding: 12,
            width: 350,
            borderRadius: 10,
            border: "1px solid #ccc"
          }}
        />

      </form>


      {/* RESULTADOS */}

      {open && results.length > 0 && (

        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            width: 350,
            background: "#0b1118",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 50
          }}
        >

          {results.map((product) => {

            const img =
              product.images?.[0]?.url ||
              "/produtos/placeholder.jpg";

            return (

              <Link
                key={product.id}
                href={`/produto/${product.slug}`}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 10,
                  alignItems: "center",
                  textDecoration: "none",
                  color: "#fff"
                }}
              >

                <img
                  src={img}
                  width={40}
                  height={40}
                  style={{
                    borderRadius: 6,
                    objectFit: "cover"
                  }}
                />

                <div>

                  <div style={{ fontSize: 14 }}>
                    {product.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#22c55e",
                      fontWeight: 700
                    }}
                  >
                    R$ {(product.priceCents / 100).toFixed(2)}
                  </div>

                </div>

              </Link>

            );

          })}

        </div>
        

      )}

      

    </div>

    
 
  );

}