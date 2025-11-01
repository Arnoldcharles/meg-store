import { Product } from "./products";

export type OrderItem = Product & { quantity: number };

export type Order = {
  id: string;
  userId?: string | null;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: number;
  trackingNumber?: string;
};

const keyFor = (userId?: string | null) => {
  return userId ? `orders_${userId}` : `orders_guest`;
};

export function saveOrder(order: Order) {
  const key = keyFor(order.userId);
  try {
    const raw = localStorage.getItem(key);
    const arr: Order[] = raw ? JSON.parse(raw) : [];
    arr.unshift(order);
    localStorage.setItem(key, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.error("saveOrder error", e);
    return false;
  }
}

export function getOrders(userId?: string | null): Order[] {
  const key = keyFor(userId);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getOrderById(userId: string | null | undefined, id: string): Order | null {
  const orders = getOrders(userId || null);
  return orders.find((o) => o.id === id) || null;
}

export function generateOrderId(prefix?: string) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const rand = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
  const id = `ORD-${y}${m}${d}-${hh}${mm}${ss}-${rand}`.toUpperCase();
  if (prefix) return `${prefix}_${id}`;
  return id;
}

export function getAllOrders(): Order[] {
  try {
    const all: Order[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (!key.startsWith("orders_")) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const arr: Order[] = JSON.parse(raw);
        for (const o of arr) all.push(o);
      } catch (e) {
        // ignore malformed
      }
    }
    // sort by createdAt desc
    return all.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    return [];
  }
}

export function updateOrderStatus(id: string, status: Order['status']): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (!key.startsWith("orders_")) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const arr: Order[] = JSON.parse(raw);
      let changed = false;
      const newArr = arr.map((o) => {
        if (o.id === id) {
          changed = true;
          return { ...o, status };
        }
        return o;
      });
      if (changed) {
        localStorage.setItem(key, JSON.stringify(newArr));
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error("updateOrderStatus", e);
    return false;
  }
}
