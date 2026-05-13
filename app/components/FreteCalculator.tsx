

"use client";

import s from "@/app/styles/FreteCalculator.module.css";

import { useState } from "react";

export default function FreteCalculator() {

  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [endereco, setEndereco] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NOVO
  const [numero, setNumero] = useState("");
  const [retirada, setRetirada] = useState(false);

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
  ? freteData.find(
      (item: any) =>
        !item.error &&
        item.price &&
        Number(item.price) > 0
    )
  : null;

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

localStorage.setItem(
  "freteNome",
  melhorOpcao.name
);

sessionStorage.setItem(
  "freteCents",
  String(valor)
);

     

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
    <div className={s.wrapper}>

     <div className={s.title}>
        Calcular frete e prazo
      </div>

      <div className={s.row}>

        <div className={s.methods}>

  <button
    onClick={() => {

      setRetirada(false);

      sessionStorage.removeItem("retiradaLoja");

    }}
    className={`${s.methodBtn} ${!retirada ? s.active : ""}`}
  >
    🚚 Entrega
  </button>

  <button
    onClick={() => {

      setRetirada(true);

      setFrete(0);

      sessionStorage.setItem(
        "freteCents",
        "0"
      );

      sessionStorage.setItem(
        "retiradaLoja",
        "true"
      );

      localStorage.setItem(
        "freteNome",
        "Retirada na loja"
      );

    }}
    className={`${s.methodBtn} ${retirada ? s.active : ""}`}
  >
    Retirar na loja
  </button>

</div>

       <div className={s.cepRow}>

  <input
    placeholder="Digite seu CEP"
    value={cep}
    onChange={(e) => setCep(e.target.value)}
    className={s.input}
  />

  <button
    onClick={calcularFrete}
    disabled={loading}
    className={s.okBtn}
  >
    {loading ? "..." : "OK"}
  </button>

</div>

      </div>

      {/* ENDEREÇO */}
      {endereco && !retirada && (
        <div className={s.address}>
          {endereco.logradouro} <br />
          {endereco.bairro} <br />
          {endereco.localidade} - {endereco.uf}
        </div>
      )}

    {endereco && !retirada && (
  <input
    placeholder="Número da casa"
    value={numero}
    onChange={(e) => {
      setNumero(e.target.value);
      localStorage.setItem("numero", e.target.value);
    }}
    className={`${s.input} ${s.houseInput}`}
  />
)}
{retirada && (
  <div className={s.pickupBox}>
    <div
      style={{
        fontWeight: 700,
        marginBottom: 6
      }}
    >
      🏪 Retirada na loja
    </div>

    <div
      style={{
        fontSize: 13,
        opacity: 0.8,
        lineHeight: 1.5
      }}
    >
      Rua Presidente Epitácio Pessoa, 723 Sala 1
      <br />
      CEP: 89251-155
    </div>

    <div
      style={{
        marginTop: 8,
        color: "#22c55e",
        fontWeight: 700
      }}
    >
      Frete grátis
    </div>
  </div>
)}

      {/* RESULTADO */}
      {frete !== null && (endereco || retirada) && (
        <div className={s.resultBox}>
          <div className={s.resultTop}>
            <span>🚚 {localStorage.getItem("freteNome")}</span>
            <span className={s.price}>
              R$ {(frete / 100).toFixed(2)}
            </span>
          </div>

      {!retirada && endereco && (
  <div
    style={{
      marginTop: 4,
      fontSize: 12,
      opacity: 0.7
    }}
  >
    Entrega para {endereco.localidade} - {endereco.uf}
  </div>
)}
        </div>
      )}

    </div>
  );
}