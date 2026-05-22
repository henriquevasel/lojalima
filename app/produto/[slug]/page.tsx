import { prisma } from "@/app/lib/prisma";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductImage from "@/app/components/ProductImage";
import s from "@/app/styles/product.module.css";
import ProductGallery from "@/app/components/ProductGallery";
import FreteCalculator from "@/app/components/FreteCalculator";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import Link from "next/link";
import { getFinalPrice } from "@/app/lib/price";


import { CreditCard, QrCode, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export default async function ProdutoPage({ params }: any) {

  const { slug } = await params;

 const produto = await prisma.product.findUnique({
  where: { slug },
include: {

  promotion: true,

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

    
    productcategory: produto.productcategory?.length
      ? {
          some: {
            categoryId: produto.productcategory[0].categoryId
          }
        }
      : undefined
  },

  include: {
    productimage: {
      orderBy: {
        sortOrder: "asc"
      }
    }
  },

  take: 4,
});

const precoOriginalCents =
  calcularPrecoVenda(produto.priceCents);

const precoFinalCents =
  getFinalPrice({
    ...produto,
    priceCents: precoOriginalCents,
  });

const hasPromotion =
  precoFinalCents < precoOriginalCents;

const preco =
  precoOriginalCents / 100;

const precoFinal =
  precoFinalCents / 100;

// desconto PIX
const descontoPix =
  Math.round(precoFinal * 0.05 * 100) / 100;

const precoPix =
  precoFinal - descontoPix;

  const WHATSAPP_LINK =
    "https://wa.me/554738423235?text=" +
    encodeURIComponent(
      `Olá! Quero informações sobre o produto: ${produto.name}`
    );

    const descricaoLimpa = (produto.description || "")
  .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");

  return (
    <div className="lightTheme">
    <div className={s.page}>

      <div className={s.grid}>

        {/* IMAGEM */}

        <div className={s.imageWrap}>

<ProductGallery
  images={
    produto.productimage.length > 0
      ? produto.productimage
      : [
          {
            url: "/produtos/placeholder.jpg",
          },
        ]
  }
  name={produto.name}
/>

        </div>


        {/* INFORMAÇÕES */}

        <div style={{ minWidth: 0 }}>

         <h1 className={s.title}>
            {produto.name}
          </h1>


{/* PREÇO + PAGAMENTO */}

<div style={{ marginBottom: 20 }}>

 

{/* preço antigo */}
{hasPromotion && (
  <div
    style={{
      color: "#999",
      fontSize: 20,
      textDecoration: "line-through",
      marginBottom: 6,
      fontWeight: 500,
    }}
  >
    {preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </div>
)}

{/* preço principal */}
<div
  style={{
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: 6,
  }}
>
  <span style={{ color: "#111" }}>
    {precoFinal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </span>

  <span
    style={{
      fontSize: 18,
      marginLeft: 8,
      color: "#555",
      fontWeight: 500,
    }}
  >
    à vista
  </span>
</div>

{/* badge OFF */}
{hasPromotion && produto.promotion && (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "#16a34a",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 10,
    }}
  >
    {produto.promotion.discountValue}% OFF
  </div>
)}

{hasPromotion && (
  <div
    style={{
      fontSize: 14,
      color: "#666",
      marginTop: 6,
      marginBottom: 10,
    }}
  >
    De{" "}
    <strong>
      {preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </strong>{" "}
    por{" "}
    <strong>
      {precoFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </strong>
  </div>
)}
  

  {/* parcelamento */}

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
          {precoPix.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
          no boleto
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Economize{" "}
          {descontoPix.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
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
          {precoPix.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
          no pix
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
          5% OFF adicional no PIX
        </div>
      </div>
    </div>
    <div
  style={{
    fontSize: 14,
    marginTop: 8,
    color: "#444",
  }}
>
  ou em até{" "}
  <strong>
    3x de{" "}
    {(precoFinal / 3).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </strong>{" "}
  sem juros
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
  className={s.whatsappBtn}
>
  Falar com especialista no WhatsApp
</a>


       


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

         {/* DESCRIÇÃO */}
<div className={s.description}>

  <h3 style={{ marginBottom: 10 }}>
    Descrição
  </h3>

  <div
    style={{
      opacity: 0.9,
      
    }}
   dangerouslySetInnerHTML={{
  __html:
    descricaoLimpa ||
    "Produto profissional com alto desempenho.",
}}
  />

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

const img =
  p.productimage?.[0]?.url ||
  "/produtos/placeholder.jpg";

      return (
        <Link
          key={p.id}
          href={`/produto/${p.slug}`}
          style={{ textDecoration: "none" }}
        >
          <div
  className={s.relatedCard}
  style={{
    padding: 18,
    borderRadius: 22,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>

  <div className={s.relatedImageWrap}>
    <img
      src={img}
      alt={p.name}
      className={s.relatedImage}
    />
  </div>

<div className={s.relatedContent}>

  <div
    style={{
      fontSize: 12,
      color: "#9ca3af",
      textTransform: "uppercase",
      marginBottom: 8,
      fontWeight: 600,
    }}
  >
    INTELBRAS
  </div>

  <div className={s.relatedTitle}>
    {p.name}
  </div>

  <div
    style={{
      fontSize: 14,
      color: "#666",
      marginTop: 8,
      lineHeight: 1.5,
      minHeight: 42,
    }}
  >
    {(p.description || "Produto profissional de alta qualidade.")
      .replace(/<[^>]+>/g, "")
      .slice(0, 70)}
    ...
  </div>

  <div
    style={{
      color: "#16a34a",
      fontSize: 34,
      fontWeight: 800,
      marginTop: 16,
    }}
  >
    {(
      calcularPrecoVenda(p.priceCents) / 100
    ).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}
  </div>

  <div
    style={{
      marginTop: 6,
      color: "#888",
      fontSize: 14,
    }}
  >
    3x de{" "}
    {(
      calcularPrecoVenda(p.priceCents) /
      100 /
      3
    ).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}{" "}
    sem juros
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