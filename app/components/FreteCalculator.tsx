"use client";

import { useState } from "react";

export default function FreteCalculator() {

  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [endereco, setEndereco] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NOVO
  const [numero, setNumero] = useState("");

  async function calcularFrete() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setEndereco(data);

     const freteRes = await fetch("/api/frete", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    cep: cepLimpo,
  }),
});

const freteData = await freteRes.json();

console.log("FRETE:", freteData);

const melhorOpcao = Array.isArray(freteData)
  ? freteData[0]
  : freteData;

if (
  !melhorOpcao ||
  melhorOpcao.error ||
  !melhorOpcao.price
) {
  console.log("ERRO FRETE:", melhorOpcao);

  alert("Não foi possível calcular o frete");

  return;
}

const valor = Math.round(
  Number(melhorOpcao.price) * 100
);

setFrete(valor);

sessionStorage.setItem(
  "freteCents",
  String(valor)
);

      setFrete(valor);

      // 🔥 SALVA
      sessionStorage.setItem("freteCents", String(valor));
      localStorage.setItem("cep", cepLimpo);
      localStorage.setItem("cidade", data.localidade);
      localStorage.setItem("uf", data.uf);
      localStorage.setItem("logradouro", data.logradouro || "");
      localStorage.setItem("bairro", data.bairro || "");

    } catch {
      alert("Erro ao calcular frete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      marginTop: 25,
      marginBottom: 20,
      padding: 18,
      borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.08)",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}>

      <div style={{
        fontWeight: 700,
        marginBottom: 12,
        fontSize: 15
      }}>
        Calcular frete e prazo
      </div>

      <div style={{
        display: "flex",
        gap: 10,
        alignItems: "center"
      }}>

        <input
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontSize: 14
          }}
        />

        <button
          onClick={calcularFrete}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "#22c55e",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "..." : "OK"}
        </button>

      </div>

      {/* ENDEREÇO */}
      {endereco && (
        <div style={{
          marginTop: 10,
          fontSize: 13,
          opacity: 0.8
        }}>
          {endereco.logradouro} <br />
          {endereco.bairro} <br />
          {endereco.localidade} - {endereco.uf}
        </div>
      )}

    {endereco && (
  <input
    placeholder="Número da casa"
    value={numero}
    onChange={(e) => {
      setNumero(e.target.value);
      localStorage.setItem("numero", e.target.value);
    }}
    style={{
      marginTop: 10,
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: numero ? "1px solid #ddd" : "1px solid red", // 🔥 feedback visual
      fontSize: 14
    }}
  />
)}

      {/* RESULTADO */}
      {frete !== null && endereco && (
        <div style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 10,
          background: "#ecfdf5",
          border: "1px solid #22c55e",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>🚚 Entrega</span>
            <span style={{ fontWeight: 700 }}>
              R$ {(frete / 100).toFixed(2)}
            </span>
          </div>

          <div style={{
            marginTop: 4,
            fontSize: 12,
            opacity: 0.7
          }}>
            Entrega para {endereco.localidade} - {endereco.uf}
          </div>
        </div>
      )}

    </div>
  );
}