"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useToast } from "@/components/ToastProvider";
import { Product } from "@/lib/products";
import { calculateDeliveryFee } from "@/lib/shipping";

type CartItem = Product & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Remove product from cart
  const removeFromCart = (id: string) => {
    // compute removed item from current cart, update state, then show toast
    const removed = cart.find((i) => i.id === id);
    if (!removed) return;

    const next = cart.filter((item) => item.id !== id);
    setCart(next);

    // show undo toast with action — call after updating state to avoid
    // triggering a state update in ToastProvider during CartProvider render
    try {
      addToast(`${removed.name} removed`, "info", 6000, {
        label: "Undo",
        onClick: () => {
          setCart((cur) => {
            // if item already present, just increase quantity
            const exists = cur.find((c) => c.id === removed.id);
            if (exists) {
              return cur.map((c) =>
                c.id === removed.id
                  ? { ...c, quantity: c.quantity + removed.quantity }
                  : c
              );
            }
            // re-insert removed item at front
            return [removed, ...cur];
          });
        },
      });
    } catch (e) {}
  };

  // Update quantity of a product
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get total cart price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    // reuse shipping helper
    return calculateDeliveryFee(cart as any);
  };

  const getGrandTotal = () => {
    return getCartTotal() + getDeliveryFee();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        getDeliveryFee,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook for using Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
