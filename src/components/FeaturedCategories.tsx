"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { categories } from "@/lib/categories";

export default function FeaturedCategories() {
  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop by Category
        </h2>
        <p className="text-gray-600 mt-2">
          Fresh groceries and essentials, just for you 🍎
        </p>
      </div>

      {/* Carousel on mobile, Grid on desktop */}
      <div className="md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 hidden">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-green-100 hover:scale-105 transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-green-200 rounded-full mb-3">
                <cat.icon className="w-8 h-8 text-gray-700" />
              </div>
              <p className="font-medium text-gray-800 text-center">
                {cat.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="snap-center flex-shrink-0 w-40"
          >
            <Link
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-4 hover:bg-green-100 hover:scale-105 transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-green-200 rounded-full mb-3">
                <cat.icon className="w-8 h-8 text-gray-700" />
              </div>
              <p className="font-medium text-gray-800 text-center">
                {cat.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Scroll Hint */}
      <p className="text-center text-sm text-gray-500 mt-4 md:hidden">
        👉 Swipe to explore categories
      </p>
    </section>
  );
}
