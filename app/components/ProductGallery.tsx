"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: any) {

  const first = images?.[0]?.url || "/produtos/placeholder.jpg";
  const [selected, setSelected] = useState(first);

  return (

    <div>

      {/* IMAGEM PRINCIPAL */}

    <div
  style={{
    width: "100%",
    height: 420,
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    background: "#fff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <Image
    src={selected}
    alt={name}
    fill
    style={{
      objectFit: "contain",
      padding: "30px"
    }}
  />
</div>


      {/* MINIATURAS */}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}
      >

        {images?.map((img: any) => (

          <div
            key={img.url}
            onClick={() => setSelected(img.url)}
            style={{
              width: 70,
              height: 70,
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              border: selected === img.url
                ? "2px solid #22c55e"
                : "1px solid rgba(0,0,0,0.1)"
            }}
          >

            <Image
              src={img.url}
              alt={name}
              fill
              style={{
                objectFit: "contain" // 🔥 padrão correto
              }}
            />

          </div>

        ))}

      </div>

    </div>

  );

}