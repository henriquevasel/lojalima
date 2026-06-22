import Image from "next/image";
import Link from "next/link";
import s from "@/app/styles/quem-somos.module.css";

export default function QuemSomosPage() {
  return (
    <main className={s.page}>
      {/* ===== BANNER TOPO (SEM TEXTO EM CIMA) ===== */}
      <section className={s.banner}>
        <Image
          src="/produtos/bannerQuemSomos.jpeg"
          alt="Empresa e atendimento"
          fill
          priority
          className={s.bannerImg}
          sizes="100vw" 
        />
        <div className={s.bannerOverlay} />
      </section>

      {/* HERO ABAIXO DO BANNER */}
      <section className={s.hero}>
        <div className={s.container}>
          <span className={s.badge}>Sobre a empresa</span>
          <h1 className={s.h1}>Quem somos</h1>
          <p className={s.subtitle}>Somos especialistas em soluções de tecnologia e segurança, oferecendo atendimento próximo, transparente e de confiança para residências e empresas.</p>

          <div className={s.actions}>
            <Link className={`btn btn-primary ${s.btnPrimary}`} href="/fale-conosco#form-orcamento">
              Fale Conosco
            </Link>

            {/* Mantive, mas se sua rota /categoria/cameras não existe, comenta esse botão */}
            <Link className={`btn btn-outline ${s.btnGhost}`} href="/categoria/cameras">
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NOSSA HISTÓRIA ===== */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.split}>
            <div className={s.textCol}>
              <h2 className={s.h2}>Nossa história</h2>

              <p className={s.p}>
                Com mais de 11 anos de experiência, a Lima e Lima, localizada em Jaraguá do Sul
                e fundada em 2014, iniciou suas atividades com muito trabalho, dedicação e o
                compromisso de oferecer sempre o melhor aos seus clientes. 
              </p>

               <p className={s.p}>
                Desde o início, buscamos a excelência por meio da utilização das tecnologias mais modernas e
                eficientes do mercado.
              </p>

              <p className={s.p}>
                Atualmente, contamos com uma carteira de aproximadamente 450 clientes ativos,
                conquistados graças ao nosso alto padrão de qualidade em atendimento,
                instalação e suporte técnico.
              </p>

              <p className={s.p}>
                Sempre atentos às inovações do setor, investimos continuamente em equipamentos,
                técnicas e treinamento da nossa equipe, garantindo soluções cada vez mais
                seguras, modernas e confiáveis.
              </p>

              <div className={s.stats}>
                <div className={s.stat}>
                  <div className={s.statNum}>+11 anos</div>
                  <div className={s.statLbl}>Experiência</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statNum}>2014</div>
                  <div className={s.statLbl}>Fundação</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statNum}>+500</div>
                  <div className={s.statLbl}>Clientes ativos</div>
                </div>
              </div>
            </div>

            {/* IMAGEM DO LADO */}
            <div className={s.imgBoxContain}>
              <Image
                src="/produtos/quemsomos.png"
                alt="Lima e Lima - equipe e frota"
                fill
                className={s.imgContain}
                sizes="(max-width: 980px) 92vw, 520px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PILARES ===== */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <header className={s.sectionHead}>
            <h2 className={s.h2}>Nossos pilares</h2>
            <p className={s.p}>O que guia nosso trabalho no dia a dia.</p>
          </header>

          <div className={s.grid3}>
            <article className={s.pillarCard}>
              <div className={s.pillarThumb}>
                <Image
                  src="/produtos/missao.png"
                  alt="Missão"
                  fill
                  className={s.pillarImg}
                  sizes="(max-width: 980px) 92vw, 380px"
                />
                <div className={s.thumbOverlay} />
              </div>
              <div className={s.pillarBody}>
                <h3 className={s.pillarTitle}>MISSÃO</h3>
                <p className={s.pillarText}>
                  Fornecer serviços de monitoramento e segurança com qualidade, ética
                  profissional e tecnologia, buscando sempre a satisfação, a tranquilidade e o
                  bem-estar de nossos clientes.
                </p>
              </div>
            </article>

            <article className={s.pillarCard}>
              <div className={s.pillarThumb}>
                <Image
                  src="/produtos/visao.png"
                  alt="Visão"
                  fill
                  className={s.pillarImg}
                  sizes="(max-width: 980px) 92vw, 380px"
                />
                <div className={s.thumbOverlay} />
              </div>
              <div className={s.pillarBody}>
                <h3 className={s.pillarTitle}>VISÃO</h3>
                <p className={s.pillarText}>
                  Ser referência no setor de segurança e monitoramento na região em que atuamos,
                  destacando-nos pela inovação, qualidade no atendimento e preços justos, sempre
                  focados na satisfação do cliente.
                </p>
              </div>
            </article>

            <article className={s.pillarCard}>
              <div className={s.pillarThumb}>
                <Image
                  src="/produtos/valores.png"
                  alt="Valores"
                  fill
                  className={s.pillarImg}
                  sizes="(max-width: 980px) 92vw, 380px"
                />
                <div className={s.thumbOverlay} />
              </div>
              <div className={s.pillarBody}>
                <h3 className={s.pillarTitle}>VALORES</h3>
                <p className={s.pillarText}>
                  Responsabilidade, ética, confiança, respeito e comprometimento com clientes,
                  colaboradores e fornecedores.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.cta}>
            <div>
              <h2 className={s.h2}>Quer falar com a gente?</h2>
              <p className={s.p}>Estamos prontos para tirar suas dúvidas e orientar você na melhor solução.</p>
            </div>

            <div className={s.actions}>
              <Link className={`btn btn-primary ${s.btnPrimary}`} href="/fale-conosco#form-orcamento">
                Fale Conosco
              </Link>

              {/* Se quiser manter 2 botões no CTA final, descomenta */}
              {/* <Link className={s.btnGhost} href="/categoria/cameras">
                Ver Produtos
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
