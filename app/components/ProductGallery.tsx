"use client";

import { useState } from "react";
import Image from "next/image";
import s from "@/app/styles/product.module.css";

export default function ProductGallery({ images, name }: any) {
  const first = images?.[0]?.url || "/produtos/placeholder.jpg";
  const [selected, setSelected] = useState(first);

  return (
    <div className={s.galleryWrapper}>
      {/* MINIATURAS */}
      <div className={s.galleryThumbs}>
        {images?.map((img: any) => (
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
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}