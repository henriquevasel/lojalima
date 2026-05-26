"use client";

import { useEffect, useState } from "react";
import s from "@/app/styles/account.module.css";

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
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 className={s.title}>
        Meus dados
      </h1>

      <p className={s.subtitle}>
        Atualize suas informações pessoais.
      </p>

      <form
  onSubmit={handleSave}
  className={s.form}
>
        <div className={s.field}>
  <label className={s.label}>
    Nome
  </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={s.input}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            value={email}
            disabled
            className={s.input}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={s.button}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
