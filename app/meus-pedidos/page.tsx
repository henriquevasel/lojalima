"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/styles/meus-pedidos.module.css";

export default function MeusPedidos() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/orders", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/login?redirect=/meus-pedidos");
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>Meus Pedidos</h1>

        {loading && (
          <div className={s.card}>Carregando pedidos...</div>
        )}

        {!loading && orders.length === 0 && (
          <div className={s.card}>
            <p>Você ainda não fez nenhum pedido.</p>
            <button
              onClick={() => router.push("/")}
              className={s.button}
            >
              Começar a comprar
            </button>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className={s.card}>
            
            {/* HEADER */}
            <div className={s.header}>
              <div>
                <h2>Pedido #{order.id.slice(0, 8)}</h2>
                <span className={s.date}>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <button
                onClick={() => router.push(`/meus-pedidos/${order.id}`)}
                className={s.detailsBtn}
              >
                Ver detalhes
              </button>
            </div>

            {/* INFO */}
            <div className={s.info}>
              <span className={`${s.status} ${s[order.status]}`}>
                {order.status === "pending"
                  ? "Pendente"
                  : order.status === "paid"
                  ? "Pago"
                  : order.status === "shipped"
                  ? "Enviado"
                  : order.status === "completed"
                  ? "Entregue"
                  : order.status}
              </span>

              <span>
                {order.orderitem?.length || 0} itens
              </span>

            <div style={{ textAlign: "right" }}>
  {order.shippingCents > 0 && (
    <div style={{ fontSize: 12, opacity: 0.7 }}>
      Frete: {(order.shippingCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </div>
  )}

  <div style={{ fontWeight: 700 }}>
    {(order.totalCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </div>
</div>
            </div>


            <div style={{
  marginTop: 12,
  padding: 12,
  borderRadius: 10,
  background: "#f9fafb",
  border: "1px solid #eee",
  fontSize: 13,
  color: "#111"
}}>
 <strong>📍 Entrega</strong><br />
{order.street || "-"}, {order.number || "-"}<br />
{order.neighborhood || "-"}<br />
{order.city || "-"} - {order.state || "-"}<br />
CEP: {order.cep || "-"}
</div>

            {/* TIMELINE */}
            <div className={s.timeline}>
              <div className={`${s.step} ${s.active}`}>Pedido</div>

              <div
                className={`${s.step} ${
                  order.status !== "pending" ? s.active : ""
                }`}
              >
                Pago
              </div>

              <div
                className={`${s.step} ${
                  order.status === "shipped" ||
                  order.status === "completed"
                    ? s.active
                    : ""
                }`}
              >
                Enviado
              </div>

              <div
                className={`${s.step} ${
                  order.status === "completed" ? s.active : ""
                }`}
              >
                Entregue
              </div>
            </div>

            {/* ITENS */}
            <div className={s.items}>
              {(order.orderitem || []).map((item: any) => (
                <div key={item.id} className={s.item}>
                  <div className={s.product}>
                    <b>{item.name}</b>
                    <span>Qtd: {item.qty}</span>
                  </div>

                  <div className={s.price}>
                    {(item.priceCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}