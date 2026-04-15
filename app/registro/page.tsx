"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";

export default function RegistroPage(){

const router = useRouter();

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [loading,setLoading]=useState(false);

async function registrar() {

  if (!name || !email || !password) {
    toast.error("Preencha todos os campos");
    return;
  }

  if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
    toast.error("Digite um nome válido");
    return;
  }

  if (!email.includes("@")) {
    toast.error("Digite um email válido");
    return;
  }

  if (password.length < 6) {
    toast.error("A senha precisa ter pelo menos 6 caracteres");
    return;
  }

  setLoading(true);

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  setLoading(false);

  if (!res.ok) {
    toast.error(data.error);
    return;
  }

  // 🔥 RECUPERA ITEM PENDENTE
  const pending = localStorage.getItem("pendingCart");

  if (pending) {
    try {
      const item = JSON.parse(pending);

      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(item),
      });

      localStorage.removeItem("pendingCart");

      toast.success("Produto adicionado ao carrinho!");
    } catch {
      console.log("Erro ao recuperar carrinho pendente");
    }
  }

  toast.success("Conta criada! Verifique seu email 📧");
router.push("/verifique-email");
}

return(

<div className={s.page}>
<div className={s.container}>

<h1 className={s.title}>
Criar conta
</h1>

<div className={s.card}>

<input
placeholder="Nome"
value={name}
onChange={(e)=>setName(e.target.value)}
className={s.input}
required
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className={s.input}
required
/>

<input
type="password"
placeholder="Senha"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className={s.input}
required
/>

<button
onClick={registrar}
className={s.button}
disabled={loading}
>

{loading ? "Criando..." : "Criar conta"}

</button>

<p className={s.linkText}>
Já tem conta? <Link href="/login">Entrar</Link>
</p>

</div>

</div>
</div>

);
}