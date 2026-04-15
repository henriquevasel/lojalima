export const ROUTES = {
  home: "/",
  busca: "/busca",

  carrinho: "/carrinho",
  checkout: "/checkout",

  projetos: "/projetos",
  instalacao: "/instalacao",
  faleConosco: "/fale-conosco",
  quemSomos: "/quem-somos",
  meusPedidos: "/meus-pedidos",

  categoria: (slug: string) => `/categoria/${slug}`,
  produto: (slug: string) => `/produto/${slug}`,
} as const;
