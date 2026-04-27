"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    alert("Se o email existir, enviamos o link!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}