// app/data/catalog.ts
export type Product = {
  slug: string;
  name: string;
  price: number;
  image?: string;
  categorySlug: string; // ex: "data-center"
};

export const CATEGORIES: Record<
  string,
  { title: string; subtitle?: string }
> = {
  "data-center": {
    title: "Data Center",
    subtitle: "Racks, energia, cabeamento, ativos e infraestrutura",
  },
  "sistema-de-seguranca": {
    title: "Sistema de Segurança",
    subtitle: "Câmeras, alarmes, controle de acesso e monitoramento",
  },
};

export const PRODUCTS: Product[] = [
  // Data Center
  {
    slug: "rack-20u-parede",
    name: "Rack 20U de Parede",
    price: 1299.9,
    image: "/mock/rack.jpg",
    categorySlug: "data-center",
  },
  {
    slug: "nobreak-1500va",
    name: "Nobreak 1500VA",
    price: 899.0,
    image: "/mock/nobreak.jpg",
    categorySlug: "data-center",
  },
  {
    slug: "switch-24p-gigabit",
    name: "Switch 24 Portas Gigabit",
    price: 1099.9,
    image: "/mock/switch.jpg",
    categorySlug: "data-center",
  },

  // Segurança
  {
    slug: "camera-ip-fullhd",
    name: "Câmera IP Full HD",
    price: 349.9,
    image: "/mock/camera.jpg",
    categorySlug: "sistema-de-seguranca",
  },
  {
    slug: "dvr-8-canais",
    name: "DVR 8 Canais",
    price: 599.9,
    image: "/mock/dvr.jpg",
    categorySlug: "sistema-de-seguranca",
  },
  {
    slug: "controle-acesso-biometria",
    name: "Controle de Acesso Biometria",
    price: 499.9,
    image: "/mock/acesso.jpg",
    categorySlug: "sistema-de-seguranca",
  },
];

export function getCategory(slug: string) {
  return CATEGORIES[slug];
}

export function getProductsByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}
