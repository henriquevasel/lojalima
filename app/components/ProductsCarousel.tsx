"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductsCarousel({ title, endpoint }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    console.log("📡 chamando endpoint:", endpoint);

    setLoading(true);

    try {
      const url = window.location.origin + endpoint;

      console.log("🌍 URL FINAL:", url);

      const res = await fetch(url);

      console.log("📥 STATUS:", res.status);

      if (!res.ok) throw new Error("Erro na API");

      const data = await res.json();

      console.log("🔥 PRODUTOS RECEBIDOS:", data);

      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.log("❌ Erro carregando produtos", err);
      setProducts([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    console.log("🚀 useEffect rodou");
    load();
  }, [endpoint]);

  const safeProducts = Array.isArray(products)
    ? products.filter((p) => {
        const image = p?.productimage?.[0]?.url;

        return (
          image &&
          image !== "" &&
          image !== "null"
        );
      })
    : [];

  const skeletons = Array.from({ length: 4 });

  return (
    <section className="section">
      <div className="container">

        <div className="section-header">
          <h2>{title}</h2>
          <p>Equipamentos profissionais de segurança eletrônica</p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="products-grid">
            {skeletons.map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {/* CARROSSEL */}
        {!loading && safeProducts.length > 0 && (
          <div className="carouselWrapper">

            <Swiper
              className="mySwiper"
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={2}
              // 🔥 quantos cards anda
              slidesPerGroup={3}
              spaceBetween={16}
              speed={600}
              grabCursor={true}
              navigation
              pagination={{ clickable: true }}

              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}

              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 12,
                },

                640: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },

                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },

                1400: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },

                1600: {
                  slidesPerView: 6,
                  spaceBetween: 24,
                },
              }}

              onSwiper={(swiper) => {
                setTimeout(() => {
                  swiper.update();
                }, 100);
              }}
            >

              {safeProducts.map((p) => (
                <SwiperSlide key={p.id}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}

            </Swiper>

          </div>
        )}

        {/* SEM PRODUTOS */}
        {!loading && safeProducts.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            Nenhum produto encontrado
          </p>
        )}

      </div>
    </section>
  );
}