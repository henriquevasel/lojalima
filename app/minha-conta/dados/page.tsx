"use client";

import { useEffect, useState } from "react";

export default function DadosPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/me");

      if (!res.ok) return;

      const data = await res.json();

      setName(data.name || "");
      setEmail(data.email || "");

      setLoading(false);
    }

    fetchUser();
  }, []);

  async function handleSave(e: any) {
    e.preventDefault();

    setSaving(true);

    const res = await fetch("/api/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    setSaving(false);

    if (res.ok) {
      alert("Dados atualizados!");
    } else {
      alert("Erro ao atualizar");
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          background: "#050505",
          color: "#fff",
          padding: 40,
        }}
      >
        Carregando...
      </div>
    );
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
        Meus dados
      </h1>

      <form
        onSubmit={handleSave}
        style={{
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <label>Nome</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label>Email</label>

          <input
            value={email}
            disabled
            style={{
              width: "100%",
              height: 50,
              borderRadius: 12,
              border: "1px solid #222",
              background: "#1a1a1a",
              color: "#777",
              padding: "0 15px",
              marginTop: 8,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
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
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}

