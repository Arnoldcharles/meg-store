"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage("⚠️ Please enter a valid email address.");
      return;
    }

    
    setTimeout(() => {
      setMessage("🎉 Thank you for subscribing!");
      setEmail("");
    }, 500);
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-green-500 via-lime-500 to-yellow-400 rounded-2xl shadow-lg p-10 text-center text-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          📩 Subscribe to our Newsletter
        </h2>
        <p className="mb-6 text-lg">
          Get the latest deals, updates, and exclusive offers directly in your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            type="submit"
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-medium bg-white/20 px-4 py-2 rounded-lg inline-block">
            {message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
