"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function DealsOfTheDay() {
  const deals = products.slice(0, 3); // Pick 3 products for deals

  const [expiry, setExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Check if expiry is already saved in localStorage
    const savedExpiry = localStorage.getItem("dealsExpiry");

    if (savedExpiry) {
      setExpiry(new Date(savedExpiry));
    } else {
      // Set new expiry (today + 6 hours)
      const newExpiry = new Date();
      newExpiry.setHours(newExpiry.getHours() + 6);
      setExpiry(newExpiry);
      localStorage.setItem("dealsExpiry", newExpiry.toISOString());
    }
  }, []);

  useEffect(() => {
    if (!expiry) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiry.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("");
        localStorage.removeItem("dealsExpiry"); // Clear expired deals
        clearInterval(interval);
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  // If countdown ends, hide deals section
  if (!timeLeft) return null;

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white rounded-2xl shadow-lg mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">🔥 Deals of the Day</h2>
        <p className="text-lg mt-2">Grab them before time runs out!</p>
        <div className="mt-4 bg-white text-red-600 font-bold text-xl px-6 py-2 rounded-full inline-block shadow-md">
          ⏱️ {timeLeft}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((product) => (
          <div
            key={product.id}
            className="bg-white text-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={250}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-2 text-red-600 font-bold text-xl">
              ₦{product.price - 5}{" "}
              <span className="line-through text-gray-400 text-base ml-2">
                ₦{product.price}
              </span>
            </p>
            <Link
              href={`/products/${product.id}`}
              className="mt-4 bg-red-500 text-white w-full text-center py-2 rounded-lg hover:bg-red-600 transition"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
