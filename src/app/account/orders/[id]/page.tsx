"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderById, Order } from "@/lib/orders";

export default function OrderDetail(props: any) {
  const { params } = props || {};
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = params?.id;
    const o = getOrderById(user?.uid || null, id);
    if (!o) {
      // redirect to orders
      router.replace("/account/orders");
      return;
    }
    setOrder(o);
  }, [params?.id, user]);

  if (!order) return null;

  const steps = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Order {order.id}</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">Placed</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-semibold">Total</div>
            <div className="text-green-600 font-bold">₦{order.total.toFixed(2)}</div>
            {order.subtotal !== undefined && (
              <div className="text-sm text-gray-500">Subtotal: ₦{order.subtotal.toFixed(2)}</div>
            )}
            {order.deliveryFee !== undefined && (
              <div className="text-sm text-gray-500">Delivery: ₦{order.deliveryFee.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Tracking</h3>
        <div className="space-y-3">
          {steps.map((s, idx) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${idx <= currentIndex ? "bg-green-600" : "bg-gray-300"}`} />
              <div>
                <div className="font-medium">{s.label}</div>
                <div className="text-sm text-gray-500">{idx <= currentIndex ? new Date(order.createdAt + idx * 3600 * 1000).toLocaleString() : "Pending"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Items</h3>
        <ul className="space-y-2">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between">
              <div>{it.name} x{it.quantity}</div>
              <div className="font-semibold">₦{(it.price * it.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
