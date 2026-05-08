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
      {/* RESULTADOS */}
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

      {/* HOME */}
      {!isResults && (
        <>

          <div className="homeSection alt">
            <WhatsAppSection />
          </div>

          {/* CFTV */}
          <div className="homeSection">
            <ProductsCarousel
              title="Câmeras e Gravadores"
              endpoint="/api/products/store?category=cftv&limit=10"
            />
          </div>

          {/* FECHADURAS */}
          <div className="homeSection">
            <ProductsCarousel
              title="Fechaduras Inteligentes"
              endpoint="/api/products/store?category=fechaduras&limit=10"
            />
          </div>

          
          <div className="homeSection alt">
            <WhatsAppSection />
          </div>

          {/* CONTROLE ACESSO */}
          <div className="homeSection">
            <ProductsCarousel
              title="Controle de Acesso"
              endpoint="/api/products/store?category=controle-acesso&limit=10"
            />
          </div>

          {/* AUTOMATIZADORES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Automatizadores"
              endpoint="/api/products/store?category=automatizadores&limit=10"
            />
          </div>

          {/* REDES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Redes e Wi-Fi"
              endpoint="/api/products/store?category=redes&limit=10"
            />
          </div>

          {/* ALARMES */}
          <div className="homeSection">
            <ProductsCarousel
              title="Alarmes"
              endpoint="/api/products/store?category=alarmes&limit=10"
            />
          </div>

          <div className="homeSection highlight">
            <WhatsappCTA />
          </div>

        </>
      )}
    </>
  );
}