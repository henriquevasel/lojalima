import PageShell from "app/components/PageShell";
import s from "@/app/styles/instalacao.module.css";

export default function InstalacaoPage() {
  return (
    <main className={s.page}>
      {/* ===== BANNER TOPO ===== */}
      <div className={s.bannerTop} />

      <div className={s.shell}>
        <PageShell
          badge="Serviços • Instalação"
          title="Instalação"
          subtitle="Instalação profissional, organizada e testada."
          crumbs={[{ label: "Início", href: "/" }, { label: "Instalação" }]}
          heroImage={{
            src: "/produtos/d94d3597-2218-4901-8d1d-b4d1c483edb1.jfif",
            alt: "Instalação de infraestrutura e segurança",
            priority: true,
          }}
          sections={[
            {
              title: "O que instalamos",
              subtitle: "Tudo com padrão profissional e organização — sem gambiarras.",
              media: { src: "/produtos/bannervisao1.jfif", alt: "Equipe/instalação" },
              children: (
                <ul className={s.list}>
                  <li>Câmeras e gravadores (DVR/NVR)</li>
                  <li>Alarmes e sensores</li>
                  <li>Controle de acesso (facial, biometria e tags)</li>
                  <li>Cabeamento estruturado</li>
                  <li>Racks, patch panels, switches e roteadores</li>
                  <li>Nobreaks e organização de energia</li>
                </ul>
              ),
            },
            {
              title: "Como entregamos",
              subtitle: "O objetivo é que você receba tudo funcionando, organizado e fácil de manter.",
              media: { src: "/produtos/bannervisao2.jfif", alt: "Rack organizado e identificado" },
              children: (
                <div className={s.cardStack}>
                  <div className={s.cardMini}>
                    <strong>Organização</strong>
                    <p>Identificação, padronização e acabamento profissional.</p>
                  </div>
                  <div className={s.cardMini}>
                    <strong>Testes</strong>
                    <p>Testes de funcionamento e orientação completa de uso.</p>
                  </div>
                  <div className={s.cardMini}>
                    <strong>Suporte</strong>
                    <p>Ajustes finos, suporte técnico e possibilidade de expansão quando necessário.</p>
                  </div>
                </div>
              ),
            },
          ]}
          cta={{
            title: "Quer agendar instalação?",
            subtitle: "Fale com a gente no WhatsApp e informe sua cidade e o tipo de ambiente.",
            primaryLabel: "Falar no WhatsApp",
            primaryHref: "https://wa.me/554738423235",
            secondaryLabel: "Ver Sistema de Segurança",
            secondaryHref: "/categoria/sistema-de-seguranca",
          }}
          faq={{
            title: "Perguntas frequentes",
            items: [
              { q: "Vocês instalam equipamento do cliente?", a: "Sim. Avaliamos o equipamento previamente para garantir compatibilidade e qualidade da instalação." },
              { q: "A instalação tem garantia?", a: "Sim. Oferecemos garantia conforme o tipo de serviço realizado." },
              { q: "Fazem manutenção?", a: "Sim. Trabalhamos com manutenção preventiva e corretiva." },
            ],
          }}
        />
      </div>
    </main>
  );
}
