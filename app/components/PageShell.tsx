import React from "react";
import Image from "next/image";
import styles from "app/styles/PageShell.module.css";

type Crumb = { label: string; href?: string };
type Feature = { title: string; desc: string; icon?: React.ReactNode };
type FAQ = { q: string; a: string };

export default function PageShell(props: {
  badge?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];

  heroImage?: {
    src: string;
    alt: string;
    priority?: boolean;
    fit?: "cover" | "contain";
  };

  heroRight?: React.ReactNode;

  features?: { title: string; items: Feature[] };

  sections?: Array<{
    id?: string;
    title: string;
    subtitle?: string;
    media?: { src: string; alt: string; fit?: "cover" | "contain" };
    children: React.ReactNode;
  }>;

  cta?: {
    title: string;
    subtitle?: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };

  faq?: { title: string; items: FAQ[] };
}) {
  const { badge, title, subtitle, crumbs, heroImage, heroRight, features, sections, cta, faq } = props;

  return (
    <main className={styles.page}>
      {/* HERO PADRÃO (dentro do container, sem full width) */}
      <header className={styles.hero}>
        <div className={styles.container}>
          {crumbs?.length ? (
            <nav className={styles.breadcrumbs}>
              {crumbs.map((c, i) => (
                <span key={i} className={styles.crumb}>
                  {c.href ? <a href={c.href}>{c.label}</a> : c.label}
                  {i < crumbs.length - 1 ? <span className={styles.sep}>/</span> : null}
                </span>
              ))}
            </nav>
          ) : null}

          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              {badge ? <span className={styles.badge}>{badge}</span> : null}
              <h1 className={styles.h1}>{title}</h1>
              {subtitle ? <p className={styles.p}>{subtitle}</p> : null}

              {heroImage ? (
                <div className={styles.heroImage}>
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    priority={heroImage.priority ?? false}
                    sizes="(max-width: 900px) 92vw, 560px"
                    style={{ objectFit: heroImage.fit ?? "cover" }}
                  />
                </div>
              ) : null}
            </div>

            {heroRight ? <div className={styles.heroRight}>{heroRight}</div> : null}
          </div>
        </div>
      </header>

      {features ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>{features.title}</h2>
            <div className={styles.grid3}>
              {features.items.map((f, idx) => (
                <div key={idx} className={styles.card}>
                  {f.icon ? <div className={styles.icon}>{f.icon}</div> : null}
                  <h3 className={styles.h3}>{f.title}</h3>
                  <p className={styles.pSmall}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sections?.length
        ? sections.map((sec, idx) => (
            <section key={idx} id={sec.id} className={styles.section}>
              <div className={styles.container}>
                <div className={styles.sectionHead}>
                  <h2 className={styles.h2}>{sec.title}</h2>
                  {sec.subtitle ? <p className={styles.p}>{sec.subtitle}</p> : null}
                </div>

                <div className={styles.sectionGrid}>
                  <div className={styles.sectionBody}>{sec.children}</div>

                  {sec.media ? (
                    <div className={styles.mediaCard}>
                      <div className={styles.mediaImg}>
                        <Image
                          src={sec.media.src}
                          alt={sec.media.alt}
                          fill
                          sizes="(max-width: 900px) 92vw, 420px"
                          style={{ objectFit: sec.media.fit ?? "cover" }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ))
        : null}

      {cta ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.cta}>
              <div>
                <h2 className={styles.h2}>{cta.title}</h2>
                {cta.subtitle ? <p className={styles.p}>{cta.subtitle}</p> : null}
              </div>
              <div className={styles.ctaActions}>
                <a className={styles.btnPrimary} href={cta.primaryHref}>
                  {cta.primaryLabel}
                </a>
                {cta.secondaryLabel && cta.secondaryHref ? (
                  <a className={styles.btnGhost} href={cta.secondaryHref}>
                    {cta.secondaryLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {faq ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>{faq.title}</h2>
            <div className={styles.faq}>
              {faq.items.map((it, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQ}>{it.q}</summary>
                  <p className={styles.faqA}>{it.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
