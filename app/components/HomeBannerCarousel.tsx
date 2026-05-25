"use client";

import { useEffect, useState } from "react";
import s from "@/app/styles/home.module.css";

const banners = [
  
  "/produtos/banner-2.avif",
  "/produtos/banner-3.avif",
  "/produtos/banner-4.avif",
];

export default function HomeBannerCarousel() {
  const [index, setIndex] = useState(0);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className={s.bannerTop}>
      {banners.map((img, i) => (
        <div
          key={i}
          className={`${s.slide} ${i === index ? s.active : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* setas */}
      <button className={s.prev} onClick={prev}>‹</button>
      <button className={s.next} onClick={next}>›</button>

      {/* dots */}
      <div className={s.dots}>
        {banners.map((_, i) => (
          <span
            key={i}
            className={i === index ? s.dotActive : s.dot}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}