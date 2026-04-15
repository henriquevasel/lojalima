"use client";

import { useSearchParams } from "next/navigation";
import ProductGrid from "@/app/components/ProductGrid";
import ProductsCarousel from "@/app/components/ProductsCarousel";
import StoreToolbar from "@/app/components/StoreToolbar";
import WhatsAppSection from "@/app/components/WhatsAppSection";
import InstallationServices from "@/app/components/InstallationServices";
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

      {/* 🏠 MODO NORMAL */}
      {!isResults && (
        <>
          <div className="homeSection">
            <ProductsCarousel
              title="⭐ Produtos em destaque"
              endpoint="/api/products/featured"
            />
          </div>

          <div className="homeSection">
            <ProductsCarousel
              title="🔥 Lançamentos"
              endpoint="/api/products/new"
            />
          </div>

          <div className="homeSection alt">
            <WhatsAppSection />
          </div>

          <div className="homeSection">
            <ProductsCarousel
              title="Mais vendidos"
              endpoint="/api/products/bestsellers"
            />
          </div>

          <div className="homeSection alt">
            <InstallationServices />
          </div>

          <div className="homeSection highlight">
            <WhatsappCTA />
          </div>
        </>
      )}
    </>
  );
}