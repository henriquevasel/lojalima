"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import s from "@/app/styles/form.module.css";

export default function VerifiqueEmailContent() {
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [loading, setLoading] = useState(false);

  async function resendEmail() {
    if (!email) {
      toast.error("Não foi possível identificar o e-mail.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao reenviar e-mail.");
        return;
      }

      toast.success("Novo e-mail enviado com sucesso! 📧");
    } catch {
      toast.error("Erro ao reenviar e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div
          className={s.card}
          style={{
            textAlign: "center",
          }}
        >
          <h1 className={s.title}>
            📧 Verifique seu e-mail
          </h1>

          <p
            style={{
              marginTop: 20,
              lineHeight: 1.6,
            }}
          >
            Enviamos um e-mail de confirmação para:
          </p>

          <p
            style={{
              fontWeight: "bold",
              marginTop: 8,
              wordBreak: "break-word",
            }}
          >
            {email}
          </p>

          <p
            style={{
              marginTop: 20,
              color: "#666",
            }}
          >
            Clique no link recebido para ativar sua conta.
          </p>

          <div
            style={{
              marginTop: 25,
              padding: 15,
              borderRadius: 8,
              background: "#f7f7f7",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>Não encontrou o e-mail?</strong>

            <br />
            <br />

            • Verifique sua caixa de spam.
            <br />
            • Confira se digitou o e-mail corretamente.
          </div>

          <button
            onClick={resendEmail}
            disabled={loading}
            className={s.button}
            style={{
              marginTop: 25,
            }}
          >
            {loading
              ? "Enviando..."
              : "Reenviar e-mail"}
          </button>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <Link
              href="/login"
              style={{
                color: "#666",
                textDecoration: "underline",
              }}
            >
              Já confirmou? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}