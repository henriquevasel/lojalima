"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CouponBox() {

  const [coupon,setCoupon] = useState("");
  const [loading,setLoading] = useState(false);
  const [discount,setDiscount] = useState(0);

  async function aplicarCupom(){

    if(!coupon){
      toast.error("Digite um cupom");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("/api/coupons", {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          code: coupon,
          subtotal: 500
        })
      });

      const data = await res.json();

      if(!data.valid){
        toast.error(data.message || "Cupom inválido");
        setDiscount(0);
        return;
      }

      setDiscount(data.discount);

      toast.success("Cupom aplicado!");

    } catch (error){

      console.error(error);
      toast.error("Erro ao aplicar cupom");

    } finally {

      setLoading(false);

    }
  }

  return (

    <div
      style={{
        marginTop: 20,
        marginBottom: 20,
        padding: 18,
        borderRadius: 14,
        border: "1px solid #ddd",
        background: "#fff",
      }}
    >

      <h3
        style={{
          marginBottom: 12,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Cupom de desconto
      </h3>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >

        <input
          type="text"
          placeholder="Digite seu cupom"
          value={coupon}
          onChange={(e)=>
            setCoupon(e.target.value.toUpperCase())
          }
          style={{
            flex: 1,
            height: 42,
            borderRadius: 10,
            border: "2px solid #111",
            padding: "0 12px",
            fontSize: 14,
          }}
        />

        <button
          onClick={aplicarCupom}
          disabled={loading}
          style={{
            background: "#22c55e",
            border: "none",
            color: "#fff",
            padding: "0 18px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading
            ? "..."
            : "Aplicar"}
        </button>

      </div>

      {discount > 0 && (
        <div
          style={{
            marginTop: 12,
            color: "#16a34a",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Cupom aplicado! desconto de R$ {discount.toFixed(2)}
        </div>
      )}

    </div>
  );
}