"use client";

import ProductsCarousel from "./ProductsCarousel";
import WhatsAppSection from "./WhatsAppSection";
import InstallationServices from "./InstallationServices";
import WhatsappCTA from "./WhatsappCTA";

export default function HomeSections() {
  return (
    <>

      {/* 🆕 LANÇAMENTOS */}
      <div className="homeSection">
        <ProductsCarousel
          title="🆕 Lançamentos"
          endpoint="/api/products/new"
        />
      </div>

      {/* 🔥 MAIS VENDIDOS */}
      <div className="homeSection">
        <ProductsCarousel
          title="🔥 Mais vendidos"
          endpoint="/api/products/bestsellers"
        />
      </div>

      {/* 💰 MAIS BARATOS */}
      <div className="homeSection">
        <ProductsCarousel
          title="💰 Mais baratos"
          endpoint="/api/products?sort=price_asc&limit=10"
        />
      </div>

      {/* 📲 BLOCO WHATS */}
      <div className="homeSection alt">
        <WhatsAppSection />
      </div>

      {/* 💎 MAIS CAROS */}
      <div className="homeSection">
        <ProductsCarousel
          title="💎 Produtos premium"
          endpoint="/api/products?sort=price_desc&limit=10"
        />
      </div>

      {/* 🔧 SERVIÇOS */}
      <div className="homeSection alt">
        <InstallationServices />
      </div>

      {/* CTA FINAL */}
      <div className="homeSection highlight">
        <WhatsappCTA />
      </div>

    </>
  );
}