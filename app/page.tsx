import Link from "next/link";
import Image from "next/image";
import s from "@/app/styles/home.module.css";
import ProductsCarousel from "@/app/components/ProductsCarousel";
import CategoriesSection from "@/app/components/CategoriesSection";
import HomeProducts from "@/app/components/HomeProducts";
import InstallationServices from "@/app/components/InstallationServices";
import WhatsAppSection from "@/app/components/WhatsAppSection";
import WhatsappCTA from "@/app/components/WhatsappCTA";
import HomeSections from "@/app/components/HomeSections";


// Define o tipo de dados de um card de categoria da home
type HomeCard = {
  title: string;   // título da categoria
  desc: string;    // descrição da categoria
  href: string;    // link para onde o card leva
  tags: string[];  // tags exibidas no card
  image?: string;  // imagem opcional
};


// Tipo para produtos (não está sendo usado atualmente)
type ProductCard = {
  title: string;
  price: string;
  href: string;
  image?: string;
  badge?: string;
};


// Lista de cards de categorias exibidos na home
// esses dados alimentam os cards da seção "Principais soluções"
const CATEGORY_CARDS: HomeCard[] = [
  {
    title: "Data Center",
    desc: "Racks, energia, cabeamento e rede. Estrutura pronta para crescer.",
    href: "/categoria/data-center",
    tags: ["Infra", "Organização", "Escalável"],
    image: "/produtos/datacenterHome.png",
  },
  {
    title: "Sistema de Segurança",
    desc: "CFTV, alarmes e controle de acesso para empresas e residências.",
    href: "/categoria/sistema-de-seguranca",
    tags: ["CFTV", "Alarmes", "Acesso"],
    image: "/produtos/sistema.png",
  },
  {
    title: "Instalação",
    desc: "Instalação profissional, organizada e testada — sem gambiarras..",
    href: "/instalacao",
    tags: ["Profissional", "Teste", "Organizado"],
    image: "/produtos/instalacaoHome.jpg",
  },
  {
    title: "Projetos",
    desc: "Projeto técnico completo: planejamento, lista de materiais e execução.",
    href: "/projetos",
    tags: ["Projeto", "Dimensionamento", "Documentação"],
    image: "/produtos/projetosHome.png",
  },
];


// Pequenos destaques exibidos abaixo do hero
const HIGHLIGHTS = [
  { title: "Atendimento rápido", desc: "Orçamento e orientação sem enrolação." },
  { title: "Solução completa", desc: "Equipamento, instalação e configuração." },
  { title: "Padrão profissional", desc: "Organização, identificação e acabamento." },
];




