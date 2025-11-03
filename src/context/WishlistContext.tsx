"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/products";

type WishlistContextType = {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  toggle: (p: Product) => void;
  contains: (id: string) => boolean;
  clear: () => void;
  getCount: () => number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const add = (p: Product) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      return [...prev, p];
    });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const toggle = (p: Product) => {
    setItems((prev) => (prev.find((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]));
  };

  const contains = (id: string) => items.some((i) => i.id === id);

  const clear = () => setItems([]);

  const getCount = () => items.length;

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle, contains, clear, getCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export default WishlistProvider;
