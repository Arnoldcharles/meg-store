"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold">Admin Dashboard</Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <Link href="/admin" className={pathname === "/admin" ? "text-blue-600" : "hover:text-blue-600"}>Analytics</Link>
            <Link href="/admin/products" className={pathname?.startsWith("/admin/products") ? "text-blue-600" : "hover:text-blue-600"}>Products</Link>
            <Link href="/admin/categories" className={pathname?.startsWith("/admin/categories") ? "text-blue-600" : "hover:text-blue-600"}>Categories</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-gray-700">{user?.email}</div>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden px-2 py-1 bg-gray-100 rounded">Menu</button>
          {user && (
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 py-2 border-t bg-white">
          <Link href="/admin" className="block py-1">Analytics</Link>
          <Link href="/admin/products" className="block py-1">Products</Link>
          <Link href="/admin/categories" className="block py-1">Categories</Link>
        </div>
      )}
    </nav>
  );
}
