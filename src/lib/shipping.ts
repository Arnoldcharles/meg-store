import { OrderItem } from "./orders";

// Delivery fee configuration
export const DELIVERY_FEE_PER_ITEM = 200; // ₦200 per item by default

export function calculateDeliveryFee(items: OrderItem[]) {
  if (!items || items.length === 0) return 0;
  const qty = items.reduce((s, it) => s + (it.quantity || 0), 0);
  return qty * DELIVERY_FEE_PER_ITEM;
}
