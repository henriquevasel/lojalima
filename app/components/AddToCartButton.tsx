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

    // 🔥 RETIRADA?
    const retirada =
      sessionStorage.getItem("retiradaLoja") === "true";

    // 🔥 PEGA FRETE
    const freteSalvo =
      sessionStorage.getItem("freteCents") ||
      localStorage.getItem("frete");

    // 🔴 SEM FRETE
    if (!freteSalvo) {

      toast.error(
        retirada
          ? "Selecione retirada na loja"
          : "Calcule o frete antes de adicionar"
      );

      document
        .querySelector("#frete")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;
    }

    // 🔥 PEGA NÚMERO
    const numero =
      localStorage.getItem("numero");

    // 🔴 VALIDA NÚMERO SÓ EM ENTREGA
    if (
      !retirada &&
      (!numero || numero.trim() === "")
    ) {

      toast.error("Informe o número da casa");

      document
        .querySelector("#numero-casa")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;
    }

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

      toast.success(
        retirada
          ? "Produto reservado para retirada!"
          : "Adicionado ao carrinho!"
      );

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