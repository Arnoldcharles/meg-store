"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";

export default function ComparePage() {
  const { items, remove, clear, getCount } = useCompare();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Compare products</h1>
        <p className="text-gray-600">No products in compare. Add items from product pages or the listing.</p>
        <Link href="/products" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Compare ({getCount()})</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { clear(); try { addToast('Compare list cleared', 'info', 1600);}catch(e){} }}
            className="text-sm px-3 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left">Attribute</th>
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left">
                  <div className="flex items-center gap-2">
                    <Image src={p.image || '/placeholder.jpg'} width={60} height={48} alt={p.name} className="object-contain" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">₦{p.price}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-medium">Category</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">{p.category}</td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">Description</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 text-sm text-gray-600">{p.description}</td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-medium">Actions</td>
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { addToCart(p,1); try{ addToast(`${p.name} added to cart`, 'success', 1500);}catch(e){} }}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Add to cart
                    </button>
                    <button onClick={() => { remove(p.id); try{ addToast(`${p.name} removed from compare`, 'info', 1500);}catch(e){} }} className="px-3 py-1 border rounded">Remove</button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
