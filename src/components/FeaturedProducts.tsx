"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  // Pick only 5 products
  const featured = products.slice(0, 5);

  const [current, setCurrent] = useState(0);

  // Auto-play every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Best Sellers
        </h2>
        <p className="text-gray-600 mt-2">
          Our most popular products loved by customers 💚
        </p>
      </div>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex transition-transform duration-700 ease-in-out"
          animate={{ x: `-${current * 100}%` }}
        >
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="min-w-full flex-shrink-0 px-4"
            >
              <div className="bg-gray-50 shadow-md rounded-xl p-6 max-w-md mx-auto flex flex-col items-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="mt-2 font-bold text-green-600">
                    ₦{product.price}
                  </p>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 bg-green-500 text-white w-full text-center py-2 rounded-lg hover:bg-green-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
