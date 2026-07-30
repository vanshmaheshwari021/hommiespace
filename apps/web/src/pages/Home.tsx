import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Skeleton } from '@hommiespace/ui';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/index.js';
import type { Product } from '@hommiespace/shared';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [activeHotspot, setActiveHotspot] = useState<'table' | 'chair' | null>(null);

  useEffect(() => {
    const fetchFeaturedAndSettings = async () => {
      try {
        // Fetch only active products and limit the query size to 8 for fast landing page loads
        const response = await API.get('/products?status=active&limit=8');
        setFeaturedProducts(response.data.data);
        
        const settingsRes = await API.get('/settings');
        setSettings(settingsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedAndSettings();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative bg-brand-sand-light overflow-hidden border-b border-brand-sand-dark/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[75vh]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col justify-center px-6 lg:px-12 py-16 text-left z-10"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-terracotta mb-4">
              {settings?.heroSubtitle || "Summer Collection 2026"}
            </span>
            <h2 className="text-4xl lg:text-6xl font-serif text-brand-walnut font-bold leading-[1.1] mb-6">
              {settings?.heroTitle || "Spaces that speak of quiet luxury."}
            </h2>
            <p className="text-brand-clay text-sm lg:text-base leading-relaxed mb-8 max-w-md font-sans">
              {settings?.heroDescription || "Hand-finished solid wood furniture, organic clays, and textured linens curated from top independent design studios. Built to breathe and crafted to endure."}
            </p>
            <div className="flex gap-4">
              <Button variant="primary" className="py-4 px-8" onClick={() => {
                const element = document.getElementById('curated-collection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Collection
              </Button>
              <Link to="/products">
                <Button variant="outline" className="py-4 px-8">
                  View Catalog
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="lg:col-span-7 relative min-h-[40vh] lg:min-h-0 bg-brand-sand-dark/20"
          >
            <img 
              src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600"}
              alt="Premium Living Room"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-sand-light via-transparent to-transparent lg:block hidden" />
          </motion.div>
        </div>
      </section>

      {/* Curved Sinusoidal Catalog Motion Marquee */}
      {!loading && featuredProducts.length > 0 && (
        <section className="relative overflow-hidden h-[420px] w-full bg-brand-linen dark:bg-brand-charcoal/20 border-y border-brand-sand-dark/15 z-10">
          <div className="relative w-full h-full">
            {/* SVG Wave lines following the exact same math curve */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 1600 380">
              <path 
                d="M -100,200 C 350,10 800,370 1250,200 C 1700,10 2150,370 2600,200" 
                fill="none" 
                className="stroke-brand-terracotta/40 dark:stroke-brand-terracotta/20" 
                strokeWidth="2" 
                strokeDasharray="8,6" 
              />
              <path 
                d="M -100,205 C 350,15 800,375 1250,205 C 1700,15 2150,375 2600,205" 
                fill="none" 
                className="stroke-brand-walnut/15 dark:stroke-brand-linen/10" 
                strokeWidth="1" 
              />
            </svg>

            {/* Catalog Cards shifting along CSS offset-path */}
            {featuredProducts.slice(0, 8).map((prod, idx) => (
              <Link
                key={prod.id}
                to={`/products/${prod.id}`}
                className="animate-motion-item group bg-[#F5EBE0] dark:bg-[#E5D7C6] border border-brand-sand-dark/60 hover:border-brand-terracotta p-4 flex gap-3 items-center shadow-xl transition-all duration-300 w-64 select-none"
                style={{ animationDelay: `${(idx * -(32 / Math.min(8, featuredProducts.length)))}s` }}
              >
                <img 
                  src={prod.images && prod.images[0] ? prod.images[0] : ''} 
                  alt={prod.name} 
                  className="w-14 h-14 object-cover flex-shrink-0 border border-brand-sand-dark/20" 
                />
                <div className="text-left min-w-0">
                  <span className="block text-[8px] font-sans text-brand-clay uppercase tracking-widest font-semibold truncate">
                    {prod.categoryId && typeof prod.categoryId === 'object' ? (prod.categoryId as any).name : 'Furniture'}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-brand-walnut truncate group-hover:text-brand-terracotta transition-colors">
                    {prod.name}
                  </h4>
                  <span className="text-brand-terracotta text-xs font-bold font-sans">
                    ₹{prod.salePrice || prod.price}
                  </span>
                </div>
                <span className="text-[10px] text-brand-terracotta font-semibold ml-auto transition-transform group-hover:translate-x-1 duration-300">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Asymmetric "Shop the Look" Section */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto text-left overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative group overflow-hidden"
          >
            <div className="aspect-[16/10] bg-brand-sand-dark/20 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" 
                alt="Living Space Detail" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Table Hotspot */}
            <div 
              className="absolute top-[48%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20"
              onMouseEnter={() => setActiveHotspot('table')}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button 
                onClick={() => navigate('/products')}
                className="w-7 h-7 rounded-full bg-brand-linen/95 shadow-lg border border-brand-walnut/30 flex items-center justify-center animate-pulse hover:scale-115 transition-all cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
              </button>
              
              <AnimatePresence>
                {activeHotspot === 'table' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 15, rotateX: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 15 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d', perspective: 600 }}
                    className="absolute bottom-9 left-1/2 -translate-x-1/2 w-56 bg-brand-linen text-brand-walnut p-4 shadow-2xl border border-brand-sand-dark/30 text-left pointer-events-none"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=300"
                      className="w-full h-24 object-cover mb-3"
                      alt="Travertine Low Table"
                    />
                    <h5 className="font-serif font-bold text-xs">Travertine Low Table</h5>
                    <p className="text-[10px] text-brand-clay mb-2">Honed organic stone base</p>
                    <div className="flex justify-between items-center pt-2 border-t border-brand-sand-dark/15">
                      <span className="text-brand-terracotta text-xs font-bold">₹750.00</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-brand-walnut">Shop Now →</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chair Hotspot */}
            <div 
              className="absolute top-[68%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-20"
              onMouseEnter={() => setActiveHotspot('chair')}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <button 
                onClick={() => navigate('/products')}
                className="w-7 h-7 rounded-full bg-brand-linen/95 shadow-lg border border-brand-walnut/30 flex items-center justify-center animate-pulse hover:scale-115 transition-all cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
              </button>
              
              <AnimatePresence>
                {activeHotspot === 'chair' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 15, rotateX: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 15 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d', perspective: 600 }}
                    className="absolute bottom-9 left-1/2 -translate-x-1/2 w-56 bg-brand-linen text-brand-walnut p-4 shadow-2xl border border-brand-sand-dark/30 text-left pointer-events-none"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
                      className="w-full h-24 object-cover mb-3"
                      alt="Oasis Bouclé Chair"
                    />
                    <h5 className="font-serif font-bold text-xs">Oasis Bouclé Chair</h5>
                    <p className="text-[10px] text-brand-clay mb-2">High density foam seating</p>
                    <div className="flex justify-between items-center pt-2 border-t border-brand-sand-dark/15">
                      <span className="text-brand-terracotta text-xs font-bold">₹890.00</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-brand-walnut">Shop Now →</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-sage mb-3">
              Shop The Look
            </span>
            <h3 className="text-3xl font-serif text-brand-walnut font-bold mb-4">
              Organic Textures & Clean Geometry
            </h3>
            <p className="text-brand-clay text-sm leading-relaxed mb-6 font-sans">
              Create spaces that evoke calmness. Combine our signature **Travertine Low Table** with the plush texture of the **Oasis Bouclé Chair** to establish a warm, grounded seating cluster.
            </p>
            <div className="space-y-4">
              <Link to="/products">
                <div className="flex items-center justify-between p-4 bg-brand-sand-light/50 border border-brand-sand-dark/20 hover:border-brand-terracotta transition-colors cursor-pointer mb-3">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">Travertine Coffee Table</h4>
                    <p className="text-brand-clay text-xs">Solid Honed Travertine</p>
                  </div>
                  <span className="text-brand-terracotta text-sm font-semibold">View Catalog →</span>
                </div>
              </Link>
              <Link to="/products">
                <div className="flex items-center justify-between p-4 bg-brand-sand-light/50 border border-brand-sand-dark/20 hover:border-brand-terracotta transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">Oasis Bouclé Lounge Chair</h4>
                    <p className="text-brand-clay text-xs">Textured Bouclé Seating</p>
                  </div>
                  <span className="text-brand-terracotta text-sm font-semibold">View Catalog →</span>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Collection Section */}
      <section id="curated-collection" className="py-20 border-t border-brand-sand-dark/20 px-6 lg:px-12 bg-brand-sand-light/35 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2 block">
                Independent Design Studios
              </span>
              <h3 className="text-3xl font-serif text-brand-walnut font-bold">
                Featured Marketplace Pieces
              </h3>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex gap-2">
                <button 
                  onClick={() => setScrollX(prev => Math.min(0, prev + 340))}
                  className="w-8 h-8 rounded-full border border-brand-walnut/30 flex items-center justify-center text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-colors font-bold text-xs"
                >
                  ←
                </button>
                <button 
                  onClick={() => setScrollX(prev => Math.max(-685, prev - 340))}
                  className="w-8 h-8 rounded-full border border-brand-walnut/30 flex items-center justify-center text-brand-walnut hover:bg-brand-walnut hover:text-brand-linen transition-colors font-bold text-xs"
                >
                  →
                </button>
              </div>
              <Link to="/products" className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta hover:underline ml-2">
                View Full Catalog →
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, idx) => (
                <Card key={idx} className="p-4" hoverEffect={false}>
                  <Skeleton variant="rect" className="aspect-[4/5] mb-4" />
                  <Skeleton variant="text" className="w-3/4 h-5 mb-2" />
                  <Skeleton variant="text" className="w-1/4 h-4" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <motion.div 
                animate={{ x: scrollX }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="flex gap-8"
              >
                {featuredProducts.map((prod) => (
                  <div key={prod.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
                    <Card className="relative group flex flex-col h-full bg-brand-linen" hoverEffect={true}>
                      <Link to={`/products/${prod.id}`}>
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-sand-light cursor-pointer">
                          <img 
                            src={prod.images && prod.images[0] ? prod.images[0] : ''} 
                            alt={prod.name}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                          />
                          <img 
                            src={prod.images && prod.images[1] ? prod.images[1] : (prod.images && prod.images[0] ? prod.images[0] : '')} 
                            alt={`${prod.name} Detail`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                          />
                          <span className="absolute top-3 left-3 bg-brand-linen-dark/85 text-[9px] uppercase tracking-widest font-semibold text-brand-walnut px-2.5 py-1">
                            {prod.categoryId && typeof prod.categoryId === 'object' ? (prod.categoryId as any).name : 'Collection'}
                          </span>
                        </div>
                      </Link>

                      <div className="p-5 text-left flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-sans text-brand-clay mb-1.5">
                            <span className="text-brand-terracotta font-semibold">★ {prod.rating || 0}</span>
                            <span>({prod.numReviews || 0})</span>
                          </div>
                          <Link to={`/products/${prod.id}`}>
                            <h4 className="font-serif text-base font-bold text-brand-walnut hover:text-brand-terracotta transition-colors cursor-pointer mb-1">
                              {prod.name}
                            </h4>
                          </Link>
                          <p className="text-brand-clay text-xs font-sans mb-3 line-clamp-1">{prod.material}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-brand-sand-dark/15">
                          <span className="text-brand-terracotta text-sm font-semibold">₹{prod.price}.00</span>
                          <Link to={`/products/${prod.id}`} className="text-xs uppercase font-semibold tracking-wider text-brand-walnut hover:text-brand-terracotta transition-colors">
                            View Piece →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto border-t border-brand-sand-dark/20 text-center">
        <h3 className="text-2xl lg:text-3xl font-serif italic text-brand-walnut mb-6">
          "Furniture should feel like a natural extension of the room, crafted with earth-born materials that acquire character with time."
        </h3>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-clay">
          — HommieSpace Curatorial Team
        </span>
      </section>
    </div>
  );
};

export default Home;
