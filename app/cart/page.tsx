"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Adds a loading state

  // Price Calculation
  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  // STRIPE CHECKOUT FUNCTION
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // 1. Send the cart to our new backend route
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      // 2. If the backend gives us a Stripe URL, redirect the user there!
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex items-center justify-between border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter">Your Shopping Bag</h1>
            <p className="text-stone-500 mt-2 font-medium">Review your artisan selection before checkout.</p>
          </div>
          <Link href="/#menu" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:text-amber-700 hover:border-amber-700 transition-all text-sm uppercase tracking-widest">
            Continue Shopping
          </Link>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT: CART ITEMS */}
          <div className="flex-grow space-y-8 w-full">
            {cart.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-2xl border border-stone-200 shadow-sm">
                <h2 className="text-2xl font-bold text-stone-900 mb-4">Your oven is empty.</h2>
                <Link href="/#menu" className="inline-block bg-stone-900 text-white px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-amber-700 transition-colors">
                  Browse the Bakery
                </Link>
              </div>
            ) : (
              cart.map((item: any) => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="h-32 w-32 md:h-40 md:w-40 bg-stone-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  <div className="flex flex-col justify-center flex-grow py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1 block">
                          {item.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">{item.name}</h3>
                        <p className="text-stone-500 text-sm mt-1">${Number(item.price).toFixed(2)} each</p>
                      </div>
                      <p className="font-black text-xl text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-6">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>

                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-6 font-bold text-stone-900">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: BILLING SUMMARY */}
          <div className="w-full lg:w-[400px] sticky top-24">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
              <h2 className="text-xl font-black text-stone-900 mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 pb-8 border-b border-stone-100">
                <div className="flex justify-between text-stone-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-medium text-sm">
                  <span>Bakery Delivery</span>
                  <span className="text-stone-900 font-bold">${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="py-8 flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-stone-900">Total Bill</span>
                <span className="text-4xl font-black text-stone-900">${total.toFixed(2)}</span>
              </div>

              {/* STRIPE CHECKOUT BUTTON */}
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className={`w-full text-center bg-stone-900 text-white font-black py-5 rounded-xl hover:bg-amber-700 transition-all shadow-lg uppercase text-xs tracking-[0.2em] 
                  ${(cart.length === 0 || isCheckingOut) ? 'pointer-events-none bg-stone-300 shadow-none' : ''}`}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}