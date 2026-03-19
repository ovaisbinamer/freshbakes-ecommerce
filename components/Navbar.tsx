"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const pathname = usePathname();

  // Calculate total items in cart
  const cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);

  // Close mobile menu automatically when the user clicks a link and the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scrolling on the main page when the mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* 1. LOGO (Visible on all devices) */}
        <Link href="/" className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-black text-stone-900 tracking-tighter z-50">
          FreshBakes.
        </Link>

        {/* 2. DESKTOP NAVIGATION (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">Home</Link>
          <Link href="/#menu" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">Menu</Link>
          
          <Link href="/cart" className="flex items-center gap-3 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest">Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-stone-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* 3. MOBILE CONTROLS (Hidden on desktop) */}
        <div className="flex items-center gap-4 md:hidden z-50">
          {/* Quick Cart Button for Mobile */}
          <Link href="/cart" className="flex items-center justify-center w-10 h-10 bg-stone-200 rounded-full relative">
            <svg className="w-4 h-4 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* Animated Hamburger Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
          >
            <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-stone-900 block transition-transform"></motion.span>
            <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-0.5 bg-stone-900 block transition-opacity"></motion.span>
            <motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 h-0.5 bg-stone-900 block transition-transform"></motion.span>
          </button>
        </div>

      </div>

      {/* 4. MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-20 left-0 w-full bg-stone-50 border-b border-stone-200 shadow-2xl md:hidden overflow-hidden flex flex-col"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              <Link href="/" className="text-2xl font-black text-stone-900 tracking-tight border-b border-stone-200 pb-4">Home</Link>
              <Link href="/#menu" className="text-2xl font-black text-stone-900 tracking-tight border-b border-stone-200 pb-4">Menu</Link>
              <Link href="/cart" className="flex items-center justify-between text-2xl font-black text-stone-900 tracking-tight pt-2">
                <span>View Cart</span>
                {cartCount > 0 && (
                  <span className="bg-amber-600 text-white text-sm font-black px-4 py-1.5 rounded-full">
                    {cartCount} items
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}