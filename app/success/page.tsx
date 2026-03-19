"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion"; // Brought in the animations

export default function SuccessPage() {
  const { clearCart } = useCart();

  // PERFECT LOGIC: Clear the cart as soon as the user lands here
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-stone-100"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </motion.div>
        
        {/* Upgraded to the premium Playfair font */}
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-black text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-stone-500 mb-8 font-medium">Your bakes are entering the oven as we speak.</p>
        
        <div className="bg-stone-50 p-6 rounded-2xl mb-10 border border-stone-200">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1">Order Number</span>
          <span className="text-2xl font-black text-stone-900">#FB-{orderNumber}</span>
        </div>

        <Link href="/#menu" className="block w-full bg-stone-900 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-amber-700 transition-colors shadow-lg">
          Return to Bakery
        </Link>
        <p className="mt-6 text-[10px] text-stone-400 font-bold uppercase tracking-tighter">Receipt sent to your email</p>
      </motion.div>
    </main>
  );
}