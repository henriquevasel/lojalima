"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Senha atualizada!");
      window.location.href = "/login";
    } else {
      alert("Token inválido ou expirado");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nova senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Salvar nova senha</button>
    </form>
  );
}