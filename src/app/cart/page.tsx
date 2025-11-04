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

  const markUpdating = (id: string) =>
    setUpdatingIds((s) => Array.from(new Set([...s, id])));
  const unmarkUpdating = (id: string) =>
    setUpdatingIds((s) => s.filter((x) => x !== id));

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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-sm text-gray-500">
            Review items, update quantities, and proceed to secure checkout.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Secure checkout</div>
          <div className="px-3 py-1 bg-gray-100 rounded text-sm">SSL</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => {
            const isUpdating = updatingIds.includes(item.id) || clearing;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4 ${
                  isUpdating ? "opacity-80" : ""
                }`}
              >
                <div className="shrink-0 w-full sm:w-36 flex items-center justify-center bg-gray-50 rounded">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "Product"}
                    width={140}
                    height={140}
                    className="object-contain p-4"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>
                    <p className="mt-3 text-gray-700 text-sm">
                      {item.description ? item.description.slice(0, 120) : ""}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={isUpdating}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <div className="px-4 py-2 border rounded">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={isUpdating}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">Unit Price</div>
                      <div className="font-semibold text-lg text-green-600">
                        ₦ {item.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Subtotal</div>
                      <div className="font-medium">
                        ₦ {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isUpdating}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="flex justify-between items-center">
            <button
              onClick={handleClear}
              disabled={clearing}
              className="text-sm text-red-600 hover:underline"
            >
              {clearing ? "Clearing..." : "Clear cart"}
            </button>
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="border rounded-lg p-6 shadow-sm h-fit sticky top-20">
          <h3 className="text-xl font-semibold mb-4">Order summary</h3>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>{getCartCount()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span className="font-semibold">₦ {getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span className="font-semibold">
              ₦ {getDeliveryFee().toFixed(2)}
            </span>
          </div>
          <div className="border-t my-3"></div>
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold text-green-600">
              ₦ {getGrandTotal().toFixed(2)}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Have a coupon?
            </label>
            <div className="flex gap-2">
              <input placeholder="Code" className="flex-1 p-2 border rounded" />
              <button className="px-3 bg-green-600 text-white rounded">
                Apply
              </button>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            Checkout securely
          </Link>

          <div className="mt-4 text-xs text-gray-500">
            <div>Secure payments &bull; 30-day returns</div>
            <div className="mt-2">
              Need help?{" "}
              <Link href="/contact" className="underline">
                Contact support
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
