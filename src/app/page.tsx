"use client";

import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
{
  /*import DealsOfTheDay from "@/components/DealsOfTheDay";*/
}
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="bg-white">
      <Hero />

      {/* Trust / benefits bar */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-indigo-600 text-2xl font-semibold">
                Free Shipping
              </div>
              <div className="text-sm text-gray-600">
                On orders over 50000 — fast delivery
              </div>
            </div>
            <div className="p-4">
              <div className="text-indigo-600 text-2xl font-semibold">
                30-Day Returns
              </div>
              <div className="text-sm text-gray-600">
                Hassle-free returns within 30 days
              </div>
            </div>
            <div className="p-4">
              <div className="text-indigo-600 text-2xl font-semibold">
                Secure Checkout
              </div>
              <div className="text-sm text-gray-600">
                Encrypted payments and data protection
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FeaturedCategories />
        </motion.div>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-2xl font-bold mb-6 text-center text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Featured products
          </motion.h2>
          <FeaturedProducts />
        </div>
      </section>

      <PromoBanner />

      <section className="max-w-7xl mx-auto px-6 py-12">
        {/*<DealsOfTheDay />*/}
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3 className="text-2xl font-semibold mb-6 text-center">
            What our customers say
          </motion.h3>
          <motion.div
            className="grid sm:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="p-6 border rounded-lg bg-gray-50">
              <p className="text-gray-700">
                “Fast delivery and excellent product quality. Support answered
                all my questions.”
              </p>
              <div className="mt-4 text-sm font-semibold">— Mary K.</div>
            </blockquote>
            <blockquote className="p-6 border rounded-lg bg-gray-50">
              <p className="text-gray-700">
                “Great selection and smooth checkout. Highly recommended.”
              </p>
              <div className="mt-4 text-sm font-semibold">— Omar W.</div>
            </blockquote>
            <blockquote className="p-6 border rounded-lg bg-gray-50">
              <p className="text-gray-700">
                “I love the product detail pages — clear images and helpful
                specs.”
              </p>
              <div className="mt-4 text-sm font-semibold">— Priya S.</div>
            </blockquote>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <NewArrivals />
      </section>

      <section className="bg-indigo-600 py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h4 className="text-white text-2xl font-bold mb-4">
            Join our newsletter
          </h4>
          <p className="text-indigo-200 mb-6">
            Get exclusive deals, product drops and behind-the-scenes content.
          </p>
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
