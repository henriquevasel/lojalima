"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RetornoPagamento() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "paid" | "pending">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  useEffect(() => {

    if (!orderId) return;

    let interval: ReturnType<typeof setInterval>;

    async function checkStatus() {
      try {

        const res = await fetch(`/api/orders/${orderId}`, {
          credentials: "include"
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const order = await res.json();

        if (order.status === "paid") {
          setStatus("paid");
          clearInterval(interval);
        } else {
          setStatus("pending");
        }

      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        setStatus("pending");
      }
    }

    checkStatus();
    interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);

  }, [orderId, router]);

  useEffect(() => {
    if (status === "paid") {
      setTimeout(() => {
        router.push("/meus-pedidos");
      }, 2500);
    }
  }, [status, router]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>

      {status === "loading" && (
        <p>🔄 Verificando pagamento...</p>
      )}

      {status === "pending" && (
        <>
          <h2>⏳ Aguardando pagamento...</h2>
          <p>Confirmando com o banco...</p>
        </>
      )}

      {status === "paid" && (
        <>
          <h2>✅ Pedido realizado com sucesso!</h2>
          <p>Redirecionando...</p>
        </>
      )}

    </div>
  );
}