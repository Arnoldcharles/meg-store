"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";
import flyToCart from "@/lib/flyToCart";
import { useRef } from "react";

export default function ProductQuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (!product) return null;

  const handleAdd = () => {
    const imgEl = imgRef.current;
    const rect = imgEl ? imgEl.getBoundingClientRect() : null;
    addToCart(product, 1);
    addToast(`${product.name} added to cart`, "success", 2500);
    flyToCart(product.image || "/placeholder.jpg", rect);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="relative z-50 bg-white rounded-xl shadow-xl max-w-3xl w-full p-6"
      >
        <div className="flex gap-6">
          <div className="w-1/2">
            <img
              ref={imgRef}
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600 my-2">{product.category}</p>
            <p className="text-lg font-semibold text-green-600">
              ₦{product.price}
            </p>
            <p className="mt-4 text-gray-700">
              {product.description || "No description available."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add to Cart
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-lg border">
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
