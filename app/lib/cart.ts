import { prisma } from "@/app/lib/prisma";

export type CartItem = {
  slug: string;
  nome: string;
  preco: number;
  imagem?: string;
  qty: number;
};

const STORAGE_KEY = "cart";

function safeNumber(v: any, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function safeString(v: any, fallback = "") {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function normalizeItem(raw: any): CartItem | null {
  const slug = safeString(raw?.slug);
  const nome = safeString(raw?.nome);
  const preco = safeNumber(raw?.preco, NaN);
  const qty = safeNumber(raw?.qty, 1);

  if (!slug || !nome || !Number.isFinite(preco)) return null;

  return {
    slug,
    nome,
    preco,
    imagem: typeof raw?.imagem === "string" ? raw.imagem : undefined,
    qty: Math.max(1, Math.floor(qty)),
  };
}

export function getCart(): CartItem[] {

  if (typeof window === "undefined") return [];

  try {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeItem)
      .filter(Boolean) as CartItem[];

  } catch {

    return [];

  }

}

export function setCart(items: CartItem[]) {

  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items)
  );

}

export function addToCart(

  product:{
    slug:string;
    nome:string;
    preco:number;
    imagem?:string;
  },

  qty = 1

){

  const cart = getCart();

  const slug =
    safeString(product.slug);

  const nome =
    safeString(product.nome);

  const preco =
    safeNumber(product.preco,NaN);

  const addQty =
    safeNumber(qty,1);

  if(!slug || !nome || !Number.isFinite(preco))
    return;

  const idx =
    cart.findIndex(i=>i.slug===slug);

  if(idx>=0){

    cart[idx].qty +=
      Math.max(1,Math.floor(addQty));

  }else{

    cart.push({

      slug,
      nome,
      preco,
      imagem:product.imagem,
      qty:Math.max(1,Math.floor(addQty))

    });

  }

  setCart(cart);

}

export function removeFromCart(slug:string){

  const cart =
    getCart().filter(
      i=>i.slug!==slug
    );

  setCart(cart);

}

export function clearCart(){

  setCart([]);

}

export function setQty(
  slug:string,
  qty:number
){

  const cart = getCart();

  const nextQty =
    Math.max(
      1,
      Math.floor(Number(qty)||1)
    );

  const idx =
    cart.findIndex(
      i=>i.slug===slug
    );

  if(idx===-1) return;

  cart[idx].qty =
    nextQty;

  setCart(cart);

}


// LIMPA CARRINHO NO BANCO
export async function limparCarrinho(
  userId:string
){

  await prisma.cartitem.deleteMany({

    where:{
      userId
    }

  });

}