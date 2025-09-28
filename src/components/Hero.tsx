"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { searchProducts, Product } from "@/lib/products";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = () => {
    const data = searchProducts(query);
    setResults(data);
  };

  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white min-h-[95vh] flex flex-col-reverse md:flex-row items-center justify-center md:justify-between px-6 md:px-12 lg:px-20 overflow-hidden text-center md:text-left">
      {/* Left Side Text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 z-10 mt-6 md:mt-0"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Meg Store</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-lg mx-auto md:mx-0">
          Discover the best deals on fashion, gadgets, and more. Shop smart,
          live better.
        </p>

        {/* 🔍 Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 w-full max-w-md mx-auto md:mx-0"
        >
          <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-black outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-4 py-3 hover:bg-yellow-300 transition flex items-center justify-center"
            >
              <Search className="text-black w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mt-4 bg-white text-black rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="flex items-center gap-4 border-b py-2 last:border-b-0 hover:bg-gray-100 rounded-lg transition"
                >
                  <img
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-600">₦{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="/products"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-300 transition"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
        </div>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex-1 flex justify-center z-10"
      >
        <Image
          src="/hero2.png"
          alt="Shopping Illustration"
          width={350}
          height={350}
          className="object-contain drop-shadow-2xl w-3/4 sm:w-2/3 md:w-[450px]"
          priority
        />
      </motion.div>

      {/* Decorative Gradient Circles */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    </section>
  );
}
