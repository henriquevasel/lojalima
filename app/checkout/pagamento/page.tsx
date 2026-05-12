"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function PagamentoPage(){

const router = useRouter();

const [customer,setCustomer]=useState<any>(null);

const [loading,setLoading]=useState(false);

const [payment,setPayment]=useState("pix");

const [coupon,setCoupon] = useState("");

const [discount,setDiscount] = useState(0);

const [couponLoading,setCouponLoading] = useState(false);


useEffect(()=>{

async function init(){

  // 🔒 valida carrinho
  const res = await fetch("/api/cart", {
    credentials: "include"
  });

  const data = await res.json();

  if(!Array.isArray(data) || data.length === 0){
    alert("Seu carrinho está vazio");
    router.push("/carrinho");
    return;
  }

  // 📦 pega dados do cliente
  const raw = sessionStorage.getItem("checkout_customer");

  if(raw){
    setCustomer(JSON.parse(raw));
  } else {
    router.push("/checkout");
  }

}

init();

},[]);

async function aplicarCupom(){

  if(!coupon){
    toast.error("Digite um cupom");
    return;
  }

  try {

    setCouponLoading(true);

    const subtotal = 500;

    const res = await fetch("/api/coupons", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        code: coupon,
        subtotal
      })
    });

    const data = await res.json();

    if(!data.valid){
      toast.error(data.message || "Cupom inválido");
      setDiscount(0);
      return;
    }

    setDiscount(data.discount);

    toast.success("Cupom aplicado");

  } catch (error){

    console.error(error);
    toast.error("Erro ao aplicar cupom");

  } finally {

    setCouponLoading(false);

  }
}
async function finalizar(){

  if(!customer){
    toast.error("Dados não encontrados");
    return;
  }

   if (customer.freteCents == null) {
    toast.error("Frete não calculado");
    return;
  }

  if (!customer.endereco) {
  toast.error("Endereço não informado");
  return;
}


  setLoading(true);

  try {

    const res = await fetch("/api/checkout", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:"include",
   body:JSON.stringify({
  customerName: customer.nome,
  customerWhats: customer.whats,
  customerEmail: customer.email,
  customerCpf: customer.cpf,
  customerObs: customer.obs || "",
  paymentMethod: payment,
  freteCents: customer.freteCents || 0,
  endereco: customer.endereco,
  numero: customer.numero // 🔥 AQUI
})
    });

    const data = await res.json();

    // 🔴 NÃO LOGADO
    if (res.status === 401) {
      toast.error("Faça login para continuar");
      router.push("/login?redirect=/checkout");
      return;
    }

    // 🔴 ERRO NORMAL
    if(!res.ok){
      toast.error(data.error || "Erro ao finalizar compra");
      setLoading(false);
      return;
    }

    sessionStorage.setItem(
      "lastOrder",
      JSON.stringify(data)
    );

    
    // 🔥 abre o Mercado Pago em nova aba
window.open(data.init_point, "_blank");

// 🔥 redireciona pra sua tela de aguardando
router.push(`/pagamento/aguardando?orderId=${data.orderId}`);

  } catch (error) {
    console.error(error);
    toast.error("Erro inesperado");
    setLoading(false);
  }
}


if(!customer){

return(

<div className={s.page}>
<div className={s.container}>

<h1 className={s.title}>
Pagamento
</h1>

<div className={s.card}>
Dados não encontrados
</div>

</div>
</div>

);

}


return(

<div className={s.page}>
<div className={s.container}>

<h1 className={s.title}>
Pagamento
</h1>


<div className={s.card}>

<h3>Confirmar dados</h3>

<br/>

<p>
<b>Nome:</b> {customer.nome}
</p>

<p>
<b>Whats:</b> {customer.whats}
</p>

<p>
<b>Email:</b> {customer.email || "-"}
</p>

<p>
<b>CPF:</b> {customer.cpf}
</p>

{customer.freteCents > 0 && (
  <p>
    <b>Frete:</b> R$ {(customer.freteCents / 100).toFixed(2)}
  </p>
)}

</div>


<br/>


<div className={s.card}>

<h3>Forma de pagamento</h3>

<br/>

{payment === "pix" && (
  <div style={{
    background: "#0f2f1f",
    border: "1px solid #1f7a4d",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  }}>
    
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <AlertCircle size={18} color="#4ade80" />
      <span style={{ color: "#4ade80", fontWeight: 500 }}>
        Pagamento via PIX
      </span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <CheckCircle2 size={16} color="#22c55e" />
      <span style={{ color: "#d1fae5", fontSize: "14px" }}>
        Após pagar, volte para esta página
      </span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <CheckCircle2 size={16} color="#22c55e" />
      <span style={{ color: "#d1fae5", fontSize: "14px" }}>
        O pagamento será confirmado automaticamente
      </span>
    </div>

  </div>
)}

<label>

<input
type="radio"
value="pix"
checked={payment==="pix"}
onChange={()=>setPayment("pix")}
/>

 Pix

</label>

<br/><br/>


<label>

<input
type="radio"
value="credito"
checked={payment==="credito"}
onChange={()=>setPayment("credito")}
/>

 Cartão Crédito

</label>


<br/><br/>


<label>

<input
type="radio"
value="debito"
checked={payment==="debito"}
onChange={()=>setPayment("debito")}
/>

 Cartão Débito

</label>


<br/><br/>

<div style={{ marginBottom: "20px" }}>

  <h3>Cupom de desconto</h3>

  <br/>

  <input
    type="text"
    placeholder="Digite seu cupom"
    value={coupon}
    onChange={(e)=>setCoupon(e.target.value.toUpperCase())}
    className={s.input}
  />

  <br/><br/>

  <button
    type="button"
    onClick={aplicarCupom}
    className={s.button}
    disabled={couponLoading}
  >
    {couponLoading
      ? "Aplicando..."
      : "Aplicar Cupom"}
  </button>

  {discount > 0 && (
    <p style={{
      marginTop:"15px",
      color:"#22c55e",
      fontWeight:600
    }}>
      Desconto aplicado:
      {" "}
      R$ {discount.toFixed(2)}
    </p>
  )}

</div>

<button
onClick={finalizar}
className={s.button}
disabled={loading}
>

{loading
? "Processando..."
: "Finalizar Pedido"}

</button>


</div>


</div>
</div>

);

}