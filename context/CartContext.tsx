"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  isTopSeller?: boolean;
  description?: string;
  process?: string;
  facts?: string[];
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  decreaseQuantity: (productId: number | string) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. LOAD cart from localStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem("bakery-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCart([]);
      }
    }
    setIsLoaded(true); // Tell the app we've finished loading data
  }, []);

  // 2. SAVE cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("bakery-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const decreaseQuantity = (productId: number | string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => String(item.id) === String(productId)
      );
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          String(item.id) === String(productId)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter((item) => String(item.id) !== String(productId));
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => String(item.id) !== String(productId))
    );
  };

  // 3. Clear Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("bakery-cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}