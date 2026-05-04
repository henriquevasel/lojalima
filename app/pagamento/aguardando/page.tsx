"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AguardandoPagamento() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "paid" | "pending">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 pega orderId
  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) setOrderId(id);
  }, [searchParams]);

  // 🔹 contador
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔹 verifica pagamento
  useEffect(() => {
    if (!orderId) return;

    async function checkStatus() {
      try {
        const res = await fetch(`/api/order-status?orderId=${orderId}`);
        const data = await res.json();

        // 🔥 aceita os dois (resolve teu bug)
        if (data.status === "paid" || data.status === "approved") {
          setStatus("paid");

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setStatus("pending");
        }

      } catch (err) {
        console.log("erro ao verificar pagamento");
        setStatus("pending");
      }
    }

    checkStatus();
    intervalRef.current = setInterval(checkStatus, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId]);

  // 🔹 redirect automático
  useEffect(() => {
    if (status === "paid") {
      setTimeout(() => {
        router.push("/meus-pedidos");
      }, 2500);
    }
  }, [status, router]);

  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#fff",
      textAlign: "center"
    }}>

      {status === "loading" && (
        <p>🔄 Verificando pagamento...</p>
      )}

      {status === "pending" && (
        <>
          <h2>⏳ Aguardando pagamento...</h2>
          <p>Pague o PIX na outra aba. Esta tela atualizará automaticamente.</p>

          <br />

          <p>⏳ Confirmação geralmente leva até 10 segundos</p>
          <p>⏱️ Tempo aguardando: {seconds}s</p>

          {seconds > 10 && (
            <p style={{ color: "#ffaa00" }}>
              Isso está demorando mais que o normal...
            </p>
          )}

          <br />

          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#00aa55",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Já paguei, atualizar
          </button>
        </>
      )}

      {status === "paid" && (
        <>
          <h2>✅ Pedido confirmado!</h2>
          <p>Pagamento recebido 🎉</p>
          <p>Redirecionando...</p>
        </>
      )}

    </div>
  );
}