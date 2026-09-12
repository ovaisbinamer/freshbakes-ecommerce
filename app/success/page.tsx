"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [activeStep, setActiveStep] = useState(2); // Step 2 "In the Oven" active by default

  const timelineSteps = [
    { id: 1, label: "Order Placed", icon: "✓" },
    { id: 2, label: "In the Oven", icon: "🥖" },
    { id: 3, label: "Out for Delivery", icon: "🚚" }
  ];

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-6 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center border border-stone-100"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-black text-stone-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-stone-500 mb-6 font-medium text-sm md:text-base">
          Your bakes are entering the oven as we speak.
        </p>
        
        <div className="bg-stone-50 p-5 rounded-2xl mb-8 border border-stone-200">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1">
            Order Number
          </span>
          <span className="text-2xl font-black text-stone-900">#FB-{orderNumber}</span>
        </div>

        {/* INTERACTIVE ORDER TIMELINE TRACKER */}
        <div className="mb-8 bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-6 text-center">
            Order Status Timeline
          </span>
          
          <div className="relative flex items-center justify-between max-w-md mx-auto px-4">
            {/* Glowing Status Line */}
            <div className="absolute left-8 right-8 top-5 h-1 bg-stone-200 rounded-full z-0 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-all duration-500"
                style={{ 
                  width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' 
                }}
              />
            </div>

            {timelineSteps.map((step) => {
              const isCompleted = step.id < activeStep;
              const isCurrent = step.id === activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  title={`Click to set step: ${step.label}`}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? "bg-amber-600 text-white ring-4 ring-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.4)] scale-105"
                        : "bg-stone-200 text-stone-500 border-2 border-white"
                    } ${isCurrent ? "animate-pulse" : ""}`}
                  >
                    {step.icon}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 text-center transition-colors max-w-[90px] leading-tight ${
                    isCurrent || isCompleted ? "text-stone-900 font-extrabold" : "text-stone-400"
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ESTIMATED DELIVERY / PICKUP BOX */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 mb-8 flex items-center gap-4 text-left shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-2xl shadow-xs">
            ⏰
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block mb-0.5">
              Estimated Delivery / Pickup
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-950">
              Estimated Pickup/Delivery: Today between 8:00 AM - 9:00 AM
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-stone-900 text-white font-bold py-3.5 px-5 rounded-xl uppercase text-xs tracking-widest hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>🖨️</span>
            <span>Print Receipt</span>
          </button>

          <Link 
            href="/#menu" 
            className="flex-1 bg-stone-100 border border-stone-200 text-stone-800 font-bold py-3.5 px-5 rounded-xl uppercase text-xs tracking-widest hover:bg-stone-200 transition-all flex items-center justify-center"
          >
            Return to Menu
          </Link>
        </div>

        {/* CUSTOMER SUPPORT & EMAIL LINK */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Receipt sent to your email
          </span>
          <a 
            href="mailto:support@freshbakes.com" 
            className="text-amber-700 hover:text-amber-800 font-bold transition-colors flex items-center gap-1.5 hover:underline"
          >
            <span>💬</span>
            <span>Customer Support</span>
          </a>
        </div>
      </motion.div>
    </main>
  );
}