import Link from "next/link";
import Image from "next/image";
import s from "@/app/styles/home.module.css";
import CategoriesSection from "@/app/components/CategoriesSection";
import HomeProducts from "@/app/components/HomeProducts";
import HomeBannerCarousel from "@/app/components/HomeBannerCarousel";
import { Suspense } from "react";



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
    desc: "Instalação profissional, organizada,  testada e sem gambiarras.",
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
      <HomeBannerCarousel />

    

      {/* ===== SEÇÃO DE PRODUTOS (CARROSSEL) ===== */}
      {/* 🔥 ADICIONADO shopScope AQUI */}
      <section className={`${s.productsSection} shopScope`}>
        <div className={s.productsWrapper}>

          <CategoriesSection />

          
          <Suspense>
            <HomeProducts />
          </Suspense>

          {/* QUEBRA VISUAL */}

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
                   <Image
  src={c.image}
  alt={c.title}
  fill
  className={s.thumbImg}
  sizes="(max-width: 768px) 100vw, 25vw"
  quality={75}
/>
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

  <a
  href="https://wa.me/554738423235"
  target="_blank"
  rel="noopener noreferrer"
  className="floatingWhats"
  aria-label="WhatsApp"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.8 11.8 0 0 0 12.07 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.6 5.97L0 24l6.29-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.47-8.44zM12.08 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.73.97 1-3.63-.24-.37a9.8 9.8 0 0 1-1.51-5.28c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.96 2.88a9.79 9.79 0 0 1 2.88 6.95c0 5.42-4.41 9.84-9.83 9.84zm5.39-7.36c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.08-.29-.15-1.24-.46-2.35-1.48-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.91-2.18-.24-.57-.49-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-.1 2.44.93 1.44 2.66 3.56 6.43 4.99.89.31 1.58.5 2.12.64.89.22 1.69.19 2.33.12.71-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34z"/>
  </svg>
</a>

    </main>
  );
}