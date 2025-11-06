"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to view your account
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
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Account Overview</h2>
            <p className="text-sm text-gray-600">
              Manage your orders, track shipments, and update your profile.
            </p>
          </div>

          <div className="mt-6 bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account/orders" className="text-green-600">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link href="/account/profile" className="text-green-600">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold mb-2">Account</h3>
            <p className="text-sm">Email: {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
