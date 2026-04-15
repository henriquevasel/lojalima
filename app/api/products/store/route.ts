import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

const { searchParams } = new URL(req.url);

const category = searchParams.get("category");
const search = searchParams.get("search");
const sort = searchParams.get("sort");
const page = Number(searchParams.get("page") || "1");
const take = 24;
const skip = (page - 1) * take;
const min = searchParams.get("min");    
const max = searchParams.get("max");

const where: any = {
active: true
};

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
if (category) {
where.categories = {
some: {
category: {
slug: category
}
}
};
}

if (min || max) {
where.priceCents = {
...(min && { gte: Number(min) * 100 }),
...(max && { lte: Number(max) * 100 })
};
}

let orderBy: any = {
createdAt: "desc"
};

if (sort === "price_asc") {
orderBy = { priceCents: "asc" };
}

if (sort === "price_desc") {
orderBy = { priceCents: "desc" };
}

const products = await prisma.product.findMany({
  where,
  include: {
    productimage: {
      orderBy: { sortOrder: "asc" },
      take: 1,
    },
  },
  orderBy,
  take,
  skip,
});

return NextResponse.json(products);
}
