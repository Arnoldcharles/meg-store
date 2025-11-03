"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Truck, Check, Minus, Plus } from "lucide-react";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
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
  const product = products.find((p) => p.id === id);

  // normalize image list for products that may have a single `image` string
  // or an `images` array on some items (defensive, Product type doesn't declare `images`).
  const imageList: string[] = (() => {
    if (!product) return ["/placeholder.jpg"];
    const maybe = (product as any).images;
    if (Array.isArray(maybe) && maybe.length > 0) return maybe;
    if (product.image) return [product.image];
    return ["/placeholder.jpg"];
  })();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [mainImage, setMainImage] = useState<string | undefined>(product?.image);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { addToast } = useToast();
  const { toggle: toggleWishlist, contains: inWishlist } = useWishlist();
  const { toggle: toggleCompare, contains: inCompare } = useCompare();

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

    // ensure main image syncs when product changes
    setMainImage(product?.image);

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

  const handleAddToCart = (buyNow: boolean = false) => {
    if (adding || isInCart) return;
    setAdding(true);
    setTimeout(() => {
      addToCart({ ...(product as Product), quantity } as CartProduct);
      // fly-to-cart and toast
      try {
        const rect = imgRef.current ? imgRef.current.getBoundingClientRect() : null;
        flyToCart(mainImage || product?.image || "/placeholder.jpg", rect as any);
      } catch (e) {}
      try {
        addToast(`${product?.name} added to cart`, "success", 2000);
      } catch (e) {}
      setAdding(false);
      if (buyNow) {
        router.push("/checkout");
      }
    }, 800);
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
    <div className="container mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product?.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Gallery */}
        <div className="md:col-span-7 bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 md:w-20 flex md:flex-col gap-3">
              {imageList.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`border rounded overflow-hidden w-20 h-20 md:w-20 md:h-20 flex items-center justify-center ${
                    mainImage === img ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            <motion.div className="flex-1 flex items-center justify-center">
              <img
                ref={imgRef}
                src={mainImage || product?.image || "/placeholder.jpg"}
                alt={product?.name}
                className="w-full max-h-[600px] object-contain rounded-md shadow-lg"
              />
            </motion.div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:col-span-5 bg-white rounded-lg p-6 shadow">
          <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center text-yellow-400">
              <Star size={16} /> <Star size={16} /> <Star size={16} /> <Star size={16} /> <Star size={16} />
            </div>
            <span className="text-sm text-gray-500">4.9 · 1.2k reviews</span>
          </div>

          <p className="text-3xl font-extrabold text-green-600 mb-4">₦{product?.price.toFixed(2)}</p>

          <p className="text-gray-600 mb-4">{product?.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <div className="px-4 font-medium">{quantity}</div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={adding || isInCart}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg shadow text-white font-medium ${
                  isInCart ? "bg-gray-400 cursor-not-allowed" : adding ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <ShoppingCart size={16} />
                {adding ? "Adding..." : isInCart ? "Added" : "Add to cart"}
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={adding}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50"
              >
                Buy now
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleWishlist(product as Product);
                  try { addToast(inWishlist(product?.id || '') ? `${product?.name} removed from wishlist` : `${product?.name} added to wishlist`, 'info', 1600); } catch (e) {}
                }}
                className={`p-2 rounded ${inWishlist(product?.id || '') ? 'text-pink-600' : 'text-gray-600'}`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} />
              </button>

              <button
                onClick={() => {
                  toggleCompare(product as Product);
                  try { addToast(inCompare(product?.id || '') ? `${product?.name} removed from compare` : `${product?.name} added to compare`, 'info', 1600); } catch (e) {}
                }}
                className={`p-2 rounded ${inCompare(product?.id || '') ? 'text-indigo-600' : 'text-gray-600'}`}
                aria-label="Toggle compare"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M6 6v14"/><path d="M18 6v14"/></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-2">
              <Truck size={18} />
              <div>
                <div className="font-medium">Fast shipping</div>
                <div className="text-xs text-gray-500">Delivered within 3–5 days</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} />
              <div>
                <div className="font-medium">Hassle-free returns</div>
                <div className="text-xs text-gray-500">30-day returns</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-sm text-gray-600">
            <div className="mb-2"><span className="font-medium">Category:</span> <span className="capitalize">{product?.category}</span></div>
            <div className="mb-2"><span className="font-medium">SKU:</span> {product?.id}</div>
            <div className="mb-2"><span className="font-medium">Vendor:</span> Mega Store</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <Link href={`/products/${item.id}`}>
                  <div className="w-full h-40 flex items-center justify-center mb-3">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} width={200} height={160} className="object-contain" />
                  </div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="mt-2 font-semibold text-green-600">₦ {item.price.toFixed(2)}</p>
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
