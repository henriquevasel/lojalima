"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import PageShell from "@/app/components/PageShell";
import s from "@/app/styles/faleconosco.module.css";

const WHATS_NUMBER = "554738423235"; // 55 + DDD + número

type FormState = {
  nome: string;
  cidade: string;
  whatsapp: string;
  email: string;
  assunto: string;
  mensagem: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const ASSUNTOS = [
  "Data Center",
  "Sistema de Segurança",
  "Instalação",
  "Projetos",
  "Outros",
] as const;

export default function FaleConoscoPage() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    cidade: "",
    whatsapp: "",
    email: "",
    assunto: "Data Center",
    mensagem: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function handleSendWhats() {
    const msg =
      `📩 *Novo contato pelo site*\n\n` +
      `👤 *Nome:* ${form.nome}\n` +
      `📍 *Cidade/UF:* ${form.cidade}\n` +
      `📞 *WhatsApp:* ${formatPhoneBR(form.whatsapp)}\n` +
      `✉️ *E-mail:* ${form.email}\n` +
      `🧩 *Assunto:* ${form.assunto}\n\n` +
      `📝 *Mensagem:*\n${form.mensagem}`;

    const url = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    // marca tudo como tocado pra mostrar erros
    setTouched({
      nome: true,
      cidade: true,
      whatsapp: true,
      email: true,
      assunto: true,
      mensagem: true,
    });

    const currentErrors = validate(form);
    if (Object.keys(currentErrors).length > 0) return;

    try {
      setIsSending(true);
      // aqui você poderia mandar pra API no futuro
      handleSendWhats();
    } catch {
      setSubmitError("Não consegui abrir o WhatsApp agora. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className={s.page}>
      <PageShell
        badge="Contato"
        title="Fale Conosco"
        subtitle="Respondemos rápido. Envie sua necessidade e nossa equipe orienta você na melhor solução."
        crumbs={[{ label: "Início", href: "/" }, { label: "Fale Conosco" }]}
        heroRight={
          <div className={s.heroRight}>
            <div className={s.heroCard}>
              <div className={s.heroTitle}>Canais de atendimento</div>

              <div className={s.heroList}>
                <div>
                  📍 Endereço: <span>Rua Presidente Epitácio Pessoa, 723
                              Centro – Jaraguá do Sul – SC
                              CEP 89251-155 – Brasil</span>
                </div>
                <div>
                  📞 Telefone: <span>(47) 3842-3235</span>
                </div>
                <div>
                  💬 WhatsApp: <span>(47) 3842-3235</span>
                </div>
                <div>
                  ✉️ E-mail: <span>comercial@limaelima.net.br</span>
                </div>
              </div>

              <a
                className={s.whatsPill}
                href={`https://wa.me/${WHATS_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp →
              </a>
            </div>

            <div className={s.mapBox}>
              <Image
                src="/produtos/mapa.png"
                alt="Mapa de regiões atendidas"
                fill
                sizes="(max-width: 900px) 92vw, 420px"
                className={s.mapImg}
                priority
              />
            </div>
          </div>
        }
        sections={[
          {
            title: "Envie sua mensagem",
            subtitle: "Conte o tipo de ambiente e o que você precisa.",
            children: (
              <section className={s.section}>
                <form id="form-orcamento" className={s.formWrap} onSubmit={onSubmit} noValidate>
                  <div className={s.formCard}>
                    <div className={s.grid2}>
                      <Field
                        label="Nome"
                        placeholder="Seu nome"
                        value={form.nome}
                        onChange={(v) => setField("nome", v)}
                        onBlur={() => markTouched("nome")}
                        error={touched.nome ? errors.nome : undefined}
                        required
                      />
                      <Field
                        label="Cidade/UF"
                        placeholder="Ex: Joinville/SC"
                        value={form.cidade}
                        onChange={(v) => setField("cidade", v)}
                        onBlur={() => markTouched("cidade")}
                        error={touched.cidade ? errors.cidade : undefined}
                        required
                      />
                    </div>

                    <div className={s.grid2}>
                      <Field
                        label="WhatsApp"
                        placeholder="(47) 9xxxx-xxxx"
                        value={formatPhoneBR(form.whatsapp)}
                        onChange={(v) => setField("whatsapp", digitsOnly(v))}
                        onBlur={() => markTouched("whatsapp")}
                        error={touched.whatsapp ? errors.whatsapp : undefined}
                        inputMode="tel"
                        required
                      />
                      <Field
                        label="E-mail"
                        placeholder="seuemail@exemplo.com"
                        value={form.email}
                        onChange={(v) => setField("email", v)}
                        onBlur={() => markTouched("email")}
                        error={touched.email ? errors.email : undefined}
                        inputMode="email"
                        required
                      />
                    </div>

                    <div className={s.field}>
                      <label className={s.label}>Assunto</label>
                      <select
                        className={s.input}
                        value={form.assunto}
                        onChange={(e) => setField("assunto", e.target.value)}
                        onBlur={() => markTouched("assunto")}
                      >
                        {ASSUNTOS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={s.field}>
                      <label className={s.label}>Mensagem</label>
                      <textarea
                        className={`${s.input} ${s.textarea}`}
                        placeholder="Descreva sua necessidade... (ex: cidade, tamanho do ambiente, quantos pontos, objetivo)"
                        value={form.mensagem}
                        onChange={(e) => setField("mensagem", e.target.value)}
                        onBlur={() => markTouched("mensagem")}
                      />
                      {touched.mensagem && errors.mensagem ? (
                        <div className={s.error}>{errors.mensagem}</div>
                      ) : null}
                    </div>

                    {submitError ? <div className={s.formError}>{submitError}</div> : null}

                    <div className={s.actions}>
                      <button
                        type="submit"
                        className={s.btnPrimary}
                        disabled={isSending || !isValid}
                        aria-disabled={isSending || !isValid}
                        title={!isValid ? "Preencha os campos obrigatórios" : undefined}
                      >
                        {isSending ? "Enviando..." : "Enviar no WhatsApp"}
                      </button>

                      <a
                        className={`btn btn-outline ${s.btnGhost}`}
                        href={`https://wa.me/${WHATS_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir WhatsApp direto
                      </a>
                    </div>

                    <p className={s.helperText}>
                      *A gente responde rápido. Se preferir, informe sua cidade, o tipo de ambiente e o que você precisa.
                    </p>
                  </div>
                </form>
              </section>
            ),
          },
        ]}
        cta={{
          title: "Precisa de agilidade?",
          subtitle: "Chame no WhatsApp e informe sua cidade, o tipo de ambiente e o que você precisa.",
          primaryLabel: "Falar no WhatsApp",
          primaryHref: `https://wa.me/${WHATS_NUMBER}`,
          secondaryLabel: "Ver Sistema de Segurança",
          secondaryHref: "/categoria/sistema-de-seguranca",
        }}
      />
    </main>
  );
}

