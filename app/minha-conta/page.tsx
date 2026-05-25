
export default function MinhaContaPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        background: "#050505",
        color: "#fff",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 10,
        }}
      >
        Minha conta
      </h1>

      <p
        style={{
          color: "#999",
          marginBottom: 30,
        }}
      >
        Gerencie seus dados e acompanhe seus pedidos.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <a
          href="/meus-pedidos"
          style={{
            background: "#111",
            borderRadius: 20,
            padding: 25,
            textDecoration: "none",
            color: "#fff",
            border: "1px solid #1f1f1f",
          }}
        >
          <h3>Meus pedidos</h3>
          <p style={{ color: "#888" }}>
            Veja todos os seus pedidos
          </p>
        </a>

        <a
          href="/minha-conta/dados"
          style={{
            background: "#111",
            borderRadius: 20,
            padding: 25,
            textDecoration: "none",
            color: "#fff",
            border: "1px solid #1f1f1f",
          }}
        >
          <h3>Meus dados</h3>
          <p style={{ color: "#888" }}>
            Atualize suas informações
          </p>
        </a>

        <a
          href="/minha-conta/seguranca"
          style={{
            background: "#111",
            borderRadius: 20,
            padding: 25,
            textDecoration: "none",
            color: "#fff",
            border: "1px solid #1f1f1f",
          }}
        >
          <h3>Segurança</h3>
          <p style={{ color: "#888" }}>
            Altere sua senha
          </p>
        </a>
      </div>
    </div>
  );
}
