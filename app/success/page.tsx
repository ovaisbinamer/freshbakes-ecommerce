"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Clear the cart as soon as the user lands here
  useEffect(() => {
    clearCart();
  }, []);

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-stone-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-black text-stone-900 mb-2">Order Confirmed!</h1>
        <p className="text-stone-500 mb-8 font-medium">Your bakes are entering the oven as we speak.</p>
        
        <div className="bg-stone-50 p-6 rounded-2xl mb-10 border border-stone-200">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1">Order Number</span>
          <span className="text-2xl font-black text-stone-900">#FB-{orderNumber}</span>
        </div>

        <Link href="/" className="block w-full bg-stone-900 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-amber-700 transition-colors">
          Return to Bakery
        </Link>
        <p className="mt-6 text-[10px] text-stone-400 font-bold uppercase tracking-tighter">Receipt sent to your email</p>
      </div>
    </main>
  );
}