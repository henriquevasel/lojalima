"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  productId: number;
  productName: string;
  productPrice: number;
  variantId?: number;
};

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
  variantId,
}: Props) {

  const router = useRouter();

  async function handleAdd() {

    const retirada =
      sessionStorage.getItem("retiradaLoja") === "true";

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

      // 🔴 NÃO LOGADO
      if (res.status === 401) {

        localStorage.setItem(
          "pendingCart",
          JSON.stringify({
            productId,
            variantId,
            qty: 1
          })
        );

        toast("Faça login para continuar");

        router.push(
          `/login?redirect=${window.location.pathname}`
        );

        return;
      }

      // 🔴 ERRO
      if (!res.ok) {

        toast.error(
          data.error ||
          "Erro ao adicionar ao carrinho"
        );

        return;
      }

      // 🟢 SUCESSO
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // Google Analytics
      sendGAEvent("event", "add_to_cart", {
        currency: "BRL",
        value: productPrice,
        items: [
          {
            item_id: String(productId),
            item_name: productName,
            price: productPrice,
            quantity: 1,
          },
        ],
      });

      // Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "AddToCart", {
          content_ids: [productId],
          content_name: productName,
          value: productPrice,
          currency: "BRL",
        });
      }

      toast.success("Adicionado ao carrinho!");

    } catch (error) {

      console.error(error);

      toast.error("Erro inesperado");

    }
  }

 return (
 <button
  type="button"
  onClick={handleAdd}
  style={{
    width: "100%",
    height: "56px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: ".2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#15803d";
    e.currentTarget.style.transform = "translateY(-2px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#16a34a";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  🛒 ADICIONAR AO CARRINHO
</button>
);
}