import { prisma } from "@/app/lib/prisma";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductImage from "@/app/components/ProductImage";
import s from "@/app/styles/product.module.css";
import ProductGallery from "@/app/components/ProductGallery";
import FreteCalculator from "@/app/components/FreteCalculator";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import Link from "next/link";
import { productsWithImage } from "@/app/lib/productsWithImage";
import { CreditCard, QrCode, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export default async function ProdutoPage({ params }: any) {

  const { slug } = await params;

 const produto = await prisma.product.findUnique({
  where: { slug },
  include: {
    productimage: {
      orderBy: {
        sortOrder: "asc"
      }
    },
    productcategory: true
  }
});

  if (!produto) {
    return (
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 20px",
          color: "var(--text)"
        }}
      >
        <h2>Produto não encontrado</h2>
        <p>
          Slug recebido: <b>{slug}</b>
        </p>
      </div>
    );
  }

  /* =========================
  PRODUTOS RELACIONADOS
  ========================= */

 const relacionados = await prisma.product.findMany({
  where: {
    active: true,
    id: { not: produto.id },

    sku: {
      in: productsWithImage
    },

    productcategory: produto.productcategory?.length
      ? {
          some: {
            categoryId: produto.productcategory[0].categoryId
          }
        }
      : undefined
  },
  take: 4,
});

  const precoCents = calcularPrecoVenda(produto.priceCents);
  const preco = precoCents / 100;
  const precoParcelado = (preco / 12).toFixed(2);
  const desconto = Math.round(preco * 0.05 * 100) / 100;
  const precoComDesconto = preco - desconto;

  const WHATSAPP_LINK =
    "https://wa.me/554738423235?text=" +
    encodeURIComponent(
      `Olá! Quero informações sobre o produto: ${produto.name}`
    );

  return (
    <div className="lightTheme">
    <div className={s.page}>

      <div className={s.grid}>

        {/* IMAGEM */}

        <div className={s.imageWrap}>

  <ProductGallery
  images={[1,2,3,4].map(i => ({
    url: `/produtos/${produto.sku}-${i}.png`
  }))}
  name={produto.name}
/>

        </div>


        {/* INFORMAÇÕES */}

        <div>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {produto.name}
          </h1>


{/* PREÇO + PAGAMENTO */}

<div style={{ marginBottom: 20 }}>

  {/* preço antigo */}
  <div style={{ textDecoration: "line-through", color: "#999", fontSize: 13 }}>
    R$ {(preco * 1.2).toFixed(2)}
  </div>

  {/* preço atual */}
  <div style={{ fontSize: 28, fontWeight: 900 }}>
    por <span style={{ color: "#111" }}>R$ {preco.toFixed(2)}</span>
  </div>

  {/* parcelamento */}
  <div style={{ fontSize: 13, marginTop: 4 }}>
    até <strong>3x de R$ {(preco / 3).toFixed(2)}</strong> sem juros
  </div>

  {/* BOX PAGAMENTOS */}
  <div
    style={{
      marginTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >

    {/* boleto */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#eaf7ef",
        padding: "10px 12px",
        borderRadius: 8,
      }}
    >
      <CreditCard size={18} color="#2e7d32" />

      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2e7d32" }}>
          R$ {precoComDesconto.toFixed(2)} no boleto
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Economize R$ {desconto.toFixed(2)}
        </div>
      </div>
    </div>

    {/* pix */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#f4f6f8",
        padding: "10px 12px",
        borderRadius: 8,
      }}
    >
      <QrCode size={18} color="#22c55e" />

      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          R$ {precoComDesconto.toFixed(2)} no pix
          <span
            style={{
              marginLeft: 6,
              background: "#22c55e",
              color: "#fff",
              fontSize: 10,
              padding: "2px 6px",
              borderRadius: 4,
              fontWeight: 700,
            }}
          >
            5% OFF
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Pagamento instantâneo
        </div>
      </div>
    </div>

  </div>

</div>

{/* BENEFÍCIOS MELHORADOS */}

<div
  style={{
    margin: "20px 0",
    padding: 16,
    borderRadius: 12,
    background: "var(--soft)",
    border: "1px solid var(--border)",
    display: "grid",
    gap: 8,
    fontSize: 13,
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <BadgeCheck size={16} /> Produto original com nota fiscal
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <ShieldCheck size={16} /> Garantia de 12 meses
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <BadgeCheck size={16} /> Suporte especializado
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <Truck size={16} /> Envio rápido e seguro
  </div>
</div>

          {/* BENEFÍCIOS */}

          <div
            style={{
              margin: "25px 0",
              padding: 20,
              borderRadius: 18,
              background: "var(--soft)",
              border: "1px solid var(--border)",
              display: "grid",
              gap: 10,
              fontSize: 14,
            }}
          >
            <div>✔ Produto original com nota fiscal</div>
            <div>✔ Garantia de 12 meses</div>
            <div>✔ Suporte especializado</div>
            <div>✔ Envio rápido e seguro</div>
          </div>


          {/* BOTÃO COMPRAR */}

          <div style={{ marginBottom: 20 }}>
            <AddToCartButton productId={produto.id} />
          </div>

            <FreteCalculator />

          {/* BOTÃO WHATSAPP */}

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "18px",
              borderRadius: 18,
              background: "#00A94F",
              color: "#000",
              fontWeight: 900,
              textDecoration: "none",
              fontSize: 16,
              marginBottom: 40,
            }}
          >
            Falar com especialista no WhatsApp
          </a>


          {/* DESCRIÇÃO */}

          <div style={{ marginBottom: 40 }}>

            <h3 style={{ marginBottom: 10 }}>
              Descrição
            </h3>

            <p style={{ opacity: 0.85, lineHeight: 1.7 }}>
              {produto.description ||
                "Produto profissional com alto desempenho, ideal para aplicações residenciais e comerciais. Excelente custo-benefício e fácil instalação."}
            </p>

          </div>


          {/* BLOCO CONFIANÇA */}

          <div
            style={{
              padding: 20,
              borderRadius: 20,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.3)",
              fontSize: 14,
            }}
          >
            🔒 Compra 100% segura <br />
            🚚 Entrega rápida <br />
            🛠 Instalação profissional disponível
          </div>

        </div>

      </div>



      {/* =========================
      PRODUTOS RELACIONADOS
      ========================= */}

      
<div className={s.relatedSection}>
  <h2 className={s.relatedTitle}>
    Você também pode gostar
  </h2>

  <div className={s.relatedGrid} >
    {relacionados.map((p) => {

    const img = p.sku
  ? `/produtos/${p.sku}-1.png`
  : "/produtos/placeholder.jpg";

      return (
        <Link
          key={p.id}
          href={`/produto/${p.slug}`}
          style={{ textDecoration: "none" }}
        >
          <div className={s.relatedCard}>

  <div className={s.relatedImageWrap}>
    <img
      src={img}
      alt={p.name}
      className={s.relatedImage}
    />
  </div>

  <div className={s.relatedContent}>

    <div className={s.relatedTitle}>
      {p.name}
    </div>

    <div className={s.relatedPrice}>
      R$ {(calcularPrecoVenda(p.priceCents) / 100).toFixed(2)}
    </div>

  </div>

</div>
        </Link>
      );
    })}
  </div>
</div>

    </div>
  </div>
  );

}