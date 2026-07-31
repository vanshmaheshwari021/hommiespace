import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotspot {
  id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  path: string;
  top: string;
  left: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'chair',
    title: 'Minimalist Oak Lounge Chair',
    price: '₹24,500',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=furniture',
    top: '55%',
    left: '28%'
  },
  {
    id: 'vase',
    title: 'Nordic Ceramic Vase Set',
    price: '₹4,200',
    category: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=kitchenware',
    top: '64%',
    left: '54%'
  },
  {
    id: 'lamp',
    title: 'Sculptural Ceramic Pendant Lamp',
    price: '₹12,800',
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=lighting',
    top: '26%',
    left: '72%'
  }
];

export const Hero3DCanvas: React.FC = () => {
  const navigate = useNavigate();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-brand-sand-light dark:bg-brand-charcoal overflow-hidden group border border-brand-sand-dark/20 dark:border-brand-sand-dark/10 shadow-2xl">
      {/* High-Resolution Editorial Scandinavian Living Space Photography */}
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80" 
        alt="Editorial Scandinavian Quiet Luxury Living Space" 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Warm Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/15 to-transparent" />

      {/* Interactive Product Hotspot Markers */}
      {HOTSPOTS.map((spot) => (
        <div
          key={spot.id}
          className="absolute z-20"
          style={{ top: spot.top, left: spot.left }}
        >
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot(spot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() => navigate(spot.path)}
          >
            {/* Pulsing Hotspot Target Marker */}
            <button 
              type="button" 
              className="w-8 h-8 rounded-full bg-white/95 dark:bg-brand-walnut/90 shadow-2xl border border-brand-terracotta/50 flex items-center justify-center animate-pulse hover:scale-125 transition-all cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full bg-brand-terracotta" />
            </button>

            {/* Hover Tooltip Preview Card */}
            <AnimatePresence>
              {activeHotspot === spot.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-52 bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen p-3.5 shadow-2xl border border-brand-sand-dark/30 rounded-none text-left pointer-events-auto z-30"
                >
                  <img src={spot.image} className="w-full h-24 object-cover mb-2 border border-brand-sand-dark/15" alt={spot.title} />
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-terracotta block">{spot.category}</span>
                  <h5 className="font-serif font-bold text-xs line-clamp-1">{spot.title}</h5>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-brand-sand-dark/15">
                    <span className="text-brand-terracotta text-xs font-bold">{spot.price}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta">Shop →</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Floating Design Studio Glass Badge */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-left pointer-events-none">
        <div className="bg-brand-linen/90 dark:bg-brand-charcoal/90 backdrop-blur-md border border-brand-sand-dark/30 p-4 shadow-xl max-w-sm pointer-events-auto">
          <span className="text-brand-terracotta text-[9px] uppercase font-mono tracking-widest block font-bold mb-1">
            Studio Showcase
          </span>
          <h3 className="font-serif text-lg font-bold text-brand-walnut dark:text-brand-linen">
            Quiet Luxury Living Space
          </h3>
          <p className="text-[11px] text-brand-clay mt-1 leading-relaxed font-sans">
            Explore curated organic textures, architectural ceramics, and solid oak lounge pieces.
          </p>
        </div>

        <div className="bg-brand-linen/90 dark:bg-brand-charcoal/90 border border-brand-sand-dark/30 px-3.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-brand-walnut dark:text-brand-linen shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
          Tap Hotspots to Explore
        </div>
      </div>
    </div>
  );
};

export default Hero3DCanvas;
