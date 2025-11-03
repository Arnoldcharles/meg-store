"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getDeliveryFee,
    getGrandTotal,
  } = useCart();

  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [clearing, setClearing] = useState(false);

  const isAnyUpdating = updatingIds.length > 0 || clearing;

  const markUpdating = (id: string) => setUpdatingIds((s) => Array.from(new Set([...s, id])));
  const unmarkUpdating = (id: string) => setUpdatingIds((s) => s.filter((x) => x !== id));

  const handleIncrease = (id: string, currentQty: number) => {
    markUpdating(id);
    // update immediately, keep spinner for a tiny moment for UX
    updateQuantity(id, currentQty + 1);
    setTimeout(() => unmarkUpdating(id), 160);
  };

  const handleDecrease = (id: string, currentQty: number) => {
    markUpdating(id);
    updateQuantity(id, Math.max(0, currentQty - 1));
    setTimeout(() => unmarkUpdating(id), 160);
  };

  const handleRemove = (id: string) => {
    markUpdating(id);
    removeFromCart(id);
    setTimeout(() => unmarkUpdating(id), 160);
  };

  const handleClear = () => {
    setClearing(true);
    clearCart();
    setTimeout(() => setClearing(false), 300);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty 🛒</h1>
        <Link
          href="/products"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => {
            const isUpdating = updatingIds.includes(item.id) || clearing;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between border rounded-lg p-4 shadow ${isUpdating ? "opacity-80" : ""}`}
              >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name || "Product"}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-green-600 font-bold">
                    ₦ {item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item.id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isUpdating}
                >
                  {updatingIds.includes(item.id) ? (
                    <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    "-"
                  )}
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item.id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isUpdating}
                >
                  {updatingIds.includes(item.id) ? (
                    <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    "+"
                  )}
                </button>
              </div>

              {/* Subtotal + Remove */}
              <div className="text-right">
                <p className="font-semibold">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm hover:underline"
                  disabled={isUpdating}
                >
                  {updatingIds.includes(item.id) ? (
                    <svg className="animate-spin h-4 w-4 text-red-500 inline-block" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </motion.div>
            );
          })}

          {/* Clear Cart */}
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            disabled={clearing}
          >
            {clearing ? (
              <span className="inline-flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Clearing...</span>
            ) : (
              "Clear Cart"
            )}
          </button>
        </div>

        {/* Cart Summary */}
        <div className="border rounded-lg p-6 shadow h-fit sticky top-20">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items :</span>
            <span>{getCartCount()}</span>
          </div>
          <div className="flex justify-between mb-2 items-center">
            <span>Subtotal:</span>
            <span className="font-bold">
              {isAnyUpdating ? (
                <svg className="animate-spin inline-block h-4 w-4 text-gray-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              ) : (
                `₦ ${getCartTotal().toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between mb-2 items-center">
            <span>Delivery:</span>
            <span className="font-bold">
              {isAnyUpdating ? (
                <svg className="animate-spin inline-block h-4 w-4 text-gray-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              ) : (
                `₦ ${getDeliveryFee().toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between mb-4 items-center">
            <span>Total:</span>
            <span className="font-bold text-green-600">
              {isAnyUpdating ? (
                <svg className="animate-spin inline-block h-4 w-4 text-gray-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              ) : (
                `₦ ${getGrandTotal().toFixed(2)}`
              )}
            </span>
          </div>

          {/* ✅ Checkout Link */}
          <Link
            href="/checkout"
            className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
