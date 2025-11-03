"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";

export default function WishlistPage() {
  const { items, remove, clear, getCount } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Your wishlist</h1>
        <p className="text-gray-600">No items in your wishlist yet. Browse products and add favorites.</p>
        <Link href="/products" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your wishlist ({getCount()})</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clear();
              try { addToast('Wishlist cleared', 'info', 1800); } catch (e) {}
            }}
            className="text-sm px-3 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Clear wishlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-4 flex gap-4">
            <div className="w-32 h-24 flex items-center justify-center">
              <Image src={p.image || '/placeholder.jpg'} alt={p.name} width={160} height={120} className="object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.category}</p>
              <p className="mt-2 font-bold text-green-600">₦{p.price}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addToCart(p, 1);
                    try { addToast(`${p.name} added to cart`, 'success', 1500); } catch (e) {}
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => { remove(p.id); try { addToast(`${p.name} removed from wishlist`, 'info', 1500);} catch(e){} }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
