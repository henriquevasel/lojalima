"use client";

import { useState } from "react";
import s from "@/app/styles/form.module.css";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
    } catch {
      toast.error("Erro ao enviar email");
    }
  }

  if (success) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.card} style={{ textAlign: "center" }}>
            <h2>Email enviado 📧</h2>
            <p style={{ marginTop: 10 }}>
              Se o email existir, você receberá o link de recuperação.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>Recuperar senha</h1>

        <div className={s.card}>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 15 }}>
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

          <input
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.input}
          />

          <button onClick={handleSubmit} className={s.button}>
            Enviar link
          </button>
        </div>
      </div>
    </div>
  );
}