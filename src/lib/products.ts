// lib/products.ts

export type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  bestSeller?: boolean;
  createdAt?: string; // ISO date string
};

export const products: Product[] = [
  {
    id: "1",
    name: "Red oil",
    image: "/products/red oil 1.png",
    description: "High-quality red oil with a rich flavor.",
    price: 2200,
    category: "Oil",
    stock: 10,
    bestSeller: false,
    createdAt: "2025-09-22T14:30:00Z",
  },
  {
    id: "2",
    name: "Eva Bottle of Refilled Groundnut Oil (Ororo)",
    image: "/products/Eva Bottle of Refilled Groundnut Oil (Ororo).png",
    description: "Pure and healthy groundnut oil for cooking.",
    price: 1400,
    category: "Oil",
    stock: 25,
    bestSeller: true,
    createdAt: "2025-09-24T10:11:00Z",
  },
  {
    id: "3",
    name: "Stockfish Head (Okporoko)",
    image: "/products/stockfish.png",
    description: "High-quality stockfish for your cooking needs.",
    price: 500,
    category: "Fish",
    stock: 15,
    bestSeller: true,
    createdAt: "2025-09-18T08:15:00Z",
  },
  {
    id: "4",
    name: "Crayfish (Omi Obe)",
    image: "/products/crayfish.jpg",
    description: "Dried crayfish for seasoning and cooking.",
    price: 950,
    category: "Fish",
    stock: 20,
    bestSeller: false,
    createdAt: "2025-09-16T12:00:00Z",
  },
];

// ✅ Get all products
export function getProducts(): Product[] {
  return products;
}

// ✅ Get single product
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// ✅ Search products by name or category
export function searchProducts(term: string): Product[] {
  if (!term.trim()) return [];
  const lower = term.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
}
