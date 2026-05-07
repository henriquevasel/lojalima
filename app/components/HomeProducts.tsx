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
      {/* 🔍 MODO BUSCA */}
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

          {/* CÂMERAS */}
          <div className="homeSection">
            <ProductsCarousel
              title="📹 Câmeras e Gravadores"
              endpoint="/api/products?category=cftv"
            />
          </div>

          {/* FECHADURAS */}
          <div className="homeSection">
            <ProductsCarousel
              title="🔐 Fechaduras Inteligentes"
              endpoint="/api/products?category=fechaduras"
            />
          </div>

          {/* CTA */}
          <div className="homeSection alt">
            <WhatsAppSection />
          </div>

          {/* SMART HOME */}
          <div className="homeSection">
            <ProductsCarousel
              title="🏠 Smart Home"
              endpoint="/api/products?category=smart-home"
            />
          </div>

          {/* AUTOMATIZADORES */}
          <div className="homeSection">
            <ProductsCarousel
              title="🚪 Automatizadores"
              endpoint="/api/products?category=automatizadores"
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