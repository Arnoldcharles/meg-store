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
  description: "Modern e-commerce store",
};

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
