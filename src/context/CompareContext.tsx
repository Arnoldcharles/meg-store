"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/products";

type CompareContextType = {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  toggle: (p: Product) => void;
  contains: (id: string) => boolean;
  clear: () => void;
  getCount: () => number;
};

const MAX_COMPARE = 4;

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("compare");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("compare", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const add = (p: Product) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      // keep max length
      const next = [...prev, p];
      if (next.length > MAX_COMPARE) next.shift();
      return next;
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const toggle = (p: Product) => {
    setItems((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.filter((x) => x.id !== p.id)
        : [...(prev.length >= MAX_COMPARE ? prev.slice(1) : prev), p]
    );
  };

  const contains = (id: string) => items.some((i) => i.id === id);

  const clear = () => setItems([]);

  const getCount = () => items.length;

  return (
    <CompareContext.Provider
      value={{ items, add, remove, toggle, contains, clear, getCount }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};

export default CompareProvider;
