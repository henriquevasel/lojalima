"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";

export default function LoginClient() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const verified = params.get("verified");

  useEffect(() => {
    if (verified) {
      toast.success("Email verificado com sucesso! 🎉");
    }
  }, [verified]);

  async function login() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Confirme seu email 📧");
      } else {
        toast.error(data.error || "Erro ao fazer login");
      }
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

        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Produto adicionado ao carrinho!");
      } catch {
        console.log("Erro ao recuperar carrinho pendente");
      }
    }

    toast.success("Login realizado!");

    // 🔥 REDIRECIONAMENTO CORRETO (resolve seu bug)
    window.location.href = redirect;
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>Entrar</h1>

        <div className={s.card}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={s.input}
          />

          <button onClick={login} className={s.button}>
            Entrar
          </button>

          <div style={{ marginTop: 10, textAlign: "right" }}>
            <a href="/forgot-password" style={{ fontSize: 13, color: "#888" }}>
              Esqueceu sua senha?
            </a>
          </div>

          <p className={s.registerText}>
            Não tem conta?{" "}
            <a href="/registro" className={s.registerLink}>
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}