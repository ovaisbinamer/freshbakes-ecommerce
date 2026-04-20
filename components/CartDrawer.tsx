"use client";

import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { cart, removeFromCart, decreaseQuantity, addToCart, isDrawerOpen, setIsDrawerOpen } = useCart();
  const cartCount = cart?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const subtotal = cart?.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-50 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-black text-stone-900">Your Bag</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 transition-colors"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <span className="text-4xl mb-4">🥐</span>
                  <p className="text-stone-900 font-bold">Your bag is empty!</p>
                </div>
              ) : (
                cart.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-stone-100" />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                      <p className="text-stone-500 text-xs">${Number(item.price).toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center font-bold text-stone-900 hover:bg-stone-200">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center font-bold text-stone-900 hover:bg-stone-200">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded-lg">✕</button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Checkout Link */}
            {cartCount > 0 && (
              <div className="p-6 border-t border-stone-200 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone-500 font-bold tracking-widest text-xs uppercase">Subtotal</span>
                  <span className="text-2xl font-black text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <Link 
                  href="/cart" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center bg-stone-900 text-white font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-xl hover:bg-amber-700 transition-all shadow-md"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
