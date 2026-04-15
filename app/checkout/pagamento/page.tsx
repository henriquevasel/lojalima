"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";

export default function PagamentoPage(){

const router = useRouter();

const [customer,setCustomer]=useState<any>(null);

const [loading,setLoading]=useState(false);

const [payment,setPayment]=useState("pix");


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


async function finalizar(){

  if(!customer){
    toast.error("Dados não encontrados");
    return;
  }

   if (customer.freteCents == null) {
    toast.error("Frete não calculado");
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
        customerName:customer.nome,
        customerWhats:customer.whats,
        customerEmail:customer.email || "",
        customerCpf:customer.cpf,
        customerObs:customer.obs || "",
        paymentMethod:payment,
        freteCents: customer.freteCents || 0
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

    // 🔥 REDIRECIONA PRO MERCADO PAGO
    window.location.href = data.init_point;

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