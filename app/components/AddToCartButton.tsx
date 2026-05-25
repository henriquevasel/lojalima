"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  productId: number;
  variantId?: number;
};

export default function AddToCartButton({
  productId,
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
        padding: "12px 14px",
        borderRadius: 12,
        color: "black",
        fontWeight: 1000,
        cursor: "pointer",
        border: "2px solid black",
        backgroundColor: "lightblue",
        transition: "all 0.3s ease",
      }}
    >
      Adicionar ao carrinho
    </button>
  );
}