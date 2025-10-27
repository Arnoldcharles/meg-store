"use client";

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
  } = useCart();

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
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between border rounded-lg p-4 shadow"
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
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Subtotal + Remove */}
              <div className="text-right">
                <p className="font-semibold">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Summary */}
        <div className="border rounded-lg p-6 shadow h-fit sticky top-20">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items :</span>
            <span>{getCartCount()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Price:</span>
            <span className="font-bold text-green-600">
              ₦ {getCartTotal().toFixed(2)}
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
