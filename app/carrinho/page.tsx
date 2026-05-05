"use client";

import s from "@/app/styles/form.module.css";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  qty: number;
  product: {
    name: string;
    priceCents: number;
    images?: { url: string }[];
  };
};

export default function CarrinhoPage() {

  const [items, setItems] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(0);

  async function fetchCart() {

  const res = await fetch("/api/cart", {
    credentials: "include"
  });

  if (res.status === 401) {
    setItems([]);
    return;
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    setItems(data);
  } else {
    setItems([]);
  }
}

  // 🔥 pega frete do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("frete");
    if (saved) {
      setFrete(Number(saved));
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  async function removeItem(id:number){
    await fetch(`/api/cart/item/${id}`,{
      method:"DELETE",
      credentials:"include"
    });

    window.dispatchEvent(new Event("cartUpdated"));
    fetchCart();
  }

  async function updateQty(id:number, qty:number){

    if(qty <= 0){
      removeItem(id);
      return;
    }

    await fetch(`/api/cart/item/${id}`,{
      method:"PUT",
      credentials:"include",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({qty})
    });

    window.dispatchEvent(new Event("cartUpdated"));
    fetchCart();
  }

  const total = items.reduce(
    (acc,item)=>acc+(item.product.priceCents/100)*item.qty,
    0
  );

  const totalFinal = total + (frete / 100);

  function handleCheckout() {
    if (!items || items.length === 0) {
      alert("Seu carrinho está vazio");
      return;
    }

    window.location.href = "/checkout";
  }

  return (

  <div style={{maxWidth:1100,margin:"60px auto",padding:"0 16px"}}>

    <h1 style={{
      color:"#fff",
      marginBottom:30,
      fontSize:28,
      fontWeight:800
    }}>
      Carrinho
    </h1>

    {items.map((item)=>(

      <div
        key={item.id}
        style={{
          display:"flex",
          gap:20,
          background:"#11161d",
          padding:16,
          marginBottom:16,
          borderRadius:14,
          border:"1px solid rgba(255,255,255,0.05)",
          transition:"0.2s"
        }}
      >

       {item.product.images?.[0] && (
  <img
    src={item.product.images[0].url}
    alt={item.product.name}
    style={{
      width:100,
      height:100,
      objectFit:"cover",
      borderRadius:10
    }}
  />
)}

        {/* INFO */}
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>

          <div>
            <h3 style={{
              color:"#fff",
              margin:0,
              fontSize:16,
              fontWeight:700
            }}>
              {item.product.name}
            </h3>

            <p style={{
              color:"#9ca3af",
              fontSize:13,
              marginTop:6
            }}>
              R$ {(item.product.priceCents/100).toFixed(2)} / unidade
            </p>
          </div>

          {/* QTD */}
          <div style={{
            display:"flex",
            alignItems:"center",
            gap:10,
            marginTop:10
          }}>

            <button
              onClick={()=>updateQty(item.id,item.qty-1)}
              style={qtyBtnStyle}
            >
              -
            </button>

            <span style={{color:"#fff",fontWeight:700}}>
              {item.qty}
            </span>

            <button
              onClick={()=>updateQty(item.id,item.qty+1)}
              style={qtyBtnStyle}
            >
              +
            </button>

          </div>

        </div>

        {/* PREÇO + REMOVE */}
        <div style={{
          display:"flex",
          flexDirection:"column",
          justifyContent:"space-between",
          alignItems:"flex-end"
        }}>

          <div style={{
            color:"#39ff14",
            fontWeight:800,
            fontSize:16
          }}>
            R$ {((item.product.priceCents/100)*item.qty).toFixed(2)}
          </div>

          <button
            onClick={()=>removeItem(item.id)}
            style={{
              background:"transparent",
              border:"none",
              color:"#888",
              cursor:"pointer",
              fontSize:13
            }}
          >
            Remover
          </button>

        </div>

      </div>

    ))}

    {/* RESUMO */}
    <div
      style={{
        marginTop:30,
        background:"#0f141a",
        padding:24,
        borderRadius:16,
        border:"1px solid rgba(255,255,255,0.05)"
      }}
    >

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        marginBottom:10,
        color:"#aaa"
      }}>
        <span>Subtotal</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      {frete > 0 && (
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginBottom:10,
          color:"#aaa"
        }}>
          <span>Frete</span>
          <span>R$ {(frete / 100).toFixed(2)}</span>
        </div>
      )}

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        fontSize:20,
        fontWeight:800,
        color:"#fff",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        paddingTop:14,
        marginTop:10
      }}>
        <span>Total</span>
        <span>R$ {totalFinal.toFixed(2)}</span>
      </div>

      {items.length === 0 && (
        <p style={{ color: "#888", marginTop: 20 }}>
          Seu carrinho está vazio
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        style={{
          marginTop:20,
          width:"100%",
          height:50,
          borderRadius:12,
          border:"none",
          fontWeight:700,
          fontSize:16,
          background: items.length === 0 ? "#333" : "#22c55e",
          color:"#022c22",
          cursor: items.length === 0 ? "not-allowed" : "pointer",
          transition:"0.2s"
        }}
      >
        Finalizar compra
      </button>

    </div>

  </div>

);

const qtyBtnStyle = {
  width:32,
  height:32,
  borderRadius:8,
  border:"1px solid rgba(255,255,255,0.1)",
  background:"#1a222c",
  color:"#fff",
  cursor:"pointer"
};
}