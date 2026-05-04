import { prisma } from "@/app/lib/prisma";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductImage from "@/app/components/ProductImage";
import s from "@/app/styles/product.module.css";
import ProductGallery from "@/app/components/ProductGallery";
import FreteCalculator from "@/app/components/FreteCalculator";
import { calcularPrecoVenda } from "@/app/lib/pricing";
import Link from "next/link";
import { productsWithImage } from "@/app/lib/productsWithImage";

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


{/* PREÇO COMPLETO ESTILO LOJA */}

<div style={{ marginBottom: 20 }}>

  {/* preço antigo */}
  <div style={{ textDecoration: "line-through", color: "#999", fontSize: 14 }}>
    R$ {(preco * 1.2).toFixed(2)}
  </div>

  {/* preço principal */}
  <div style={{ fontSize: 28, fontWeight: 900 }}>
    por <span style={{ color: "#111" }}>R$ {preco.toFixed(2)}</span>
  </div>

  {/* parcelamento */}
  <div style={{ fontSize: 14, marginTop: 5 }}>
    até <strong>3x de R$ {(preco / 3).toFixed(2)}</strong> sem juros
  </div>

  {/* boleto */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "#e6f4ea",
      padding: "10px 12px",
      borderRadius: 6,
      marginTop: 10,
      fontSize: 14,
    }}
  >
    <span style={{ fontSize: 18 }}>💳</span>
    <div>
      <strong style={{ color: "#2e7d32" }}>
        R$ {(preco - (Math.round(preco * 0.05 * 100) / 100)).toFixed(2)} no Boleto
      </strong>
      <div style={{ fontSize: 12 }}>
        Economize R$ {(Math.round(preco * 0.05 * 100) / 100).toFixed(2)}
      </div>
    </div>
  </div>

  {/* pix */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "#f1f5f9",
      padding: "10px 12px",
      borderRadius: 6,
      marginTop: 8,
      fontSize: 14,
    }}
  >
    <span style={{ fontSize: 18 }}>🔰</span>
    <div>
      <strong>
        R$ {(preco - (Math.round(preco * 0.05 * 100) / 100)).toFixed(2)} no pix
      </strong>
      <span
        style={{
          marginLeft: 6,
          background: "#22c55e",
          color: "#fff",
          fontSize: 11,
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        5% OFF
      </span>
      <div style={{ fontSize: 12 }}>
        Pague com pix e economize
      </div>
    </div>
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