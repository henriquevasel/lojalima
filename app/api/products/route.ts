import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { calcularPrecoVenda } from "@/app/lib/pricing";


export async function GET(req: Request) {

try {

const { searchParams } = new URL(req.url);
const page = Number(searchParams.get("page") || 1);
const limit = Number(searchParams.get("limit") || 20);
const sort = searchParams.get("sort");
const search = searchParams.get("q") || searchParams.get("search");
const category = searchParams.get("category");
console.log("URL:", req.url);
console.log("SEARCH PARAM Q:", searchParams.get("q"));

const min = searchParams.get("min");
const max = searchParams.get("max");

/* =========================
ORDER BY DINÂMICO
========================= */

let orderBy: any = { createdAt: "desc" };

if (sort === "price_asc") {
  orderBy = { priceCents: "asc" };
}

if (sort === "price_desc") {
  orderBy = { priceCents: "desc" };
}

if (sort === "recent") {
  orderBy = { createdAt: "desc" };
}

/* =========================
FILTROS
========================= */

const where: any = {
  active: true,
};

where.productimage = {
  some: {
    url: {
      not: "",
    },
  },
};

/* busca */

if (search) {
  const terms = search.split(" ").filter(t => t.length > 1);

  where.AND = [
    ...(where.AND || []),

    ...terms.map(term => ({
      OR: [
        {
          name: {
            contains: term,
            
          },
        },
        {
          slug: {
            contains: term,
            
          },
        },
        {
          brand: {
            contains: term,
            
          },
        },
        {
          productcategory: {
            some: {
              category: {
                name: {
                  contains: term,
                  
                },
              },
            },
          },
        },
      ],
    })),
  ];
}

/* categoria */

if (category) {
where.productcategory = {
  some: {
    category: {
      slug: category,
    },
  },
};
}

/* preço */

if (min || max) {
  where.priceCents = {};

  if (min) {
    where.priceCents.gte = Number(min) * 100;
  }

  if (max) {
    where.priceCents.lte = Number(max) * 100;
  }
}

/* =========================
QUERY
========================= */

const products = await prisma.product.findMany({
  where,

  include: {
    productimage: {
      orderBy: {
        sortOrder: "asc",
      },
      take: 1,
    },
  },

  orderBy,

  skip: (page - 1) * limit, // 🔥 PAGINAÇÃO
  take: limit,              // 🔥 LIMITE
});


const productsWithPrice = products.map((p) => ({
  ...p,
  priceCentsOriginal: p.priceCents,
  priceCents: calcularPrecoVenda(p.priceCents),
}));

return NextResponse.json(productsWithPrice);


} catch (error) {


console.error("Erro ao buscar produtos", error);

return NextResponse.json(
  { error: "Erro ao buscar produtos" },
  { status: 500 }
);


}

}
