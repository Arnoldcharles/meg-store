"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import PromoImageBanner from "@/components/PromoImageBanner";

// Define a type for cart items that extends Product with quantity
import type { Product } from "@/lib/products";
type CartProduct = Product & { quantity: number };

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const product = products.find((p) => p.id === id);

  // Check if product is already in cart
  const isInCart = cart.some((item) => item.id === product?.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== id)
    .slice(0, 4);

  useEffect(() => {
    if (!product) {
      router.push("/products");
    } else {
      setLoading(false);
    }
  }, [product, router]);

  const handleAddToCart = () => {
    if (adding || isInCart) return;
    setAdding(true);
    setTimeout(() => {
      addToCart({ ...(product as Product), quantity: 1 } as CartProduct);
      setAdding(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={product?.image || "/placeholder.png"}
            alt={product?.name || "Product"}
            width={500}
            height={500}
            className="w-full h-[400px] object-contain rounded-lg shadow-md"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-gray-600">{product?.description}</p>
          <p className="text-xl font-semibold text-green-600">
            ₦{product?.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Category: <span className="capitalize">{product?.category}</span>
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || isInCart}
            className={`px-6 py-3 rounded-lg shadow transition text-white ${
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : adding
                ? "bg-green-500 cursor-wait"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {adding ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Adding...
              </div>
            ) : isInCart ? (
              "Added"
            ) : (
              "Add to Cart"
            )}
          </button>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-contain"
                  />
                  <h3 className="font-semibold mt-2">{item.name}</h3>
                  <p className="text-green-600 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <PromoImageBanner />
    </div>
  );
}
