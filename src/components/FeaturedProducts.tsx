"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";
import ProductQuickView from "@/components/ProductQuickView";
import flyToCart from "@/lib/flyToCart";
import { ProductSkeleton } from "@/components/Skeletons";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { FaHeart, FaBalanceScale } from "react-icons/fa";

export default function FeaturedProducts() {
  // Pick only 5 products
  const featured = products.slice(0, 5);

  const [current, setCurrent] = useState(0);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { toggle: toggleWishlist, contains: inWishlist } = useWishlist();
  const { toggle: toggleCompare, contains: inCompare } = useCompare();
  const [loading, setLoading] = useState(true);
  const [quickProduct, setQuickProduct] = useState<any>(null);

  // Auto-play every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featured.length]);

  // small simulated loader for skeletons (nice micro-interaction)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Best Sellers</h2>
        <p className="text-gray-600 mt-2">Our most popular products loved by customers 💚</p>
      </div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div className="flex transition-transform duration-700 ease-in-out" animate={{ x: `-${current * 100}%` }}>
          {loading
            ? Array.from({ length: 1 }).map((_, i) => (
                <div key={"sk" + i} className="min-w-full flex-shrink-0 px-4">
                  <ProductSkeleton />
                </div>
              ))
            : featured.map((product, index) => (
                <div key={product.id} className="min-w-full flex-shrink-0 px-4" data-product-id={product.id}>
                  <div className="bg-gray-50 shadow-md rounded-xl p-6 max-w-md mx-auto flex flex-col items-center">
                    <Image src={product.image || "/placeholder.jpg"} alt={product.name} width={300} height={200} className="w-full h-48 object-cover rounded-lg" />
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="mt-2 font-bold text-green-600">₦{product.price}</p>
                    </div>
                    <div className="mt-4 w-full flex gap-2">
                      <button
                        onClick={() => {
                          const imgEl = document.querySelector(`[data-product-id=\"${product.id}\"] img`);
                          const rect = imgEl ? (imgEl as HTMLImageElement).getBoundingClientRect() : null;
                          addToCart(product, 1);
                          addToast(`${product.name} added to cart`, "success", 2500);
                          flyToCart(product.image || "/placeholder.jpg", rect as any);
                        }}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <motion.span whileTap={{ scale: 0.95 }}>Add to Cart</motion.span>
                      </button>

                      <Link href={`/products/${product.id}`} className="w-1/3 bg-white text-green-600 border border-green-500 py-2 rounded-lg text-center hover:bg-green-50 transition">
                        View
                      </Link>

                      <button onClick={() => setQuickProduct(product)} className="w-1/3 bg-white text-gray-800 border border-gray-300 py-2 rounded-lg text-center hover:bg-gray-50 transition">
                        Quick View
                      </button>
                      <div className="flex gap-2 ml-2 items-center">
                        <button
                          onClick={() => {
                            toggleWishlist(product);
                            try { addToast(inWishlist(product.id) ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`, "info", 1800); } catch (e) {}
                          }}
                          aria-label="Toggle wishlist"
                          className={`p-2 rounded ${inWishlist(product.id) ? 'text-pink-600' : 'text-gray-600'}`}
                        >
                          <FaHeart />
                        </button>

                        <button
                          onClick={() => {
                            toggleCompare(product);
                            try { addToast(inCompare(product.id) ? `${product.name} removed from compare` : `${product.name} added to compare`, "info", 1800); } catch (e) {}
                          }}
                          aria-label="Toggle compare"
                          className={`p-2 rounded ${inCompare(product.id) ? 'text-indigo-600' : 'text-gray-600'}`}
                        >
                          <FaBalanceScale />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </motion.div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {featured.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full ${current === idx ? "bg-green-500" : "bg-gray-300"}`} />
        ))}
      </div>

      {quickProduct && <ProductQuickView product={quickProduct} onClose={() => setQuickProduct(null)} />}
    </section>
  );
}
