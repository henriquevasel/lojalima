"use client";

import { useState } from "react";

export default function FreteCalculator() {

  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [endereco, setEndereco] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function calcularFrete() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido");
      return;
    }

    setLoading(true);

    try {
      // 🔥 BUSCA ENDEREÇO
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setEndereco(data);

      // 🔥 CALCULA FRETE (INTELIGENTE)
      let valor = 3000;

      if (data.uf === "SC") valor = 1000;
      else if (data.uf === "PR") valor = 1500;
      else if (data.uf === "SP") valor = 2000;

      setFrete(valor);

      // 🔥 SALVA
      sessionStorage.setItem("freteCents", String(valor));
      localStorage.setItem("cep", cep);
      localStorage.setItem("cidade", data.localidade);
      localStorage.setItem("uf", data.uf);
      localStorage.setItem("cep", cepLimpo);
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
          {endereco.localidade} - {endereco.uf}
        </div>
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
            Entrega para {endereco.localidade} - {endereco.uf} (3 a 5 dias úteis)
          </div>
        </div>
      )}

    </div>
  );
}