"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: any) {
  const first = images?.[0]?.url || "/produtos/placeholder.jpg";
  const [selected, setSelected] = useState(first);

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      {/* MINIATURAS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flexShrink: 0,
        }}
      >
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
<div
  style={{
    flex: 1,
    height: 650,
    borderRadius: 24,
    overflow: "hidden",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Image
    src={selected}
    alt={name}
    width={900}
    height={900}
    priority
    style={{
      objectFit: "contain",
      width: "85%",
      height: "85%",
    }}
  />
</div>
    </div>
  );
}