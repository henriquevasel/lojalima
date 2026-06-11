import { FaShieldAlt, FaTools, FaWhatsapp } from "react-icons/fa";
import s from "@/app/styles/HomeBreakSection.module.css";

export default function HomeBreakSection() {
  return (
    <section className={s.wrapper}>

      <div className={s.content}>

        <div className={s.left}>
          <span className={s.badge}>
            Segurança Profissional
          </span>

        <h2>
  Soluções completas em segurança eletrônica.
</h2>

          <p>
            Trabalhamos com soluções completas para residências,
            empresas e comércios.
          </p>
        </div>

        <div className={s.items}>

          <div>
            <FaShieldAlt />
            <span>Produtos Originais</span>
          </div>

          <div>
            <FaTools />
            <span>Instalação Especializada</span>
          </div>

          <div>
            <FaWhatsapp />
            <span>Suporte Rápido</span>
          </div>

        </div>

      </div>

    </section>
  );
}