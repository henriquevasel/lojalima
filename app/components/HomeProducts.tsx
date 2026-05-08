"use client";

import { useSearchParams } from "next/navigation";
import ProductGrid from "@/app/components/ProductGrid";
import ProductsCarousel from "@/app/components/ProductsCarousel";
import StoreToolbar from "@/app/components/StoreToolbar";
import WhatsAppSection from "@/app/components/WhatsAppSection";
import WhatsappCTA from "@/app/components/WhatsappCTA";

export default function HomeProducts() {

  const params = useSearchParams();
  const query = params.toString();

  const search = params.get("q");
  const category = params.get("category");

  const isResults = search || category;

  return (
    <>
      {/* 🔍 RESULTADOS */}
      {isResults && (
        <>
          <StoreToolbar />

          <ProductGrid
            title={
              search
                ? `Resultados para: ${search}`
                : `Categoria: ${category}`
            }
            endpoint={`/api/products?${query}`}
            itemsPerRow={4}
            insertEvery={2}
            insertComponent={<WhatsAppSection />}
          />
        </>
      )}

      {/* 🏠 HOME */}
      {!isResults && (
        <>
          {/* HERO */}
          <div className="homeSection alt">
            <WhatsAppSection />
          </div>

          {/* CÂMERAS */}
          <div className="homeSection">
            <ProductsCarousel
              title="Câmeras e Gravadores"
              endpoint="/api/products/store?category=cftv-cameras&limit=30"
            />
          </div>

          {/* FECHADURAS */}
          <div className="homeSection">
            <ProductsCarousel
              title="Fechaduras Inteligentes"
              endpoint="/api/products/store?category=fechaduras-digitais&limit=30"
            />
          </div>

          {/* CONTROLE DE ACESSO */}
          <div className="homeSection">
            <ProductsCarousel
              title="Controle de Acesso"
              endpoint="/api/products/store?category=controle-de-acesso&limit=30"
            />
          </div>

          {/* AUTOMATIZADORES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Automatizadores"
              endpoint="/api/products/store?category=automatizadores&limit=30"
            />
          </div>

          {/* REDES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Redes e Wi-Fi"
              endpoint="/api/products/store?category=redes&limit=30"
            />
          </div>

          {/* ALARMES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Alarmes e Sensores"
              endpoint="/api/products/store?category=alarmes&limit=30"
            />
          </div>

          {/* CTA FINAL */}
          <div className="homeSection highlight">
            <WhatsappCTA />
          </div>
        </>
      )}
    </>
  );
}