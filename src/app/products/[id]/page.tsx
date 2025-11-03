"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/ToastProvider";
import flyToCart from "@/lib/flyToCart";
import { ProductSkeleton } from "@/components/Skeletons";
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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { addToast } = useToast();

  const product = products.find((p) => p.id === id);

  // Check if product is already in cart
  const isInCart = cart.some((item) => item.id === product?.id);

  // Related products (will shuffle on mount)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(
    products.filter((p) => p.category === product?.category && p.id !== id)
  );

  useEffect(() => {
    if (!product) {
      router.push("/products");
      return;
    }

    // shuffle related products on each mount
    const rel = products.filter((p) => p.category === product?.category && p.id !== id);
    for (let i = rel.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rel[i], rel[j]] = [rel[j], rel[i]];
    }
    setRelatedProducts(rel.slice(0, 4));

    // simulate small load for skeleton
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [product, router, id]);

  const handleAddToCart = () => {
    if (adding || isInCart) return;
    setAdding(true);
    setTimeout(() => {
      addToCart({ ...(product as Product), quantity: 1 } as CartProduct);
      // fly-to-cart and toast
      try {
        const rect = imgRef.current ? imgRef.current.getBoundingClientRect() : null;
        flyToCart(product?.image || "/placeholder.jpg", rect as any);
      } catch (e) {}
      try { addToast(`${product?.name} added to cart`, "success", 2000); } catch(e){}
      setAdding(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <ProductSkeleton />
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
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
          <img
            ref={imgRef}
            src={product?.image || "/placeholder.jpg"}
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
              "Added to Cart ✅"
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
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-contain"
                  />
                  <h3 className="font-semibold mt-2">{item.name}</h3>
                  <p className="text-green-600 font-bold">
                    ₦ {item.price.toFixed(2)}
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
