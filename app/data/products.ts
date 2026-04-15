export type Product = {
  slug: string;
  nome: string;
  preco: number;
  imagem?: string;
  descricao?: string;
  precisaInstalacao?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "camera-ip-full-hd",
    nome: "Câmera IP Full HD",
    preco: 349.9,
    imagem: "/produtos/camera-ip-full-hd.jpg",
    descricao: "Câmera para monitoramento interno e externo.",
    precisaInstalacao: true,
  },
  {
    slug: "fonte-12v",
    nome: "Fonte 12V",
    preco: 59.9,
    imagem: "/produtos/fonte-12v.jpg",
    descricao: "Fonte para alimentação de câmeras.",
    precisaInstalacao: false,
  },
];
