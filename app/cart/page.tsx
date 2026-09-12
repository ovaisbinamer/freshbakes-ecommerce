"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Price Calculation & Free Shipping Threshold ($35.00)
  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const remaining = Math.max(0, 35 - subtotal);
  const progress = Math.min(100, (subtotal / 35) * 100);
  const freeShippingMessage = subtotal >= 35
    ? "🎉 You've unlocked FREE delivery!"
    : `Add $${remaining.toFixed(2)} more for FREE delivery!`;
  const deliveryFee = (subtotal >= 35 || subtotal === 0) ? 0 : 5.00;
  const total = subtotal + deliveryFee;

  // STRIPE CHECKOUT FUNCTION
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        setErrorMessage("Checkout failed. Please try again.");
        setIsCheckingOut(false);
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage("Checkout failed. Please try again.");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setErrorMessage("Checkout failed. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Checkout Step Indicator */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2 text-stone-900 bg-amber-100/80 px-4 py-2 rounded-full border border-amber-200 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-black">1</span>
            <span>Bag Selection</span>
          </div>
          <span className="text-stone-300 font-normal">→</span>
          <div className="flex items-center gap-2 text-stone-400 px-3 py-1.5">
            <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 text-xs flex items-center justify-center font-bold">2</span>
            <span>Summary</span>
          </div>
          <span className="text-stone-300 font-normal">→</span>
          <div className="flex items-center gap-2 text-stone-400 px-3 py-1.5">
            <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 text-xs flex items-center justify-center font-bold">3</span>
            <span>Secure Checkout</span>
          </div>
        </div>

        <header className="mb-12 flex items-center justify-between border-b border-stone-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">Your Bag</h1>
            <p className="text-stone-500 mt-2 font-medium">Review your artisan selection.</p>
          </div>
          <Link href="/#menu" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:text-amber-700 hover:border-amber-700 transition-all text-xs md:text-sm uppercase tracking-widest hidden sm:block">
            Continue Shopping
          </Link>
        </header>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-bold text-sm">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider ml-4">
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT: CART ITEMS */}
          <div className="flex-grow w-full space-y-6">
            {cart.length === 0 ? (
              <div className="bg-white p-12 md:p-16 text-center rounded-3xl border border-stone-100 shadow-sm">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  🥐
                </div>
                <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight">Your oven is empty.</h2>
                <p className="text-stone-500 mb-8 max-w-md mx-auto text-sm font-medium">
                  Looks like you haven't added any fresh baked goods yet. Explore our selection to fill your bag!
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Link 
                    href="/#menu?category=breads" 
                    className="bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-stone-200"
                  >
                    🥖 Browse Breads
                  </Link>
                  <Link 
                    href="/#menu?category=pastries" 
                    className="bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-stone-200"
                  >
                    🥐 Browse Pastries
                  </Link>
                  <Link 
                    href="/#menu?category=sweets" 
                    className="bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-900 px-6 py-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-stone-200"
                  >
                    🍰 Browse Sweets
                  </Link>
                </div>
              </div>
            ) : (
              cart.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                  
                  {/* Locked Image Container */}
                  <div className="w-full sm:w-40 h-48 sm:h-40 relative flex-shrink-0 bg-stone-100 rounded-2xl overflow-hidden">
                    {item.image ? (
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-bold text-xs">No Image</div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2 block">
                          {item.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none mb-2">{item.name}</h3>
                        <p className="text-stone-500 text-sm font-medium">${Number(item.price).toFixed(2)} each</p>
                      </div>
                      {/* Desktop Price */}
                      <p className="font-black text-2xl text-stone-900 hidden sm:block">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-6">
                      <div className="flex items-center gap-6">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden h-12 shadow-sm">
                          <button onClick={() => decreaseQuantity(item.id)} className="w-12 h-full bg-stone-50 hover:bg-stone-100 text-stone-900 font-black text-lg flex items-center justify-center transition-colors">-</button>
                          <span className="w-12 text-center font-bold text-stone-900">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="w-12 h-full bg-stone-50 hover:bg-stone-100 text-stone-900 font-black text-lg flex items-center justify-center transition-colors">+</button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors">Remove</button>
                      </div>
                      
                      {/* Mobile Price */}
                      <p className="font-black text-2xl text-stone-900 sm:hidden block">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: BILLING SUMMARY */}
          <div className="w-full lg:w-[420px] lg:sticky lg:top-10">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-stone-100">
              <h2 className="text-2xl font-black text-stone-900 mb-6 tracking-tight">Order Summary</h2>
              
              {/* Free Shipping Progress Bar */}
              <div className="bg-amber-50/80 border border-amber-100 p-4 rounded-2xl mb-6">
                <p className="text-xs font-bold text-amber-900 mb-2 text-center">
                  {freeShippingMessage}
                </p>
                <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-5 pb-8 border-b border-stone-100">
                <div className="flex justify-between text-stone-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-stone-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-medium">
                  <span>Bakery Delivery</span>
                  <span className="text-stone-900 font-bold">
                    {deliveryFee === 0 && subtotal > 0 ? (
                      <span className="text-amber-700 uppercase text-xs tracking-wider font-black">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              <div className="py-8 flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-stone-500">Total</span>
                <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className={`w-full min-h-[70px] flex items-center justify-center text-center bg-stone-900 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-xl uppercase text-sm tracking-[0.2em] mt-2
                  ${(cart.length === 0 || isCheckingOut) ? 'pointer-events-none bg-stone-200 text-stone-400 shadow-none' : ''}`}
              >
                {isCheckingOut ? "Preparing Oven..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}