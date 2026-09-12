"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { products as localProducts } from "../../data/products"; 
import { motion, AnimatePresence } from "framer-motion";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // NEXT.JS 15 FIX: We have to "unwrap" the params Promise before we can read the ID!
  const { id } = use(params); 

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // LIVE DATABASE STATES
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundProduct = localProducts.find((p) => p.id === Number(id));
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setToastMessage(`${quantity} x ${product.name} added to your bag!`);
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Helper to attach icons to artisan facts
  const getFactWithIcon = (fact: string) => {
    if (/^[\p{Emoji}\u2000-\u32FF]/u.test(fact)) return fact;
    const lower = fact.toLowerCase();
    if (lower.includes("vegan")) return `🌱 ${fact}`;
    if (lower.includes("wheat") || lower.includes("flour") || lower.includes("oat") || lower.includes("ingredient")) return `🌾 ${fact}`;
    if (lower.includes("ferment") || lower.includes("starter") || lower.includes("bake") || lower.includes("process") || lower.includes("hour") || lower.includes("day")) return `🥖 ${fact}`;
    if (lower.includes("butter") || lower.includes("salt")) return `🧈 ${fact}`;
    if (lower.includes("chocolate") || lower.includes("cocoa")) return `🍫 ${fact}`;
    return `✨ ${fact}`;
  };

  // Ensure exemplar/fallback facts match requirement
  const defaultExemplars = ["🥖 48hr Slow Fermentation", "🌾 Organic European Wheat", "🌱 100% Vegan"];
  
  const rawFacts: string[] = product?.facts && product.facts.length > 0 
    ? product.facts 
    : ["48hr Slow Fermentation", "Organic European Wheat", "100% Vegan"];

  const productFacts = rawFacts.map(getFactWithIcon);
  
  // Combine & slice to display styled pills
  const displayFacts = Array.from(new Set([...productFacts, ...defaultExemplars])).slice(0, 3);

  // Recommendations: 3 complementary products from localProducts excluding current product
  const recommendations = product 
    ? localProducts.filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  return (
    <main className="min-h-screen bg-stone-50 font-sans py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BREADCRUMB TRAIL */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-700 transition-colors">
            Home
          </Link>
          <span className="text-stone-300">→</span>
          <Link href="/#menu" className="hover:text-amber-700 transition-colors">
            Menu
          </Link>
          <span className="text-stone-300">→</span>
          <span className="text-amber-700 font-black truncate max-w-[200px] sm:max-w-xs">
            {product ? product.name : "Product"}
          </span>
        </nav>

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
          <>
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
                <p className="text-2xl font-black text-stone-900 mb-6">
                  ${Number(product.price).toFixed(2)}
                </p>
                
                <div className="w-16 h-1 bg-amber-200 mb-6"></div>
                
                <p className="text-stone-600 text-lg leading-relaxed mb-8">
                  {product.description || "A handcrafted artisan bake made with the finest organic ingredients. Perfect for your morning coffee or an afternoon treat."}
                </p>

                {/* INGREDIENTS & ARTISAN FACTS GRID */}
                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-3">
                    Ingredients & Artisan Facts
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {displayFacts.map((fact, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-3.5 py-2 rounded-full text-xs font-bold shadow-xs hover:border-amber-400 transition-colors"
                      >
                        {fact}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden h-14 shadow-sm bg-stone-50">
                    <button 
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} 
                      className="w-12 h-full bg-stone-50 hover:bg-stone-100 text-stone-900 font-black text-lg flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-stone-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity((prev) => prev + 1)} 
                      className="w-12 h-full bg-stone-50 hover:bg-stone-100 text-stone-900 font-black text-lg flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto text-center bg-stone-900 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-8 py-4 h-14 flex items-center justify-center rounded-xl hover:bg-amber-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    {"Add " + quantity + " to Bag — $" + (product.price * quantity).toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* "YOU MIGHT ALSO LOVE" RECOMMENDATIONS SECTION */}
            <div className="mt-20 pt-12 border-t border-stone-200">
              <div className="text-center mb-10">
                <span className="text-amber-600 font-black uppercase tracking-[0.2em] text-xs block mb-2">
                  Handcrafted Alternatives
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
                  You Might Also Love
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <Link 
                    key={rec.id} 
                    href={`/product/${rec.id}`}
                    className="group bg-white rounded-2xl p-5 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden mb-4 relative">
                        <img 
                          src={rec.image} 
                          alt={rec.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                          ${Number(rec.price).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
                        {rec.category}
                      </span>
                      <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors mb-2 line-clamp-1">
                        {rec.name}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                    <div className="text-amber-700 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      <span>View Bake</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
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