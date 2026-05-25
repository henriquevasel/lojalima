
import Link from "next/link";

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        display: "flex",
        gap: 30,
        padding: 40,
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          background: "#111",
          borderRadius: 20,
          padding: 20,
          height: "fit-content",
          border: "1px solid #1f1f1f",
        }}
      >
        <h2
          style={{
            marginBottom: 25,
            fontSize: 22,
          }}
        >
          Minha conta
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Link
            href="/minha-conta"
            style={linkStyle}
          >
            Início
          </Link>

          <Link
            href="/meus-pedidos"
            style={linkStyle}
          >
            Meus pedidos
          </Link>

          <Link
            href="/minha-conta/dados"
            style={linkStyle}
          >
            Meus dados
          </Link>

          <Link
            href="/minha-conta/seguranca"
            style={linkStyle}
          >
            Segurança
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main
        style={{
          flex: 1,
          background: "#111",
          borderRadius: 20,
          padding: 30,
          border: "1px solid #1f1f1f",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const linkStyle = {
  padding: "14px 16px",
  borderRadius: 12,
  background: "#1a1a1a",
  color: "#fff",
  textDecoration: "none",
  transition: "0.2s",
};

