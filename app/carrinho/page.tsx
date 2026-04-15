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

  return(

    <div style={{maxWidth:1100,margin:"60px auto"}}>

      <h1 style={{color:"#fff"}}>Carrinho</h1>

      {items.map((item)=>(

        <div
          key={item.id}
          style={{
            display:"flex",
            gap:20,
            background:"#111",
            padding:20,
            marginTop:20,
            borderRadius:10
          }}
        >

          <img
            src={item.product.images?.[0]?.url}
            alt={item.product.name}
            style={{width:120}}
          />

          <div style={{flex:1}}>

            <h3 style={{color:"#fff"}}>
              {item.product.name}
            </h3>

            <p style={{color:"#aaa"}}>
              R$ {(item.product.priceCents/100).toFixed(2)}
            </p>

            <button
              className={s.qtyBtn}
              onClick={()=>updateQty(item.id,item.qty-1)}
            >
              -
            </button>

            <span style={{color:"#fff",margin:"0 10px"}}>
              {item.qty}
            </span>

            <button
              className={s.qtyBtn}
              onClick={()=>updateQty(item.id,item.qty+1)}
            >
              +
            </button>

          </div>

          <div>

            <div style={{color:"#fff"}}>
              R$ {((item.product.priceCents/100)*item.qty).toFixed(2)}
            </div>

            <button
              className={s.removeBtn}
              onClick={()=>removeItem(item.id)}
            >
              Remover
            </button>

          </div>

        </div>

      ))}

      <div
        style={{
          marginTop:40,
          background:"#022",
          padding:30,
          borderRadius:12
        }}
      >

        <h2 style={{color:"#fff"}}>
          Total: R$ {totalFinal.toFixed(2)}
        </h2>

        {/* FRETE */}
        {frete > 0 && (
          <p style={{color:"#aaa", marginTop:10}}>
            Frete: R$ {(frete / 100).toFixed(2)}
          </p>
        )}

        {items.length === 0 && (
          <p style={{ color: "#aaa", marginTop: 20 }}>
            Seu carrinho está vazio
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          style={{
            marginTop:20,
            background: items.length === 0 ? "#555" : "#00aa55",
            color:"#fff",
            border:"none",
            padding:15,
            fontSize:18,
            borderRadius:10,
            cursor: items.length === 0 ? "not-allowed" : "pointer"
          }}
        >
          Finalizar compra
        </button>

      </div>

    </div>

  );

}