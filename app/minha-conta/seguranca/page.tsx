
"use client";

import { useState } from "react";

export default function SegurancaPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Senha alterada com sucesso!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(data.error || "Erro ao alterar senha");
    }
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        background: "#050505",
        color: "#fff",
        padding: 40,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 30,
        }}
      >
        Segurança
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <label>Senha atual</label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            style={{
              width: "100%",
              height: 50,
              borderRadius: 12,
              border: "1px solid #222",
              background: "#111",
              color: "#fff",
              padding: "0 15px",
              marginTop: 8,
            }}
          />
        </div>

        <div>
          <label>Nova senha</label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            style={{
              width: "100%",
              height: 50,
              borderRadius: 12,
              border: "1px solid #222",
              background: "#111",
              color: "#fff",
              padding: "0 15px",
              marginTop: 8,
            }}
          />
        </div>

        <div>
          <label>Confirmar nova senha</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            style={{
              width: "100%",
              height: 50,
              borderRadius: 12,
              border: "1px solid #222",
              background: "#111",
              color: "#fff",
              padding: "0 15px",
              marginTop: 8,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            height: 50,
            borderRadius: 12,
            border: "none",
            background: "#00c853",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Alterar senha
        </button>
      </form>
    </div>
  );
}