// Componente principal da página Home
export default function HomePage() { 

  return (

    // Elemento principal da página
    <main className={s.page}>

      {/* Banner superior da página */}
      <div className={s.bannerTop} />

    

      {/* ===== SEÇÃO DE PRODUTOS (CARROSSEL) ===== */}
      {/* 🔥 ADICIONADO shopScope AQUI */}
      <section className={`${s.productsSection} shopScope`}>
        <div className={s.productsWrapper}>

          <CategoriesSection />

          <HomeSections />

          {/* QUEBRA VISUAL */}

        </div>
      </section>

      {/* ===== HERO (primeira seção principal do site) ===== */}
      <section className={s.hero}>
        <div className={s.container}>
          <div className={s.heroGrid}>

            {/* Lado esquerdo do hero */}
            <div className={s.heroLeft}>

             

              {/* Título principal da página */}
              <h1 className={`h1 ${s.heroTitle}`}>
                <span className={s.green}>Produtos</span> e{" "}
                <span className={s.green}>Serviços</span> no mesmo lugar
              </h1>

              {/* Texto de descrição */}
              <p className={`p ${s.heroText}`}>
                Equipamentos e soluções completas em segurança eletrônica, redes e infraestrutura.
                Do projeto à instalação, com acabamento profissional.
              </p>

              {/* Botões de ação */}
              <div className={s.heroActions}>
                
                {/* Botão para ir para a loja */}
      

                {/* Botão para orçamento */}
                <Link className="btn btn-primary" href="/fale-conosco#form-orcamento">
                  Solicitar orçamento
                </Link>

                {/* Botão para WhatsApp */}
                <Link className="btn btn-primary-light" href="https://wa.me/554738423235">
                  Falar no WhatsApp
                </Link>
              </div>

              {/* Destaques rápidos */}
              <div className={s.miniRow}>
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className={s.mini}>
                    <div className={s.miniTitle}>{h.title}</div>
                    <div className={s.miniDesc}>{h.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lado direito do hero */}
            <div className={s.heroRight}>

              {/* Imagem principal do hero */}
              <div className={s.heroMedia}>
                <Image
                  src="/produtos/donoslima.png"
                  alt="Hero"
                  fill
                  className={s.heroImg}
                  priority
                />

                {/* Elementos visuais adicionais */}
                <div className={s.heroPlaceholder} />
                <div className={s.heroOverlay} />
              </div>

              {/* Card lateral com CTA */}
              <div className={s.heroSideCard}>
                <div className={s.sideTitle}>Precisa de resposta rápida?</div>
                <div className={s.sideDesc}>
                 Fale no WhatsApp, informe cidade, ambiente e necessidade, e nossa equipe orienta você imediatamente.
                </div>

                {/* Botão WhatsApp */}
                <Link className="btn btn-primary-light" href="https://wa.me/554738423235">
                  Falar agora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO DE CATEGORIAS / SOLUÇÕES ===== */}
      <section className={s.section}>
        <div className={s.container}>

          {/* Título da seção */}
          <header className={s.sectionHead}>
            <h2 className="h2">Principais soluções</h2>
            <p className="p">Áreas de atuação da Lima e Lima. Clique em cada uma para conhecer os detalhes.</p>
          </header>

          {/* Grid de cards */}
          <div className={s.grid4}>
            {CATEGORY_CARDS.map((c) => (
              <Link key={c.title} href={c.href} className={s.card}>

                {/* Imagem do card */}
                <div className={s.thumb}>
                  {c.image ? (
                    <Image src={c.image} alt={c.title} fill className={s.thumbImg} />
                  ) : (
                    <span className={s.thumbPlaceholder}>IMAGEM AQUI</span>
                  )}

                  {/* Overlay escuro da imagem */}
                  <div className={s.thumbOverlay} />
                </div>

                {/* Conteúdo do card */}
                <div className={s.cardBody}>

                  {/* Título */}
                  <h3 className={s.cardTitle}>{c.title}</h3>

                  {/* Descrição */}
                  <p className="p">{c.desc}</p>

                  {/* Tags */}
                  <div className={s.tags}>
                    {c.tags.map((t) => (
                      <span key={t} className="badge">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* CTA do card */}
                  <div className={s.cardCta}>Ver mais →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO DE SERVIÇOS ===== */}
      <section className={s.sectionAlt}>
        <div className={s.container}>
          <div className={s.split}>

            <div>
              <h2 className="h2">Serviço completo (do projeto à instalação)</h2>

              <p className="p">
                A gente cuida de tudo para sua solução ficar estável, organizada, bonita e fácil de manter.
              </p>

              <ul className={s.list}>
                <li>Levantamento e orientação (o que realmente vale a pena para o seu caso)</li>
                <li>Projeto e dimensionamento (carga, pontos e retenção de imagens)</li>
                <li>Instalação organizada (rack, identificação e acabamento)</li>
                <li>Configuração, testes e suporte para futuras expansões</li>
              </ul>

              <div className={s.actionsRow}>
                <Link className="btn btn-primary-light" href="/projetos">
                  Ver Projetos
                </Link>

                <Link className="btn btn-outline-light" href="/instalacao">
                  Ver Instalação
                </Link>
              </div>
            </div>

            <div className={s.mediaBox}>
              <div className={s.mediaImgWrap}>
                <Image
                  src="/produtos/srvicocompleto.JPG"
                  alt="Equipe / instalação"
                  fill
                  className={s.mediaImg}
                  sizes="(max-width: 980px) 92vw, 520px"
                  priority={false}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    

      {/* ===== CTA FINAL ===== */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.cta}>

            <div>
              <h2 className="h2">Quer um orçamento rápido?</h2>

              <p className="p">
               Mande sua cidade, o tipo de ambiente e o objetivo (monitorar, controle de acesso, alarme ou rede).
              </p>
            </div>

            <div className={s.ctaActions}>
              <Link className="btn btn-primary-light" href="https://wa.me/554738423235">
                Chamar no WhatsApp
              </Link>

              <Link className="btn btn-outline-light" href="/quem-somos">
                Quem somos
              </Link>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}