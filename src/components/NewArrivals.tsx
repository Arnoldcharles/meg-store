"use client";

import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function NewArrivals() {
  const now = new Date();

  // Filter products added within the last 3 days
  const newArrivals = products.filter((product) => {
    const createdAt = new Date(product.createdAt ?? 0);
    const diffTime = now.getTime() - createdAt.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  });

  if (newArrivals.length === 0) {
    return (
      <section className="py-12 px-6 md:px-12 lg:px-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          🆕 New Arrivals
        </h2>
        <p className="text-gray-500 mt-4">
          No new arrivals at the moment. <br /> Subscribe to our newsletter to
          get updated on new arrivals
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          🆕 New Arrivals
        </h2>
        <p className="text-gray-600 mt-2">
          Check out the latest additions to our store!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {newArrivals.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={250}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 font-semibold text-lg text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-2 text-green-600 font-bold">₦{product.price}</p>
            <Link
              href={`/products/${product.id}`}
              className="mt-4 bg-green-500 text-white w-full text-center py-2 rounded-lg hover:bg-green-600 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
