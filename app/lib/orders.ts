export type OrderMode = "compra" | "projeto";
export type OrderStatus = "enviado" | "pendente" | "concluido";

export type PaymentMethod = "pix" | "cartao" | "boleto" | "whatsapp";

export type OrderItem = {
  slug: string;
  nome: string;
  preco: number;
  imagem?: string;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  mode: OrderMode;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: number;
  customer: {
    nome: string;
    whats: string;
    email?: string;
    obs?: string;
  };
  items: OrderItem[];
};

const STORAGE_KEY = "orders";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<Order[]>(localStorage.getItem(STORAGE_KEY));
  if (!Array.isArray(data)) return [];
  return data;
}

function setOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function createOrder(input: Omit<Order, "id" | "createdAt" | "status">) {
  const orders = getOrders();

  const order: Order = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    status: "enviado",
    ...input,
  };

  orders.unshift(order);
  setOrders(orders);

  return order;
}

export function clearOrders() {
  setOrders([]);
}
