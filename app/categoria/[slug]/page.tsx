import { notFound } from "next/navigation";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import s from "@/app/styles/category.module.css";
import { CATEGORY_CONTENT } from "@/app/data/categoryContent";

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;

  const content = CATEGORY_CONTENT?.[slug];

  if (!content) return notFound();

  const bannerImage = content.bannerImage || "/produtos/bannersegurança.png";
  const introImage = content.introImage || "";

  const FAQ = [
    {
      q: "Vocês fazem visita técnica?",
      a: "Sim. A visita técnica pode ser agendada para levantamento e orientação do projeto.",
    },
    {
      q: "Vocês fornecem equipamentos e instalação?",
      a: "Sim. Oferecemos a solução completa, incluindo fornecimento dos equipamentos e instalação.",
    },
    {
      q: "Atendem empresa e residência?",
      a: "Sim. Atendemos residências, comércios e empresas.",
    },
  ];

  return (
    <div className="lightTheme">
      <main className={s.page}>
        {/* ===== Banner ===== */}
        <section className={s.banner}>
          <img src={bannerImage} alt={content.title} className={s.bannerImg} />
          <div className={s.bannerOverlay} />
        </section>

        <div className={s.container}>
          <header className={s.header}>
            <h1 className={s.title}>{content.title}</h1>
            <p className={s.subtitle}>{content.subtitle}</p>

            <div className={s.introBlock}>
              <p className={s.intro}>{content.intro}</p>

              <div className={s.introMedia}>
                {introImage ? (
                  <img src={introImage} alt={content.title} />
                ) : (
                  <div className={s.thumbPlaceholder}>IMAGEM INTRO</div>
                )}
              </div>
            </div>
          </header>

          <h2 className={s.servicesTitle}>Serviços</h2>

          <section className={s.grid}>
            {content.cards.map((card) => (
              <article key={card.title} className={s.card}>
                <div className={s.thumb}>
                  {card.image ? (
                    <img src={card.image} alt={card.title} />
                  ) : (
                    <span className={s.thumbPlaceholder}>IMAGEM</span>
                  )}
                </div>

                <div className={s.body}>
                  <h3 className={s.cardTitle}>{card.title}</h3>
                  <p className={s.cardDesc}>{card.desc}</p>

                  {card.tags && (
                    <div className={s.tags}>
                      {card.tags.map((t) => (
                        <span key={t} className={s.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={s.ctaRow}>
                    <a
                      href={card.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.ctaPrimary}
                    >
                      {card.ctaLabel}
                    </a>

                    <Link
                      href="/fale-conosco#form-orcamento"
                      className={s.ctaGhost}
                    >
                      Solicitar orçamento
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* FAQ */}
          <section className={s.faqSection}>
            <h2 className={s.faqTitle}>Perguntas frequentes</h2>

            {FAQ.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </section>

          {/* ===== PRODUTOS DA CATEGORIA ===== */}
          <section style={{ marginTop: 60 }}>
            <h2 style={{ marginBottom: 30 }}>Produtos desta categoria</h2>
          </section>

          <footer className={s.footer}>
            <div>© {new Date().getFullYear()} Lima e Lima</div>
            <div>
              Precisa de ajuda?{" "}
              <a href="https://wa.me/554738423235">Fale no WhatsApp</a>
            </div>
          </footer>
        </div>

        {/* BOTÃO WHATS REDONDO */}
        <a
          href="https://wa.me/554738423235"
          target="_blank"
          rel="noopener noreferrer"
          className={s.floatingBtn}
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={26} />
        </a>
      </main>
    </div>
  );
} // <--- ESTA CHAVE ESTAVA FALTANDO!