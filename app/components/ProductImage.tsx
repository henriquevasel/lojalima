"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  fallback?: string;
  style?: React.CSSProperties;
};

export default function ProductImage({
  src,
  alt,
  fallback = "/produtos/placeholder.jpg",
  style,
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(fallback)}
      style={style}
    />
  );
}
