"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { cart, removeFromCart, decreaseQuantity, addToCart, isDrawerOpen, setIsDrawerOpen } = useCart();
  const cartCount = cart?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const subtotal = cart?.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;

  const [note, setNote] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const remaining = Math.max(0, 35 - subtotal);
  const progress = Math.min(100, (subtotal / 35) * 100);
  const freeShippingMessage = subtotal >= 35 
    ? "🎉 You've unlocked FREE delivery!" 
    : `Add $${remaining.toFixed(2)} more for FREE delivery!`;

  // Lock scroll and close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, setIsDrawerOpen]);

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
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
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

            {/* Free Shipping Progress Bar */}
            <div className="bg-amber-50/80 border-b border-amber-100 px-6 py-3">
              <p className="text-xs font-bold text-amber-900 mb-1.5 text-center">
                {freeShippingMessage}
              </p>
              <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cartCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-12">
                  <span className="text-4xl mb-4">🥐</span>
                  <p className="text-stone-900 font-bold">Your bag is empty!</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item: any) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm"
                    >
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Checkout Link */}
            {cartCount > 0 && (
              <div className="p-6 border-t border-stone-200 bg-white">
                {/* Special Baking Instructions */}
                <div className="mb-4 pb-4 border-b border-stone-100">
                  <button
                    onClick={() => setIsNoteOpen(!isNoteOpen)}
                    className="flex items-center justify-between w-full text-xs font-bold text-stone-700 hover:text-amber-700 transition-colors"
                  >
                    <span>📝 Special Baking Instructions</span>
                    <span>{isNoteOpen ? "−" : "+"}</span>
                  </button>
                  {isNoteOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Allergies, delivery preferences, or custom request..."
                        className="w-full text-xs p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 resize-none"
                        rows={3}
                      />
                    </motion.div>
                  )}
                </div>

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
