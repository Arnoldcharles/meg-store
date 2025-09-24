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

// 🛍️ Local Product Database
export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    image: "/products/headphones.png",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 120,
    category: "Electronics",
    stock: 10,
    bestSeller: false,
    createdAt: "2025-09-22T14:30:00Z",
  },
  {
    id: "2",
    name: "Running Shoes",
    image: "/products/shoes.png",
    description: "Lightweight running shoes for everyday comfort.",
    price: 80,
    category: "Fashion",
    stock: 25,
    bestSeller: true,
    createdAt: "2025-09-20T10:00:00Z",
  },
  {
    id: "3",
    name: "Smart Watch",
    image: "/products/smartwatch.png",
    description: "Track your health and fitness with style.",
    price: 200,
    category: "Fruit",
    stock: 15,
    bestSeller: true,
    createdAt: "2025-09-18T08:15:00Z",
  },
  {
    id: "4",
    name: "Leather Backpack",
    image: "/products/backpack.png",
    description: "Durable leather backpack with multiple compartments.",
    price: 95,
    category: "Accessories",
    stock: 8,
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
