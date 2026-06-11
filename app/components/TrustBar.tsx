import {
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaTools,
} from "react-icons/fa";

import s from "@/app/styles/home.module.css";

export default function TrustBar() {
  return (
    <section className={s.trustBar}>
      <div className={s.trustItem}>
        <FaShieldAlt className={s.trustIcon} />

        <div>
          <strong>Compra Segura</strong>
          <span>Seus dados protegidos</span>
        </div>
      </div>

      <div className={s.trustItem}>
        <FaTruck className={s.trustIcon} />

        <div>
          <strong>Entrega Rápida</strong>
          <span>Para todo Brasil</span>
        </div>
      </div>

      <div className={s.trustItem}>
        <FaHeadset className={s.trustIcon} />

        <div>
          <strong>Suporte Especializado</strong>
          <span>Antes e após a compra</span>
        </div>
      </div>

      <div className={s.trustItem}>
        <FaTools className={s.trustIcon} />

        <div>
          <strong>Instalação Profissional</strong>
          <span>Técnicos qualificados</span>
        </div>
      </div>
    </section>
  );
}