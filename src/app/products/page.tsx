"use client";

import { useState, useEffect } from "react";
import { products } from "@/lib/products";
import { ProductSkeleton } from "@/components/Skeletons";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { FaHeart, FaBalanceScale } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/components/ToastProvider";

export default function ProductsPage() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false); // for load more
  const [initialLoading, setInitialLoading] = useState(true); // initial page skeleton
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Shuffle the product order on each mount so the page looks fresh on reload
  const [shuffledProducts, setShuffledProducts] = useState(() => products.slice());

  useEffect(() => {
    const shuffle = (arr: typeof products) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    setShuffledProducts((_) => shuffle(products));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let filteredProducts = selectedCategory
    ? shuffledProducts.filter((p) => p.category === selectedCategory)
    : shuffledProducts;

  // Search filter
  if (searchTerm.trim() !== "") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sorting logic
  if (sortOption === "priceLowHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === "nameAZ") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortOption === "nameZA") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const { toggle: toggleWishlist, contains: inWishlist } = useWishlist();
  const { toggle: toggleCompare, contains: inCompare } = useCompare();
  const { addToast } = useToast();

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setLoading(false);
    }, 1000);
  };

  // Simulate short initial load to show skeletons
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-12">
      {/* Sidebar Filter (desktop only) */} 
      <aside className="hidden md:block md:w-1/4 bg-gray-100 p-6 rounded-xl shadow-md h-fit sticky top-20">
        <h2 className="text-xl font-semibold mb-4">Filter</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  !selectedCategory
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === cat
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Filter (placeholder) */}
        {/*<div>
          <h3 className="font-medium mb-2">Price</h3>
          <p className="text-sm text-gray-500">Coming soon 🔒</p>
        </div>*/}
      </aside>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white z-50 p-6 shadow-lg overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filter</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md ${
                        !selectedCategory
                          ? "bg-green-500 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === cat
                            ? "bg-green-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <main className="flex-1">
        {/* Search + Sorting + View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Sorting Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="default">Sort By</option>
            <option value="priceLowHigh">Price: Low → High</option>
            <option value="priceHighLow">Price: High → Low</option>
            <option value="nameAZ">Name: A → Z</option>
            <option value="nameZA">Name: Z → A</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Products */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-6"
          }
        >
          {initialLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={"sk" + i} className={viewMode === "grid" ? "" : "py-2"}>
                  <ProductSkeleton />
                </div>
              ))
            : visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white rounded-xl shadow p-4 transition ${
                    viewMode === "list" ? "flex gap-4 items-center" : ""
                  }`}
                >
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    width={200}
                    height={200}
                    className={`object-contain ${
                      viewMode === "grid"
                        ? "w-full h-48 mb-3 md:h-40"
                        : "w-32 h-32"
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="text-green-600 font-bold mb-3">₦{product.price}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-block bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Actions (wishlist/compare) shown below on mobile for larger touch targets */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          toggleWishlist(product);
                          try {
                            addToast(
                              inWishlist(product.id)
                                ? `${product.name} removed from wishlist`
                                : `${product.name} added to wishlist`,
                              "info",
                              1500
                            );
                          } catch (e) {}
                        }}
                        className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${inWishlist(product.id) ? 'text-pink-600 border' : 'text-gray-600 border'}`}
                        aria-label="Toggle wishlist"
                      >
                        <FaHeart />
                        <span className="hidden sm:inline">Wishlist</span>
                      </button>

                      <button
                        onClick={() => {
                          toggleCompare(product);
                          try {
                            addToast(
                              inCompare(product.id)
                                ? `${product.name} removed from compare`
                                : `${product.name} added to compare`,
                              "info",
                              1500
                            );
                          } catch (e) {}
                        }}
                        className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${inCompare(product.id) ? 'text-indigo-600 border' : 'text-gray-600 border'}`}
                        aria-label="Toggle compare"
                      >
                        <FaBalanceScale />
                        <span className="hidden sm:inline">Compare</span>
                      </button>
                    </div>
                    </div>
                </motion.div>
              ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}

        {/* No results */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </main>
    </div>
  );
}
