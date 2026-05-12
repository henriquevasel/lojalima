"use client";

import s from "@/app/styles/form.module.css";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  qty: number;
  product: {
    name: string;
    priceCents: number;
    sku: string;
    images?: { url: string }[];
  }
};

export default function CarrinhoPage() {

  const [items, setItems] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(0);
  const [coupon,setCoupon] = useState("");
const [discount,setDiscount] = useState(0);
const [couponLoading,setCouponLoading] = useState(false);
const [couponCode,setCouponCode] = useState("");

  const qtyBtnStyle = {
  width:32,
  height:32,
  borderRadius:8,
  border:"1px solid rgba(255,255,255,0.1)",
  background:"#1a222c",
  color:"#fff",
  cursor:"pointer"
};

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

    const savedCoupon =
  sessionStorage.getItem("coupon");

if(savedCoupon){

  const parsed = JSON.parse(savedCoupon);

 
  setCouponCode(parsed.code || "");
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

  async function aplicarCupom(){

  if(!coupon){
    alert("Digite um cupom");
    return;
  }

  try {

    setCouponLoading(true);

    const res = await fetch("/api/coupons", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        code: coupon,
        subtotal: total
      })
    });

  

    const data = await res.json();

    if(!data.valid){
      alert(data.message || "Cupom inválido");
      return;
    }

    setDiscount(data.discount);
    setCouponCode(data.code);

sessionStorage.setItem(
  "coupon",
  JSON.stringify({
    code:data.code
  })
);

    alert("Cupom aplicado!");

  } catch (error){

    console.error(error);
    alert("Erro ao aplicar cupom");

  } finally {

    setCouponLoading(false);

  }
}

  const total = items.reduce(
    (acc,item)=>acc+(item.product.priceCents/100)*item.qty,
    0
  );

const totalFinal = Math.max(
  total + (frete / 100) - discount,
  0
);

  function handleCheckout() {
    if (!items || items.length === 0) {
      alert("Seu carrinho está vazio");
      return;
    }

    window.location.href = "/checkout";
  }

  return (

  <div
  style={{
    maxWidth:1200,
    margin:"60px auto",
    padding:"0 16px",
    display:"grid",
    gridTemplateColumns:
  typeof window !== "undefined" && window.innerWidth < 900
    ? "1fr"
    : "1fr 340px",
    gap:24,
    alignItems:"start"
  }}
>

 <h1 style={{
  color:"#fff",
  marginBottom:30,
  fontSize:28,
  fontWeight:800,
  gridColumn:"1 / -1"
}}>
      Carrinho
    </h1>

    <div>

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

<img
  src={
  item.product.images?.[0]?.url ||
  "/produtos/placeholder.jpg"
}
  alt={item.product.name}
  style={{
  width:100,
  height:100,
  objectFit:"contain",
  borderRadius:10,
  background:"#fff",
  padding:8
  }}
/>

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
  fontSize:13,
  transition:"0.2s"
}}
onMouseEnter={(e)=>(
  e.currentTarget.style.color="#ef4444"
)}
onMouseLeave={(e)=>(
  e.currentTarget.style.color="#888"
)}
          >
            Remover
          </button>

        </div>

      </div>

    ))}

    </div>

    {/* SUBTOTAL */}
<div
  style={{
    display:"flex",
    justifyContent:"space-between",
    marginBottom:10,
    color:"#9ca3af",
    fontSize:14
  }}
>
  <span>Subtotal</span>

  <span>
    R$ {total.toFixed(2)}
  </span>
</div>

{/* FRETE */}
{frete > 0 && (
  <div
    style={{
      display:"flex",
      justifyContent:"space-between",
      marginBottom:10,
      color:"#9ca3af",
      fontSize:14
    }}
  >
    <span>Frete</span>

    <span>
      R$ {(frete / 100).toFixed(2)}
    </span>
  </div>
)}

{/* DESCONTO */}
{discount > 0 && (
  <div
    style={{
      display:"flex",
      justifyContent:"space-between",
      marginBottom:10,
      color:"#22c55e",
      fontSize:14,
      fontWeight:700
    }}
  >
    <span>Desconto</span>

    <span>
      - R$ {discount.toFixed(2)}
    </span>
  </div>
)}

{/* LINHA */}
<div
  style={{
    height:1,
    background:"rgba(255,255,255,0.06)",
    margin:"16px 0"
  }}
/>

{/* TOTAL */}
<div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:16
  }}
>

  <div
    style={{
      color:"#fff",
      fontSize:16,
      fontWeight:700
    }}
  >
    Total
  </div>

  <div
    style={{
      color:"#fff",
      fontSize:28,
      fontWeight:900
    }}
  >
    R$ {totalFinal.toFixed(2)}
  </div>

</div>

{/* PIX */}
<div
  style={{
    marginBottom:18,
    padding:12,
    borderRadius:12,
    background:"rgba(34,197,94,0.08)",
    border:"1px solid rgba(34,197,94,0.18)"
  }}
>

  <div
    style={{
      color:"#22c55e",
      fontSize:12,
      fontWeight:700,
      marginBottom:4
    }}
  >
    NO PIX
  </div>

  <div
    style={{
      color:"#22c55e",
      fontSize:24,
      fontWeight:900,
      lineHeight:1
    }}
  >
    R$ {(totalFinal * 0.95).toFixed(2)}
  </div>

  <div
    style={{
      color:"#888",
      fontSize:11,
      marginTop:4
    }}
  >
    Economia de 5%
  </div>

</div>

{/* CUPOM */}
<div style={{ marginBottom:18 }}>

  <div
    style={{
      display:"flex",
      gap:8
    }}
  >

    <input
      type="text"
      placeholder="Cupom"
      value={coupon}
      onChange={(e)=>
        setCoupon(e.target.value.toUpperCase())
      }
      style={{
        flex:1,
        height:42,
        borderRadius:10,
        border:"1px solid rgba(255,255,255,0.08)",
        background:"#11161d",
        color:"#fff",
        padding:"0 12px",
        fontSize:13
      }}
    />

    <button
      onClick={aplicarCupom}
      disabled={couponLoading}
      style={{
        border:"none",
        padding:"0 16px",
        borderRadius:10,
        background:"#22c55e",
        color:"#022c22",
        fontWeight:700,
        cursor:"pointer"
      }}
    >
      {couponLoading
        ? "..."
        : "Aplicar"}
    </button>

  </div>

  {discount > 0 && (
    <div
      style={{
        marginTop:8,
        color:"#22c55e",
        fontSize:12,
        fontWeight:700
      }}
    >
      Cupom aplicado
    </div>
  )}

</div>

  </div>

);


}