"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  id: number;
  name: string;
  price: number;
};

export default function ProductAnalytics({
  id,
  name,
  price,
}: Props) {

  useEffect(() => {

    sendGAEvent("event", "view_item", {
      currency: "BRL",
      value: price,
      items: [
        {
          item_id: String(id),
          item_name: name,
          price,
        },
      ],
    });

  }, [id, name, price]);

  return null;
}