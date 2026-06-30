"use client";

import Link from "next/link";
import s from "@/app/styles/form.module.css";

export default function EmailConfirmadoPage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div
          className={s.card}
          style={{
            textAlign: "center",
            maxWidth: 650,
          }}
        >
          <div
            style={{
              fontSize: 70,
              marginBottom: 15,
            }}
          >
            🎉
          </div>

          <h1
            className={s.title}
            style={{
              marginBottom: 15,
            }}
          >
            E-mail confirmado!
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            Sua conta foi ativada com sucesso.
            <br />
            Agora você já pode aproveitar todos os recursos da Loja Lima e
            Lima.
          </p>

          <div
            style={{
              marginTop: 30,
              background: "#f7f7f7",
              borderRadius: 12,
              padding: 25,
              textAlign: "left",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              Agora você pode:
            </h3>

            <p>🛒 Comprar produtos com mais rapidez</p>

            <p>📦 Acompanhar seus pedidos</p>

            <p>🔒 Recuperar sua senha com segurança</p>

            <p>❤️ Salvar produtos favoritos futuramente</p>

            <p>🎁 Receber ofertas e promoções exclusivas</p>
          </div>

          <Link
            href="/login"
            className={s.button}
            style={{
              display: "inline-block",
              marginTop: 30,
              textDecoration: "none",
            }}
          >
            Entrar na minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}