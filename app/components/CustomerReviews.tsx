import { FaStar } from "react-icons/fa";
import s from "@/app/styles/home.module.css";

export default function CustomerReviews() {
  return (
    <section className={s.reviewSection}>

      <div className={s.reviewHeader}>
        <h2>O que nossos clientes dizem</h2>
        <p>
          Soluções em segurança eletrônica com atendimento especializado.
        </p>
      </div>

      <div className={s.reviewGrid}>

        <div className={s.reviewCard}>
          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Atendimento excelente, tiraram todas as dúvidas e ajudaram na escolha dos equipamentos.
          </p>

          <strong>Cliente Google</strong>
        </div>

        <div className={s.reviewCard}>
          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Produtos originais, entrega rápida e suporte muito prestativo.
          </p>

          <strong>Cliente Loja Online</strong>
        </div>

        <div className={s.reviewCard}>
          <div className={s.reviewStars}>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p>
            Instalação organizada e serviço profissional. Recomendo.
          </p>

          <strong>Cliente Corporativo</strong>
        </div>

      </div>

    </section>
  );
}