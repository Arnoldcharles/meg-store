"use client";

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { ToastProvider } from "@/components/ToastProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Meg Store",
  description: "Your One stop shop for all things grocery!",
};
<>
  <meta property="og:site_name" content="Meg Store" />
  <meta property="og:title" content="Meg Store" />
  <meta
    property="og:description"
    content="Your One stop shop for all things grocery!"
  />
  <meta property="og:url" content="https://meg-store.vercel.app/" />
  <meta property="og:type" content="website" />
  <meta
    property="icon"
    content="https://meg-store.vercel.app/hero4.png"
  />
  <meta property="og:image" content="https://meg-store.vercel.app/hero4.png" />
</>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <Navbar />
                  <div className="pt-16">{children}</div>
                  <Footer />
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
        <Script
          src="https://checkout.flutterwave.com/v3.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
