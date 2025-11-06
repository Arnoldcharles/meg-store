"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrders, Order } from "@/lib/orders";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const o = getOrders(user?.uid || null);
    setOrders(o);
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to view your orders
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">Order {o.id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">Items: {o.items.length}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  ₦{o.total.toFixed(2)}
                </div>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