function Field(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className={s.field}>
      <label className={s.label}>
        {props.label} {props.required ? <span className={s.req}>*</span> : null}
      </label>

      <input
        className={`${s.input} ${props.error ? s.inputError : ""}`}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        inputMode={props.inputMode}
        aria-invalid={!!props.error}
      />

      {props.error ? <div className={s.error}>{props.error}</div> : null}
    </div>
  );
}

/* =========================
   VALIDATION HELPERS
========================= */
function validate(v: FormState): FormErrors {
  const e: FormErrors = {};

  if (!v.nome.trim() || v.nome.trim().length < 2) {
    e.nome = "Digite seu nome (mín. 2 letras).";
  }

  if (!v.cidade.trim() || v.cidade.trim().length < 3) {
    e.cidade = "Informe sua cidade/UF.";
  }

  const phoneDigits = digitsOnly(v.whatsapp);
  if (phoneDigits.length < 10) {
    e.whatsapp = "WhatsApp inválido (ex: 47999999999).";
  }

  if (!isEmail(v.email)) {
    e.email = "E-mail inválido.";
  }

  if (!v.mensagem.trim() || v.mensagem.trim().length < 10) {
    e.mensagem = "Escreva uma mensagem (mín. 10 caracteres).";
  }

  return e;
}

function digitsOnly(s: string) {
  return (s || "").replace(/\D/g, "");
}

function isEmail(s: string) {
  const v = (s || "").trim();
  if (!v) return false;
  // validação simples e segura pro front
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function formatPhoneBR(raw: string) {
  const d = digitsOnly(raw);

  // (DD) 9XXXX-XXXX
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}
