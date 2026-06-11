import {
  FaUsers,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import s from "@/app/styles/home.module.css";

export default function CompanyStats() {
  return (
    <section className={s.statsSection}>

      <div className={s.statItem}>
        <FaUsers className={s.statIcon} />

        <div>
          <strong>+500</strong>
          <span>Clientes atendidos</span>
        </div>
      </div>

      <div className={s.statItem}>
        <FaShieldAlt className={s.statIcon} />

        <div>
          <strong>+1000</strong>
          <span>Equipamentos instalados</span>
        </div>
      </div>

      <div className={s.statItem}>
        <FaCalendarAlt className={s.statIcon} />

        <div>
          <strong>+8 anos</strong>
          <span>de experiência</span>
        </div>
      </div>

    </section>
  );
}