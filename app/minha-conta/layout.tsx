```tsx
import Link from "next/link";
import s from "@/app/styles/account.module.css";

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={s.wrapper}>
      {/* SIDEBAR */}
      <aside className={s.sidebar}>
        <h2 className={s.sidebarTitle}>
          Minha conta
        </h2>

        <nav className={s.sidebarNav}>
          <Link
            href="/minha-conta"
            className={s.sidebarLink}
          >
            Início
          </Link>

          <Link
            href="/meus-pedidos"
            className={s.sidebarLink}
          >
            Meus pedidos
          </Link>

          <Link
            href="/minha-conta/dados"
            className={s.sidebarLink}
          >
            Meus dados
          </Link>

          <Link
            href="/minha-conta/seguranca"
            className={s.sidebarLink}
          >
            Segurança
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className={s.content}>
        {children}
      </main>
    </div>
  );
}
```
