"use client";

import { useMemo, useState } from "react";
import s from "@/app/styles/projetos.module.css";

type Key = "condominio" | "comercio" | "clinicas" | "industria" | "residencia";
type SubKey = "internas" | "externas" | "rede" | "automacao";

type Sub = {
  key: SubKey;
  label: string;
  title: string;
  desc: string;
  media?: string;
};

type Segment = {
  key: Key;
  label: string;
  subtitle: string;
  subs: Sub[];
};

type FaqItem = { q: string; a: string };

const IMAGE_SRC = "/produtos/bannerpro.png";
const WHATS_NUMBER = "554738423235";

export default function ProjetosPage() {
  const segments: Segment[] = useMemo(
    () => [
      {
        key: "condominio",
        label: "Condomínios",
        subtitle:
          "Soluções para áreas comuns, entradas, controle de acesso e monitoramento.",
        subs: [
          {
            key: "externas",
            label: "Soluções externas",
            title: "Para áreas externas",
            desc: "CFTV, perímetro, identificação de acessos e prevenção.",
            media: "/produtos/condomino_EXTERNO.png",
          },
          {
            key: "internas",
            label: "Soluções internas",
            title: "Para áreas internas",
            desc: "Monitoramento interno, áreas comuns e ambientes compartilhados.",
            media: "/produtos/condomino_INTERNO.png",
          },
          {
            key: "rede",
            label: "Rede e comunicação",
            title: "Rede e comunicação",
            desc: "Cabeamento, switches, Wi-Fi e estrutura para estabilidade.",
            media: "/produtos/condomino_COMUNICACAO.png",
          },
          {
            key: "automacao",
            label: "Automatização",
            title: "Automatização",
            desc: "Integrações e automações conforme o cenário.",
            media: "/produtos/condomino_AUTOMACAO.png",
          },
        ],
      },
      {
        key: "comercio",
        label: "Comércios",
        subtitle: "Mais segurança e controle para lojas e escritórios.",
        subs: [
          {
            key: "externas",
            label: "Soluções externas",
            title: "Para áreas externas",
            desc: "Cobertura de fachada, estacionamento e entradas.",
            media: "/produtos/COMERCIO_externo.png",
          },
          {
            key: "internas",
            label: "Soluções internas",
            title: "Para áreas internas",
            desc: "Monitoramento de caixas, corredores e estoque.",
            media: "/produtos/COMERCIO_interno.png",
          },
          {
            key: "rede",
            label: "Rede e comunicação",
            title: "Rede e comunicação",
            desc: "Rede estável para PDV, câmeras IP e conectividade.",
            media: "/produtos/COMERCIO_REDE.png",
          },
          {
            key: "automacao",
            label: "Automatização",
            title: "Automatização",
            desc: "Rotinas e integrações para facilitar operação.",
            media: "/produtos/COMERCIO_automacao.png",
          },
        ],
      },
      {
        key: "clinicas",
        label: "Clínicas",
        subtitle: "Controle, organização e segurança para recepção e áreas sensíveis.",
        subs: [
          {
            key: "externas",
            label: "Soluções externas",
            title: "Para áreas externas",
            desc: "Acesso, estacionamento e entradas com segurança.",
            media: "/produtos/CLINICA_EXTERNO.png",
          },
          {
            key: "internas",
            label: "Soluções internas",
            title: "Para áreas internas",
            desc: "Recepção, corredores e áreas administrativas.",
            media: "/produtos/CLINICA_INTERNO.png",
          },
          {
            key: "rede",
            label: "Rede e comunicação",
            title: "Rede e comunicação",
            desc: "Rede estável para sistemas e operação.",
            media: "/produtos/CLINICA_COMUNICACAO.png",
          },
          {
            key: "automacao",
            label: "Automatização",
            title: "Automatização",
            desc: "Integrações para processos internos e acesso.",
            media: "/produtos/CLINICA_AUTOMACAO.png",
          },
        ],
      },
      {
        key: "industria",
        label: "Indústrias",
        subtitle: "Projetos robustos para áreas extensas e ambientes críticos.",
        subs: [
          {
            key: "externas",
            label: "Soluções externas",
            title: "Para áreas externas",
            desc: "Perímetro, pátio e pontos estratégicos.",
            media: "/produtos/PRODUTO-EXTERNO.png",
          },
          {
            key: "internas",
            label: "Soluções internas",
            title: "Para áreas internas",
            desc: "Galpões, linhas e áreas de controle.",
            media: "/produtos/industriaPRODUTO-INTERNO.png",
          },
          {
            key: "rede",
            label: "Rede e comunicação",
            title: "Rede e comunicação",
            desc: "Infra de rede para alta disponibilidade e expansão.",
            media: "/produtos/PRODUTO-COMUNICAÇÃO.png",
          },
          {
            key: "automacao",
            label: "Automatização",
            title: "Automatização",
            desc: "Integrações e automações conforme necessidade.",
            media: "/produtos/PRODUTO_EXTERNO.png",
          },
        ],
      },
      {
        key: "residencia",
        label: "Residências",
        subtitle: "Soluções práticas, modernas para o dia a dia.",
        subs: [
          {
            key: "externas",
            label: "Soluções externas",
            title: "Para áreas externas",
            desc: "Entrada, garagem e perímetro.",
            media: "/produtos/PRODUTO-EXTERN.png",
          },
          {
            key: "internas",
            label: "Soluções internas",
            title: "Para áreas internas",
            desc: "Ambientes internos e pontos de circulação.",
            media: "/produtos/PRODUTO-INTERNO.png",
          },
          {
            key: "rede",
            label: "Rede e comunicação",
            title: "Rede e comunicação",
            desc: "Wi-Fi e rede para câmeras IP e automação.",
            media: "/produtos/residencial.png",
          },
          {
            key: "automacao",
            label: "Automatização",
            title: "Automatização",
            desc: "Rotinas inteligentes e integrações.",
            media: "/produtos/residencial-atualizado.png",
          },
        ],
      },
    ],
    []
  );

  const faqItems: FaqItem[] = useMemo(
    () => [
      {
        q: "Dá pra fazer só o projeto?",
        a: "Sim. Podemos entregar o projeto completo, incluindo levantamento, dimensionamento e orientação.",
      },
      {
        q: "Vocês atendem empresas e residências?",
        a: "Sim. Atendemos residências, comércios, condomínios, clínicas e indústrias, sempre com soluções adequadas para cada cenário.",
      },
      {
        q: "Tem visita técnica?",
        a: "Sim. Agendamos uma visita técnica para entender o ambiente e indicar a melhor solução antes do orçamento final.",
      },
    ],
    []
  );

  const [seg, setSeg] = useState<Key>("condominio");
  const [sub, setSub] = useState<SubKey>("externas");

  const activeSeg = segments.find((x) => x.key === seg) ?? segments[0];
  const activeSub =
    activeSeg.subs.find((x) => x.key === sub) ?? activeSeg.subs[0];

  const getWhatsLink = () => {
    const msg = `Olá! Gostaria de solicitar uma proposta.

Segmento: ${activeSeg.label}
Solução: ${activeSub.label}`;

    return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* ===== VIDEO BANNER TOPO ===== */}
     <section className={s.videoHero}>
  <img
    src="/produtos/bannerpro.png"
    alt="Banner"
    className={s.heroImg}
  />

  <div className={s.heroContent}>
    <p className={s.kicker}>PROJETOS</p>

    <h1 className={s.videoTitle}>
      SOLUÇÕES EM COMUNICAÇÃO, ENERGIA E SEGURANÇA
    </h1>

    <p className={s.videoSub}>
      Para ambientes residenciais, comerciais, condominiais e industriais.
    </p>

    <div className={s.videoActions}>
      <a className={`btn btn-primary ${s.btnPrimary}`} href="/fale-conosco#form-orcamento">
        Solicitar proposta
      </a>

      <a
        className={`btn btn-outline ${s.btnGhost}`}
        href={`https://wa.me/554738423235`}
        target="_blank"
      >
        Falar no WhatsApp
      </a>
    </div>
  </div>
</section>

      {/* ===== CONTEÚDO ===== */}
      <main className={s.page}>
        <header className={s.header}>
          <p className={s.badge}>Serviços • Projetos</p>
        </header>

        {/* ===== NOSSAS SOLUÇÕES ===== */}
        <section className={s.solutionsSection}>
          <div className={s.containerWide}>
            <div className={s.solutionsHead}>
              <h3 className={s.h2}>Nossas soluções</h3>
              <p className={s.p}>
                Selecione o segmento e, em seguida, escolha o tipo de solução para visualizar
                o exemplos.
              </p>
            </div>

            <div className={s.segmentTabs}>
              {segments.map((x) => (
                <button
                  key={x.key}
                  type="button"
                  className={`${s.segmentTab} ${x.key === seg ? s.active : ""}`}
                  onClick={() => {
                    setSeg(x.key);
                    setSub("externas");
                  }}
                >
                  {x.label}
                </button>
              ))}
            </div>

            <div className={s.segmentLine} />

            <div className={s.segmentBody}>
              <div className={s.segmentLeft}>
                <p className={s.segSubtitle}>{activeSeg.subtitle}</p>

                <div className={s.subTabs}>
                  {activeSeg.subs.map((sb) => (
                    <button
                      key={sb.key}
                      type="button"
                      className={`${s.subTab} ${
                        sb.key === sub ? s.activeSub : ""
                      }`}
                      onClick={() => setSub(sb.key)}
                    >
                      {sb.label}
                    </button>
                  ))}
                </div>

                {/* ✅ AQUI ficam os botões do DESKTOP (não mexe) */}
                <div className={s.subContent}>
                  <h3 className={s.subTitle}>{activeSub.title}</h3>
                  <p className={s.subDesc}>{activeSub.desc}</p>

                  <div className={s.subActions}>
                    <a className={`btn btn-outline ${s.btnGhost}`} href="/fale-conosco#form-orcamento">
                      Tenho interesse
                    </a>
                    <a
                      className={`btn btn-primary ${s.btnPrimary}`}
                      href={getWhatsLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Solicitar proposta
                    </a>
                  </div>
                </div>
              </div>

              <div className={s.segmentRight}>
  <div className={s.exampleBox}>
    <div className={s.exampleMedia}>
      {activeSub.media ? (
        <img
          src={activeSub.media}
          alt={activeSub.title}
          className={s.exampleImg}
        />
      ) : (
        <div className={s.examplePlaceholder}>
          IMAGEM/EXEMPLO AQUI
          <br />
          <span className={s.exampleHint}>
            /projetos/arquivo.png
          </span>
        </div>
      )}
    </div>
  </div>

  <div className={s.mobileActions}>
    <a className={`btn btn-outline ${s.btnGhost}`} href="/fale-conosco#form-orcamento">
      Tenho interesse
    </a>

    <a
      className={`btn btn-primary ${s.btnPrimary}`}
      href={getWhatsLink()}
      target="_blank"
      rel="noopener noreferrer"
    >
      Solicitar proposta
    </a>
  </div>
</div>
            </div>
          </div>
        </section>

        {/* ===== DIFERENCIAIS (com imagem do lado) ===== */}
        <section className={s.section}>
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Diferenciais</h3>
            <p className={s.sectionSub}>
              Por que escolher a Lima e Lima.
            </p>
          </div>

          <div className={s.twoCol}>
            <div className={s.cardStack}>
              <div className={s.simpleCard}>
                <strong>Organização</strong>
                <p>Planejamento, padrão de instalação e checklist de entrega.</p>
              </div>

              <div className={s.simpleCard}>
                <strong>Padrão profissional</strong>
                <p>Acabamento limpo, identificação adequada e documentação do projeto.</p>
              </div>

              <div className={s.simpleCard}>
                <strong>Suporte</strong>
                <p>Orientação completa, pós-venda e manutenção sempre que necessário.</p>
              </div>
            </div>

            <div className={s.mediaCard}>
              <img
                src="/produtos/diferenciais.jpeg"
                alt="Imagem de apoio"
                className={s.mediaImg}  
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </section>

        {/* ===== CTA “Quer um projeto…” ===== */}
        <section className={s.ctaBar}>
          <div className={s.ctaText}>
            <h3 className={s.ctaTitle}>
              Quer um projeto bem feito e sem dor de cabeça?
            </h3>
            <p className={s.ctaSub}>Fale com a nossa equipe pelo WhatsApp e receba uma orientação rápida e sem compromisso.</p>
          </div>

          <div className={s.ctaActions}>
            <a
              className={`btn btn-primary ${s.btnPrimary}`}
              href={`https://wa.me/${WHATS_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
            <a className={`btn btn-outline ${s.btnGhost}`} href="/fale-conosco#form-orcamento">
              Solicitar orçamento
            </a>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className={s.section}>
          <div className={s.sectionHead}>
            <h3 className={s.sectionTitle}>Perguntas frequentes</h3>
          </div>

          <div className={s.faqList}>
            {faqItems.map((it) => (
              <details key={it.q} className={s.faqItem}>
                <summary className={s.faqQ}>{it.q}</summary>
                <div className={s.faqA}>{it.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ===== BOTÃO FIXO ===== */}
      <a className={s.floatingProposalBtn} href="/fale-conosco#form-orcamento">
        Solicitar proposta →
      </a>
    </>
  );
}
