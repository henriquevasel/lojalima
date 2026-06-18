"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import s from "@/app/styles/product.module.css";

export default function ProductGallery({
  images,
  name,
  sku,
}: any) {
 const extras = sku
  ? Array.from({ length: 10 }, (_, i) => ({
      url: `/produtos/${sku}-${i + 1}.jpg`,
    }))
  : [];

const [allImages, setAllImages] = useState(images || []);

useEffect(() => {
  async function loadImages() {
    const validExtras = [];

    for (const img of extras) {
      try {
        const res = await fetch(img.url, {
          method: "HEAD",
        });

        if (res.ok) {
          validExtras.push(img);
        }
      } catch {}
    }

    setAllImages([
      ...(images || []),
      ...validExtras,
    ]);
  }

  loadImages();
}, [sku, images]);

const [selected, setSelected] = useState(
  images?.[0]?.url ||
  "/produtos/placeholder.jpg"
);

useEffect(() => {
  if (allImages.length > 0) {
    setSelected(allImages[0].url);
  }
}, [allImages]);

  return (
    <div className={s.galleryWrapper}>
      {/* MINIATURAS */}
      <div className={s.galleryThumbs}>
       {allImages?.map((img: any) => (
          <div
            key={img.url}
            onClick={() => setSelected(img.url)}
            style={{
              width: 80,
              height: 80,
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              border:
                selected === img.url
                  ? "2px solid #22c55e"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src={img.url}
              alt={name}
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>

      {/* IMAGEM PRINCIPAL */}
     <div className={s.mainImage}>
 <Image
  src={selected}
  alt={name}
  width={1200}
  height={1200}
  priority
  style={{
    width: "350px",
    height: "auto",
  }}
/>
</div>
    </div>
  );
}