"use client";

import ProductsCarousel from "./ProductsCarousel";
import WhatsAppSection from "./WhatsAppSection";
import InstallationServices from "./InstallationServices";
import WhatsappCTA from "./WhatsappCTA";

export default function HomeSections() {
  return (
    <>

     <div className="homeSection">
  <ProductsCarousel
    title="Lançamentos"
    endpoint="/api/products/new"
  />
</div>

{/* MAIS VENDIDOS */}
<div className="homeSection">
  <ProductsCarousel
    title="Mais vendidos"
    endpoint="/api/products/bestsellers"
  />
</div>

{/* MELHORES PREÇOS */}
<div className="homeSection">
  <ProductsCarousel
    title="Melhores preços"
    endpoint="/api/products?sort=price_asc&limit=10"
  />
</div>

      {/* 📲 BLOCO WHATS */}
      <div className="homeSection alt">
        <WhatsAppSection />
      </div>

    {/* PRODUTOS PREMIUM */}
<div className="homeSection">
  <ProductsCarousel
    title="Produtos premium"
    endpoint="/api/products?sort=price_desc&limit=10"
  />
</div>

      {/* 🔧 SERVIÇOS */}
      <div className="homeSection alt">
        
      </div>

      {/* CTA FINAL */}
      <div className="homeSection highlight">
        <WhatsappCTA />
      </div>

    </>
  );
}