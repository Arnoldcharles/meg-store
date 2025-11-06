"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const teamMembers = [
  { name: "Arnold", role: "Founder & CEO", image: "/logo.png" },
  { name: "Ada", role: "Product Lead", image: "/logo.png" },
  { name: "Sam", role: "Design Lead", image: "/logo.png" },
];

const statsData = [
  { label: "Products Sold", value: 20000 },
  { label: "Happy Customers", value: 15000 },
  { label: "On-time Delivery %", value: 99 },
  { label: "Average Rating", value: 48 },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Meg Store — Beautiful products, thoughtfully sourced
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-indigo-100 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                We design curated collections and make it easy to find great
                products that fit your life. From fast shipping to excellent
                customer care, Meg Store is where quality meets value.
              </motion.p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center px-5 py-3 bg-white text-indigo-700 rounded-md shadow hover:shadow-lg font-medium"
                >
                  Shop products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-3 bg-indigo-700 bg-opacity-20 text-white rounded-md hover:bg-opacity-30"
                >
                  Contact us
                </Link>
              </div>
            </div>

            <motion.div
              className="relative w-full h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Image
                src="/app-store.png"
                alt="Meg Store"
                fill
                className="object-cover opacity-95"
              />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="mt-4 text-gray-600">
              To make modern shopping delightful — fast, honest, and simple. We
              pick products that last and back them with service you can count
              on.
            </p>
          </article>

          <article className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-2xl font-semibold">Sustainable Sourcing</h3>
            <p className="mt-4 text-gray-600">
              We partner with suppliers who follow responsible practices and
              prioritize durability over disposability.
            </p>
          </article>

          <article className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-2xl font-semibold">Customer-first Support</h3>
            <p className="mt-4 text-gray-600">
              Helpful, friendly, and fast — our support team is here to keep you
              smiling. Returns and exchanges are straightforward.
            </p>
          </article>
        </section>

        <section className="mt-12 bg-white rounded-lg p-8 shadow">
          <h2 className="text-3xl font-bold">By the numbers</h2>
          <p className="mt-2 text-gray-500">
            Small team, big impact — the milestones that keep us motivated.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Happy customers", value: 20000 },
              { label: "Products curated", value: 150 },
              { label: "On-time delivery %", value: 99 },
              { label: "Average rating (×10)", value: 48 },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold">
                  <CountUp end={s.value} duration={2.5} separator="," />
                </div>
                <div className="text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Meet the team</h2>
          <p className="mt-2 text-gray-500">
            A small, passionate group building delightful shopping experiences.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {teamMembers.map((m) => (
              <motion.div
                key={m.name}
                whileHover={{ y: -6 }}
                className="bg-white rounded-lg p-6 shadow flex items-center gap-4 transition-transform"
              >
                <div className="w-16 h-16 relative rounded-full overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-gradient-to-r from-green-50 to-indigo-50 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">
              Have questions or custom requests?
            </h3>
            <p className="mt-2 text-gray-600">
              We're happy to help — whether it's a bulk order or a product
              question, reach out and we'll respond quickly.
            </p>
          </div>
          <div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
