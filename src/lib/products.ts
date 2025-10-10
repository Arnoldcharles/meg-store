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
    id: "1354920147",
    name: "Red oil (Big Bottle)",
    image: "/products/Red oil1.jpg",
    description: "High-quality red oil with a rich flavor.",
    price: 4800,
    category: "Oil",
    stock: 10,
    bestSeller: false,
    createdAt: "2025-09-22T14:30:00Z",
  },
  {
    id: "256348023",
    name: "Red oil (Small Bottle)",
    image: "/products/Redoil.jpg",
    description: "Pure and healthy red oil for cooking.",
    price: 2400,
    category: "Oil",
    stock: 25,
    bestSeller: true,
    createdAt: "2025-09-24T10:11:00Z",
  },
  {
    id: "33275687",
    name: "Groundnut Oil (small Bottle)",
    image: "/products/groundnut oil.jpg",
    description: "High-quality groundnut oil for your cooking needs.",
    price: 2400,
    category: "Oil",
    stock: 15,
    bestSeller: true,
    createdAt: "2025-09-18T08:15:00Z",
  },
  {
    id: "447890123",
    name: "Stockfish (smaller size)",
    image: "/products/stockfish.jpg",
    description: "Dried stockfish for seasoning and cooking.",
    price: 500,
    category: "Fish",
    stock: 20,
    bestSeller: false,
    createdAt: "2025-09-16T12:00:00Z",
  },
  {
    id: "567890124",
    name: "Stockfish ear",
    image: "/products/stockfish1.jpg",
    description: "High-quality stockfish ear with a rich flavor.",
    price: 1500,
    category: "Fish",
    stock: 10,
    bestSeller: false,
    createdAt: "2025-09-22T14:30:00Z",
  },
  {
    id: "687890125",
    name: "Stockfish flesh",
    image: "/products/stockfish2.jpg",
    description: "Pure and healthy stockfish flesh for cooking.",
    price: 500,
    category: "Fish",
    stock: 25,
    bestSeller: true,
    createdAt: "2025-09-24T10:11:00Z",
  },
  {
    id: "712345678",
    name: "Salt (Small Pack)",
    image: "/products/salt1.jpg",
    description: "High-quality salt for your cooking needs.",
    price: 200,
    category: "Condiments",
    stock: 15,
    bestSeller: true,
    createdAt: "2025-09-18T08:15:00Z",
  },
  {
    id: "8567890126",
    name: "Crayfish",
    image: "",
    description: "Dried crayfish for seasoning and cooking.",
    price: 300,
    category: "Fish",
    stock: 20,
    bestSeller: false,
    createdAt: "2025-09-16T12:00:00Z",
  },
  {
    id: "967890127",
    name: "Salt (Big Pack)",
    image: "/products/salt.jpg",
    description: "High-quality salt with a rich flavor.",
    price: 500,
    category: "Condiments",
    stock: 10,
    bestSeller: false,
    createdAt: "2025-09-22T14:30:00Z",
  },
  {
    id: "10567890128",
    name: "Egusi (Melon) 1 derica",
    image: "/products/eguis.jpg",
    description: "Pure and healthy egusi seeds for cooking.",
    price: 1900,
    category: "Condiments",
    stock: 25,
    bestSeller: true,
    createdAt: "2025-09-24T10:11:00Z",
  },
  {
    id: "1187890129",
    name: "Stockfish Head (Small Size)",
    image: "/products/StockfishHeadsmall.jpg",
    description: "High-quality stockfish for your cooking needs.",
    price: 900,
    category: "Fish",
    stock: 15,
    bestSeller: true,
    createdAt: "2025-09-18T08:15:00Z",
  },
  {
    id: "1287890130",
    name: "Fresh Waterleaf",
    image: "/products/waterleaf.jpg",
    description: "Fresh waterleaf for seasoning and cooking.",
    price: 300,
    category: "Vegetables",
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
