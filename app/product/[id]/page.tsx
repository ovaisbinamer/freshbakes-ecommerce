"use client";

import { useState, useEffect, use } from "react"; // <-- Added 'use' here
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { products as localProducts } from "../../data/products"; 
import { motion, AnimatePresence } from "framer-motion";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // NEXT.JS 15 FIX: We have to "unwrap" the params Promise before we can read the ID!
  const { id } = use(params); 

  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // LIVE DATABASE STATES
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = localProducts.find((p) => p.id === Number(id));
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]); // <-- Use the safely unwrapped 'id' here too

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setToastMessage(`${product.name} added to your bag!`);
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 font-sans py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link href="/#menu" className="inline-flex items-center text-stone-500 hover:text-amber-700 font-bold uppercase text-xs tracking-widest mb-12 transition-colors">
          <span className="mr-2">←</span> Back to Menu
        </Link>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-700 rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Fetching fresh details...</p>
          </div>
        )}

        {/* NOT FOUND STATE */}
        {!isLoading && !product && (
          <div className="text-center py-40 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <h1 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">Bake Not Found</h1>
            <p className="text-stone-500 mb-8">It looks like someone already bought the last one of these.</p>
            <Link href="/#menu" className="bg-stone-900 text-white font-bold uppercase text-xs px-8 py-4 hover:bg-amber-700 transition-colors">
              Return to Bakery
            </Link>
          </div>
        )}

        {/* PRODUCT DETAILS (LIVE DATA) */}
        {!isLoading && product && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center bg-white p-6 md:p-12 rounded-3xl border border-stone-100 shadow-xl"
          >
            {/* IMAGE */}
            <div className="w-full lg:w-1/2 aspect-square relative bg-stone-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
               {product.image ? (
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover object-center" 
                  />
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-bold">Image Unavailable</div>
               )}
            </div>

            {/* TEXT & CONTROLS */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="text-amber-600 font-black uppercase tracking-[0.2em] text-xs mb-4 block">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 mb-6 tracking-tight leading-none">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-stone-900 mb-8">
                ${Number(product.price).toFixed(2)}
              </p>
              
              <div className="w-16 h-1 bg-amber-200 mb-8"></div>
              
              <p className="text-stone-600 text-lg leading-relaxed mb-12">
                {product.description || "A handcrafted artisan bake made with the finest organic ingredients. Perfect for your morning coffee or an afternoon treat."}
              </p>

              <button 
                onClick={handleAddToCart}
                className="w-full md:w-auto text-center bg-stone-900 text-white font-black uppercase tracking-widest text-sm px-12 py-6 rounded-xl hover:bg-amber-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Add to Bag — ${Number(product.price).toFixed(2)}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 bg-stone-900 text-white px-8 py-5 text-sm font-bold uppercase tracking-widest shadow-2xl border-b-4 border-amber-500 z-50 rounded-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}