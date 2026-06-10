"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  productId: number;
  variantId?: number;
};

export default function BuyNowButton({
  productId,
  variantId,
}: Props) {

  const router = useRouter();

  async function handleBuyNow() {

    try {

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          variantId,
          qty: 1,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {

        localStorage.setItem(
          "pendingCart",
          JSON.stringify({
            productId,
            variantId,
            qty: 1,
          })
        );

        router.push(
          `/login?redirect=${window.location.pathname}`
        );

        return;
      }

      if (!res.ok) {

        toast.error(
          data.error || "Erro ao comprar"
        );

        return;
      }

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      router.push("/carrinho");

    } catch {

      toast.error("Erro inesperado");

    }
  }

  return (
    <button
      onClick={handleBuyNow}
      style={{
        width: "100%",
        height: "56px",
        background: "#fff",
        color: "#16a34a",
        border: "2px solid #16a34a",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 700,
        cursor: "pointer",
        marginTop: "12px",
      }}
    >
      COMPRAR AGORA
    </button>
  );
}