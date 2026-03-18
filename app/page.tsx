"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabase"; 

export default function Home() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // DATABASE STATES
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Breads", "Pastries", "Sweets"];

  // LIVE FETCH FROM SUPABASE
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    }
    
    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    addToCart(product);
    setToastMessage(`${product.name} added!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-stone-50 font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white border-b border-stone-200 py-20 md:py-32 lg:py-40 px-6"
      >
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl lg:text-9xl font-black text-stone-900 leading-none mb-8 tracking-tighter"
          >
            Morning Cravings, <br className="hidden md:block" /> Cured.
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base md:text-2xl lg:text-3xl text-stone-600 leading-relaxed max-w-3xl mx-auto"
          >
            <p>At <span className="text-amber-700 font-bold">FreshBakes</span>, we believe that the best things in life are simple, honest, and made by hand.</p>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 md:mt-16"
          >
            <Link href="#menu" className="inline-block bg-stone-900 text-white font-bold uppercase tracking-[0.2em] text-xs md:text-base px-10 py-5 md:px-12 md:py-6 hover:bg-amber-700 transition-colors shadow-2xl">
              Shop The Menu
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* VALUE PROPOSITION BANNER */}
      <section className="bg-stone-900 text-stone-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-700">
          <div className="pt-8 md:pt-0 px-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Baked Fresh at 4 AM</h4>
            <p className="text-xs md:text-sm leading-relaxed">Our ovens fire up before the city wakes to ensure maximum freshness.</p>
          </div>
          <div className="pt-8 md:pt-0 px-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">100% Organic Grains</h4>
            <p className="text-xs md:text-sm leading-relaxed">We source directly from local, sustainable farms with zero additives.</p>
          </div>
          <div className="pt-8 md:pt-0 px-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Same-Day Delivery</h4>
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
                className={`px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? "bg-stone-900 text-white shadow-lg" 
                  : "bg-white text-stone-500 hover:bg-stone-200 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <input 
              type="text" 
              placeholder="Search our bakes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-900 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 3. MENU GRID */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[50vh]">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-700 rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Firing up the ovens...</p>
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
                <Link 
                  href={`/product/${product.id}`} 
                  className="group bg-white border border-stone-200 flex flex-col h-full hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden"
                >
                  {/* IMAGE CONTAINER
                      - Uses inline styles for height so no Tailwind purging or specificity issue can override it
                      - position: relative so the img can be absolute inside
                      - overflow: hidden clips the hover scale effect cleanly
                  */}
                  <div
                    className="relative bg-stone-100 border-b border-stone-100 flex-shrink-0 overflow-hidden"
                    style={{ height: '250px', minHeight: '250px', maxHeight: '250px' }}
                  >
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

                    {product.isTopSeller && (
                      <span className="absolute top-4 left-4 z-10 bg-amber-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 uppercase tracking-widest shadow-md">
                        Best Seller
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-2 tracking-tight">{product.name}</h3>
                    <p className="text-stone-500 text-sm md:text-base leading-relaxed mb-8 italic">{product.category}</p>
                    
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
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
             <p className="text-stone-400 font-bold text-xl">No bakes found for "{searchTerm}".</p>
          </div>
        )}
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="bg-amber-50 border-y border-amber-100 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">Join the Bread Club</h2>
          <p className="text-stone-600 mb-10 text-base md:text-lg">Subscribe to get secret menu drops, baking tips, and 10% off your first online order.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              className="flex-grow px-6 py-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-900"
            />
            <button className="bg-amber-700 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-stone-900 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 4. STORY SECTION */}
      <section className="bg-white py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-10 tracking-tight">Big Flavors Baked in the City</h2>
          
          <div className="space-y-8 text-stone-600 leading-relaxed text-base md:text-2xl">
            <p>
              Our story isn't just about baking; it's about passion, community, and the persistent pursuit of the perfect bite. We started as a tiny dream in a neighborhood kitchen, driven by the simple belief that real food should be honest and filled with love.
            </p>
            <p className="font-bold text-stone-900 text-lg md:text-3xl">
              Since 2015, we've remained steadfast in our mission: to bake real, artisan goods with simple ingredients.
            </p>
            <p>
              We spend years perfecting our slow-fermentation process, meticulously sourcing local, organic ingredients, and treating every loaf, cookie, and pastry as a unique creation. For us, time is the secret ingredient that gives our bakes their rich, complex flavor and impeccable texture.
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
