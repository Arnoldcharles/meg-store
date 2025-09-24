"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="py-12 px-6 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r from-green-500 via-lime-500 to-yellow-400 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 text-white"
      >
        {/* Left Side - Text */}
        <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow-md">
            🛒 Limited Time Offer!
          </h2>
          <p className="mt-3 text-lg md:text-xl">
            Get <span className="font-bold">30% OFF</span> on all fresh groceries.
            Hurry, offer ends soon!
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-1 flex justify-center"
        >
          <Image
            src="/promo.png" // 🔹 Add your promotional PNG image in /public
            alt="Promo Offer"
            width={350}
            height={350}
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
