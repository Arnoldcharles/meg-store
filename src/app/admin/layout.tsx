"use client";

import AdminNavbar from "@/components/AdminNavbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    // allow admin access if Firebase user matches admin email OR if a dev is_admin cookie exists
    const isAdminCookie = typeof document !== "undefined" && document.cookie.includes("is_admin=1");
    if (!user && !isAdminCookie) {
      router.replace("/login");
      return;
    }
    if (user && adminEmail && user.email !== adminEmail && !isAdminCookie) {
      router.replace("/");
      return;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
