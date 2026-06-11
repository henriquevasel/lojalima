import { FaStar, FaQuoteLeft } from "react-icons/fa";
import s from "@/app/styles/home.module.css";

export default function CustomerReviews() {
  return (
    <section className={s.reviewSection}>

      <div className={s.reviewHeader}>
        <span className={s.reviewBadge}>
          ⭐ Avaliações de Clientes
        </span>

        <h2>Quem compra recomenda</h2>

        <p>
          Centenas de clientes já confiaram na Lima e Lima para proteger
          residências, empresas e comércios.
        </p>
      </div>

      <div className={s.reviewGrid}>

        <div className={s.reviewCard}>
          <FaQuoteLeft className={s.quoteIcon} />

          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Atendimento excelente. Tiraram todas as dúvidas e me ajudaram a escolher a câmera ideal para minha residência.
          </p>

          <div className={s.reviewAuthor}>
            <strong>João M.</strong>
            <span>Jaraguá do Sul - SC</span>
          </div>
        </div>

        <div className={s.reviewCard}>
          <FaQuoteLeft className={s.quoteIcon} />

          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Produtos originais, entrega rápida e suporte muito prestativo. Voltarei a comprar.
          </p>

          <div className={s.reviewAuthor}>
            <strong>Marcelo R.</strong>
            <span>Joinville - SC</span>
          </div>
        </div>

        <div className={s.reviewCard}>
          <FaQuoteLeft className={s.quoteIcon} />

          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Instalação organizada e acabamento impecável. Serviço profissional do início ao fim.
          </p>

          <div className={s.reviewAuthor}>
            <strong>Empresa Cliente</strong>
            <span>Santa Catarina</span>
          </div>
        </div>

      </div>

    </section>
  );
}