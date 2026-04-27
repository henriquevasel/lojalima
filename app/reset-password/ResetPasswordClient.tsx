"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        toast.error("Token inválido ou expirado");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);

    } catch {
      toast.error("Erro ao redefinir senha");
    }
  }

  if (success) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.card} style={{ textAlign: "center" }}>
            <h2>Senha atualizada! 🎉</h2>
            <p style={{ marginTop: 10 }}>
              Redirecionando para o login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>Nova senha</h1>

        <div className={s.card}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={s.input}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={s.input}
          />

          <button onClick={handleSubmit} className={s.button}>
            Salvar nova senha
          </button>
        </div>
      </div>
    </div>
  );
}