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
          marginBottom: 12
        }}
      >
        <Image
          src={selected}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
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
            key={img.id}
            onClick={() => setSelected(img.url)}
            style={{
              width: 70,
              height: 70,
              position: "relative",
              borderRadius: 10,
              overflow: "hidden",
              cursor: "pointer",
              border: selected === img.url
                ? "2px solid #22c55e"
                : "1px solid rgba(255,255,255,0.1)"
            }}
          >

            <Image
              src={img.url}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
            />

          </div>

        ))}

      </div>

    </div>

  );

}