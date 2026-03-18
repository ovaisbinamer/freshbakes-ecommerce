"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white shadow-sm border-b border-stone-200">
      <Link href="/" className="text-2xl font-black text-amber-700 tracking-tighter hover:opacity-80 transition">
        FreshBakes.
      </Link>
      <div className="space-x-6 text-stone-600 font-bold text-sm tracking-wide uppercase">
        <Link href="/" className="hover:text-amber-600 transition">Home</Link>
        {/* This link will jump directly to the ID "menu" on the homepage */}
        <Link href="/#menu" className="hover:text-amber-600 transition">Shop</Link>
        <Link href="/cart" className="text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 hover:bg-amber-100 transition">
          Cart ({cart.length})
        </Link>
      </div>
    </nav>
  );
}