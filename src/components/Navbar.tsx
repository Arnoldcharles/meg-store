"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaUser, FaHome, FaBox, FaRobot } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const [active, setActive] = useState("home");
  const [isAdminSession, setIsAdminSession] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "arnoldcharles028@gmail.com";

  // Sync active nav with route
  useEffect(() => {
    if (pathname === "/") setActive("home");
    else if (pathname.startsWith("/products")) setActive("products");
    else if (pathname.startsWith("/ai")) setActive("ai");
    else if (pathname.startsWith("/cart")) setActive("cart");
    else if (pathname.startsWith("/about")) setActive("about");
  }, [pathname]);

  useEffect(() => {
    // hide navbar for admin session: check local user email or dev admin cookie
    if (user && user.email === ADMIN_EMAIL) {
      setIsAdminSession(true);
      return;
    }
    try {
      const cookies = typeof document !== "undefined" ? document.cookie : "";
      setIsAdminSession(cookies.includes("is_admin=1"));
    } catch (e) {
      setIsAdminSession(false);
    }
  }, [user]);


  if (isAdminSession) return null;

  return (
    <>
      {/* ✅ Top Navbar (Desktop + Mobile logo/login) */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Image src="/hero3.png" alt="Meg Store" width={40} height={40} />
            <span className="hidden md:block">Meg Store</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 text-white font-medium">
            <li>
              <Link href="/" className="hover:text-yellow-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-yellow-300">
                Products
              </Link>
            </li>
            <li>
              <Link href="/ai" className="hover:text-yellow-300">
                AI Assistant
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/account" className="hover:text-yellow-300">
                  Account
                </Link>
              </li>
            )}
            <li>
              <Link href="/about" className="hover:text-yellow-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-yellow-300">
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop Icons + Auth */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/cart" className="relative">
              <FaShoppingCart className="w-6 h-6 hover:text-yellow-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Auth (Login/Logout) */}
          <div className="md:hidden">
            {user ? (
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Bottom Navbar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <Link
            href="/"
            onClick={() => setActive("home")}
            className="flex flex-col items-center"
          >
            <FaHome
              className={`w-6 h-6 ${
                active === "home" ? "text-yellow-300" : "text-white"
              }`}
            />
            {active === "home" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
              >
                Home
              </motion.span>
            )}
          </Link>

          {/* Products */}
          <Link
            href="/products"
            onClick={() => setActive("products")}
            className="flex flex-col items-center"
          >
            <FaBox
              className={`w-6 h-6 ${
                active === "products" ? "text-yellow-300" : "text-white"
              }`}
            />
            {active === "products" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
              >
                Products
              </motion.span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            onClick={() => setActive("cart")}
            className="relative flex flex-col items-center"
          >
            <FaShoppingCart
              className={`w-6 h-6 ${
                active === "cart" ? "text-yellow-300" : "text-white"
              }`}
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                {getCartCount()}
              </span>
            )}
            {active === "cart" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
              >
                Cart
              </motion.span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/about"
            onClick={() => setActive("account")}
            className="flex flex-col items-center"
          >
            <FaUser
              className={`w-6 h-6 ${
                active === "about" ? "text-yellow-300" : "text-white"
              }`}
            />
            {active === "about" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
              >
                About
              </motion.span>
            )}
          </Link>
          {/* AI */}
          <Link
            href="/ai"
            onClick={() => setActive("ai")}
            className="flex flex-col items-center"
          >
            <FaRobot
              className={`w-6 h-6 ${active === "ai" ? "text-yellow-300" : "text-white"}`}
            />
            {active === "ai" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
              >
                AI
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
