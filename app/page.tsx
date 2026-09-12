"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TiltCard from "../components/TiltCard";
import MagneticButton from "../components/MagneticButton";
import { products as localProducts } from "./data/products"; 

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [addingStatus, setAddingStatus] = useState<{ [key: number]: 'loading' | 'added' | 'idle' }>({});
  
  // DATABASE STATES
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Breads", "Pastries", "Sweets"];

  // LIVE FETCH FROM LOCAL DATA
  useEffect(() => {
    // Simulate a short loading delay for effect
    const timer = setTimeout(() => {
      setProducts(localProducts);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    addToCart(product);
    setToastMessage(`${product.name} added!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingStatus(prev => ({ ...prev, [product.id]: 'loading' }));
    addToCart(product);
    setToastMessage(`${product.name} added!`);
    setTimeout(() => {
      setAddingStatus(prev => ({ ...prev, [product.id]: 'added' }));
    }, 300);
    setTimeout(() => {
      setAddingStatus(prev => ({ ...prev, [product.id]: 'idle' }));
      setToastMessage(null);
    }, 1800);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setToastMessage("Subscribed! Welcome to the Bread Club.");
      setEmailInput("");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-stone-50 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-stone-900 border-b border-stone-200 flex items-center justify-center">
        {/* Parallax Background Image */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src="https://images.pexels.com/photos/1756061/pexels-photo-1756061.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Artisanal Bakery"
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px]"></div>

        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full py-20 px-6"
        >
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            {/* Floating Badge Pill */}
            <motion.span 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
              ✨ Voted Best Artisan Bakery 2026
            </motion.span>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-[family-name:var(--font-playfair)] text-5xl md:text-8xl lg:text-9xl font-black text-white leading-none mb-8 tracking-tighter drop-shadow-2xl"
            >
              Morning Cravings, <br className="hidden md:block" /> Cured.
            </motion.h1>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-2xl lg:text-3xl text-stone-200 leading-relaxed max-w-3xl mx-auto drop-shadow-md"
            >
              <p>At <span className="text-amber-500 font-bold font-[family-name:var(--font-playfair)]">FreshBakes</span>, we believe that real food should be honest and filled with love. We spend years perfecting our slow-fermentation process to bring you the perfect bite.</p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 md:mt-16"
            >
              <MagneticButton>
                <Link href="#menu" className="inline-block bg-amber-600 text-white font-bold uppercase tracking-[0.2em] text-xs md:text-base px-10 py-5 md:px-12 md:py-6 hover:bg-white hover:text-stone-900 transition-colors shadow-2xl rounded-full">
                  Shop The Menu
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <Link href="#menu" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1 z-20">
          <span>Explore Bakes</span>
          <span className="animate-bounce">↓</span>
        </Link>
      </section>

      {/* VALUE PROPOSITION BANNER */}
      <section className="bg-stone-900 text-stone-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-700">
          <div className="pt-8 md:pt-0 px-4 hover:-translate-y-1 transition-transform">
            <svg className="w-8 h-8 text-amber-500 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-[family-name:var(--font-playfair)] text-white font-bold text-xl mb-2">Baked Fresh at 4 AM</h4>
            <p className="text-xs md:text-sm leading-relaxed">Our ovens fire up before the city wakes to ensure maximum freshness.</p>
          </div>
          <div className="pt-8 md:pt-0 px-4 hover:-translate-y-1 transition-transform">
            <svg className="w-8 h-8 text-amber-500 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18m0-18C9 6 4 9 4 13a8 8 0 0016 0c0-4-5-7-8-10z" />
            </svg>
            <h4 className="font-[family-name:var(--font-playfair)] text-white font-bold text-xl mb-2">100% Organic Grains</h4>
            <p className="text-xs md:text-sm leading-relaxed">We source directly from local, sustainable farms with zero additives.</p>
          </div>
          <div className="pt-8 md:pt-0 px-4 hover:-translate-y-1 transition-transform">
            <svg className="w-8 h-8 text-amber-500 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
            </svg>
            <h4 className="font-[family-name:var(--font-playfair)] text-white font-bold text-xl mb-2">Same-Day Delivery</h4>
            <p className="text-xs md:text-sm leading-relaxed">Order by 10 AM for guaranteed fresh delivery straight to your door.</p>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER BAR */}
      <section id="menu" className="bg-stone-100 py-12 px-6 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${
                  activeCategory === cat 
                  ? "text-white" 
                  : "text-stone-500 hover:text-stone-900 bg-white border border-stone-200"
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-stone-900 rounded-full shadow-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 whitespace-nowrap">
              Showing {filteredProducts.length} of {products.length} bakes
            </span>
            <div className="relative w-full sm:w-80 lg:w-96">
              <input 
                type="text" 
                placeholder="Search our bakes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-900 shadow-sm pr-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 font-bold p-1 text-sm transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MENU GRID */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[50vh]">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-700 rounded-full animate-spin mb-4"></div>
            <p className="font-[family-name:var(--font-caveat)] text-stone-500 text-3xl">Firing up the ovens...</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 items-stretch">
          <AnimatePresence mode='popLayout'>
            {!isLoading && filteredProducts.map((product: any, index: number) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TiltCard>
                  <div className="group bg-white border border-stone-200 flex flex-col h-full hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden relative">
                    {/* IMAGE CONTAINER */}
                    <div
                      className="relative bg-stone-100 border-b border-stone-100 flex-shrink-0 overflow-hidden"
                      style={{ height: '250px', minHeight: '250px', maxHeight: '250px' }}
                    >
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        {product.image ? (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            src={product.image}
                            alt={product.name}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-200 text-stone-400 font-bold">
                            Image Unavailable
                          </div>
                        )}
                      </Link>

                      {product.isTopSeller && (
                        <span className="absolute top-4 left-4 z-10 bg-amber-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 uppercase tracking-widest shadow-md">
                          Best Seller
                        </span>
                      )}

                      {/* Quick Add Hover Button */}
                      <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center justify-center gap-1.5"
                        >
                          {addingStatus[product.id] === 'loading' ? (
                            <span className="inline-block animate-spin font-bold">↻</span>
                          ) : addingStatus[product.id] === 'added' ? (
                            <span>Added ✓</span>
                          ) : (
                            <span>Quick Add +</span>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                      <Link href={`/product/${product.id}`} className="block">
                        <p className="font-[family-name:var(--font-caveat)] text-2xl text-amber-700 mb-1">{product.category}</p>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-black text-stone-900 mb-3 tracking-tight">{product.name}</h3>
                      </Link>
                      
                      {/* Feature Pills from product.facts */}
                      {product.facts && product.facts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {product.facts.map((fact: string, i: number) => (
                            <span key={i} className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full border border-stone-200">
                              {fact}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-100">
                        <span className="font-black text-xl md:text-2xl text-stone-900">${Number(product.price).toFixed(2)}</span>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="bg-stone-900 text-white text-xs md:text-sm font-bold uppercase px-6 py-3 hover:bg-amber-600 transition-colors rounded-lg shadow-md"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
             <p className="font-[family-name:var(--font-playfair)] text-stone-400 font-bold text-2xl">No bakes found for "{searchTerm}".</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="bg-amber-50 border-y border-amber-100 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-[family-name:var(--font-caveat)] text-4xl text-amber-700 block mb-2">Stay close</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">Join the Bread Club</h2>
          <p className="text-stone-600 mb-6 text-base md:text-lg">Subscribe to get secret menu drops, baking tips, and 10% off your first online order.</p>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 text-xs sm:text-sm font-semibold text-amber-900">
            <span className="inline-flex items-center gap-1.5 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
              ✓ Secret menu drops
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
              ✓ 10% off first order
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
              ✓ Weekly sourdough tips
            </span>
          </div>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address..." 
              className="flex-grow px-6 py-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900"
            />
            <button type="submit" className="bg-amber-700 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-stone-900 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 4. STORY SECTION */}
      <section className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-black text-stone-900 mb-10 tracking-tight">Our Process & Promise</h2>
          
          <div className="space-y-8 text-stone-600 leading-relaxed text-base md:text-2xl">
            <p>
              Our story isn't just about baking; it's about passion, community, and the persistent pursuit of the perfect bite. We treat every loaf, cookie, and pastry as a unique creation.
            </p>
            <p className="font-bold text-stone-900 text-lg md:text-3xl font-[family-name:var(--font-playfair)]">
              For us, time is the secret ingredient.
            </p>
            <p>
              We spend years perfecting our slow-fermentation process and meticulously sourcing local, organic ingredients. This commitment gives our bakes their rich, complex flavor and impeccable texture.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-stone-900 text-stone-400 text-center text-xs md:text-sm font-bold uppercase tracking-widest">
        <p>© 2026 FreshBakes Co. — Handcrafted in the City</p>
      </footer>

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