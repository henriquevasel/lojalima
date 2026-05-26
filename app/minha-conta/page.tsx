import Link from "next/link";
import s from "@/app/styles/account.module.css";

export default function MinhaContaPage() {
  return (
    <div>
      <h1 className={s.title}>
        Minha conta
      </h1>

      <p className={s.subtitle}>
        Gerencie seus dados e acompanhe seus pedidos.
      </p>

      <div className={s.grid}>
        <Link
          href="/meus-pedidos"
          className={s.card}
        >
          <h3 className={s.cardTitle}>
            Meus pedidos
          </h3>

          <p className={s.cardText}>
            Acompanhe pedidos, entregas e histórico.
          </p>
        </Link>

        <Link
          href="/minha-conta/dados"
          className={s.card}
        >
          <h3 className={s.cardTitle}>
            Meus dados
          </h3>

          <p className={s.cardText}>
            Atualize suas informações pessoais.
          </p>
        </Link>

        <Link
          href="/minha-conta/seguranca"
          className={s.card}
        >
          <h3 className={s.cardTitle}>
            Segurança
          </h3>

          <p className={s.cardText}>
            Altere sua senha e proteja sua conta.
          </p>
        </Link>
      </div>
    </div>
  );
}