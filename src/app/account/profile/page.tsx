"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/lib/orders";
import Link from "next/link";

export default function ProfilePage() {
  const { user, resendVerification, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const o = getOrders(user.uid);
    setOrders(o.slice(0, 5));
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to view profile
        </h2>
        <Link
          href="/login"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Account</h2>
          <div className="mt-3">
            <div className="mb-2">
              Email: <strong>{user.email}</strong>
            </div>
            <div className="mb-2">
              Verified: {user.emailVerified ? "Yes" : "No"}
            </div>
            {!user.emailVerified && (
              <button
                onClick={resendVerification}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Resend verification
              </button>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Recent Orders</h3>
            {orders.length === 0 ? (
              <div className="text-sm text-gray-500">No recent orders.</div>
            ) : (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <div>
                      <div className="font-medium">Order {o.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ₦{o.total.toFixed(2)}
                      </div>
                      <Link
                        href={`/account/orders/${o.id}`}
                        className="text-sm text-blue-600"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={logout}
              className="w-full px-3 py-2 bg-red-600 text-white rounded"
            >
              Logout
            </button>
            <Link
              href="/account/orders"
              className="block w-full text-center px-3 py-2 bg-green-600 text-white rounded"
            >
              View all orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
