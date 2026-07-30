import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { useCartStore } from '../store/cart.js';
import { Button } from '@hommiespace/ui';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/index.js';

export const PublicLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items, removeItem, updateQty } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get('/settings');
        const data = response.data.data;
        setSettings(data);
        if (data) {
          document.title = data.seoTitle || data.siteName || 'HommieSpace';
          
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', data.seoDescription || '');

          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.setAttribute('content', data.seoKeywords || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const totalCartValue = items.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const totalCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen flex flex-col font-sans transition-colors duration-300">
      {/* Header / Navigation */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-brand-linen/95 dark:bg-brand-charcoal/95 backdrop-blur-md border-b border-brand-sand-dark/20 dark:border-brand-sand-dark/10 px-6 lg:px-12 py-4 flex items-center justify-between transition-colors duration-300"
      >
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl font-bold tracking-wider flex items-center gap-3">
            <img src="/logo.png" alt="HommieSpace Logo" className="w-8 h-8 object-contain rounded-full border border-brand-sand-dark/20 dark:border-brand-sand-dark/40 shadow-sm" />
            <span className="font-serif text-2xl font-black tracking-wider">
              <span className="text-brand-walnut dark:text-white font-extrabold">HOMMIE</span>
              <span className="text-brand-terracotta font-extrabold">SPACE</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-brand-walnut dark:text-white">
            <Link to="/products" className="relative py-1 hover:text-brand-terracotta transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-brand-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Catalog</Link>
            <Link to="/products?category=furniture" className="relative py-1 hover:text-brand-terracotta transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-brand-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Furniture</Link>
            <Link to="/products?category=lighting" className="relative py-1 hover:text-brand-terracotta transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-brand-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Lighting</Link>
            <Link to="/products?category=kitchenware" className="relative py-1 hover:text-brand-terracotta transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-brand-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Kitchenware</Link>
            <Link to="/products?category=decor-pieces" className="relative py-1 hover:text-brand-terracotta transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:bg-brand-terracotta after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Decor</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Search Bar */}
          <div className="hidden sm:flex items-center gap-2 border border-brand-sand-dark/40 dark:border-brand-sand-dark/40 bg-brand-linen-light dark:bg-brand-charcoal px-3 py-1.5 transition-all">
            <input 
              type="text" 
              placeholder="Search catalog..." 
              className="bg-transparent text-xs text-brand-walnut dark:text-white focus:outline-none w-32 md:w-40 placeholder:text-brand-clay/80 border-none font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  navigate(`/products?search=${encodeURIComponent(val)}`);
                }
              }}
            />
            <svg className="w-4 h-4 text-brand-clay dark:text-brand-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Theme & Cart Action Capsule Container */}
          <div className="flex items-center gap-3 bg-brand-sand-light dark:bg-brand-walnut/90 border border-brand-sand-dark/50 dark:border-brand-terracotta/40 px-3.5 py-1.5 rounded-full shadow-md transition-all duration-300">
            {/* Light/Dark Theme Switcher */}
            <button 
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="flex items-center p-1 cursor-pointer hover:scale-110 active:scale-90 duration-200"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-brand-walnut" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-400 dark:text-amber-300 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072-7.072 5 5 0 01-7.072 7.072z" />
                </svg>
              )}
            </button>

            <span className="w-[1px] h-4 bg-brand-sand-dark/40 dark:bg-brand-sand-dark/30" />

            {/* Cart Drawer Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-brand-walnut dark:text-white hover:text-brand-terracotta transition-colors flex items-center p-1 hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              title="View Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCount > 0 && (
                <motion.span 
                  key={totalCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 10 }}
                  className="absolute -top-1.5 -right-2 bg-brand-terracotta text-brand-linen type-only text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm"
                >
                  {totalCount}
                </motion.span>
              )}
            </button>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors flex items-center p-1"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Sign in and profiles menu */}
          {user ? (
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-brand-clay font-serif italic">Hi, {user.name}</span>
              <Link to="/profile/orders" className="text-brand-walnut hover:text-brand-terracotta underline">Orders</Link>
              <Link to="/profile/tickets" className="text-brand-walnut hover:text-brand-terracotta underline">Support</Link>
              <button onClick={() => logout()} className="text-brand-terracotta hover:underline">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-xs font-semibold uppercase tracking-widest bg-brand-walnut text-brand-linen px-4 py-2 hover:bg-brand-charcoal transition-all">
              Sign In
            </Link>
          )}
        </div>
      </motion.header>

      {/* Main Page Render */}
      <main className="flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-walnut text-brand-linen-dark py-16 px-6 lg:px-12 border-t border-brand-charcoal/35 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
          <div>
            <h4 className="font-serif text-lg font-bold tracking-wider text-brand-linen mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="HommieSpace Logo" className="w-6 h-6 object-contain rounded-full" />
              <span>HOMMIE<span className="text-brand-terracotta">SPACE</span></span>
            </h4>
            <p className="text-brand-sand/60 leading-relaxed font-sans mb-4">
              {settings?.footerText || "A curated MERN multi-vendor marketplace connecting discerning customers with independent design studios crafting quiet luxury."}
            </p>
          </div>
          <div>
            <h5 className="font-semibold uppercase tracking-widest text-brand-linen mb-4">Collection</h5>
            <ul className="space-y-3 font-sans text-brand-sand/75">
              <li><Link to="/products?category=seating" className="hover:text-brand-terracotta transition-colors">Loungers & Armchairs</Link></li>
              <li><Link to="/products?category=tables" className="hover:text-brand-terracotta transition-colors">Dining & Coffee Tables</Link></li>
              <li><Link to="/products?category=storage" className="hover:text-brand-terracotta transition-colors">Cabinetry & Storage</Link></li>
              <li><Link to="/products?category=decor-and-accents" className="hover:text-brand-terracotta transition-colors">Speckled Ceramic Vases</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold uppercase tracking-widest text-brand-linen mb-4">Studio Partners</h5>
            <ul className="space-y-3 font-sans text-brand-sand/75">
              <li><a href="http://localhost:5174/register" target="_blank" rel="noopener noreferrer" className="hover:text-brand-terracotta transition-colors">Apply as Studio Partner</a></li>
              <li><a href="http://localhost:5174/login" target="_blank" rel="noopener noreferrer" className="hover:text-brand-terracotta transition-colors">Partner Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold uppercase tracking-widest text-brand-linen mb-4">Join the Lookbook</h5>
            <p className="text-brand-sand/60 mb-4 font-sans leading-relaxed">
              Sign up for editorial collections, studio stories, and first access to new releases.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email"
                className="bg-brand-charcoal border border-brand-sand-dark/20 px-4 py-2 text-brand-linen focus:outline-none w-full text-xs font-sans rounded-none"
              />
              <button className="bg-brand-linen text-brand-walnut px-4 font-semibold uppercase tracking-wider hover:bg-brand-sand transition-colors rounded-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-brand-charcoal/25 mt-12 pt-6 text-center text-[10px] text-brand-sand/40 font-sans flex flex-col sm:flex-row justify-between">
          <p>© 2026 HommieSpace Marketplace. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 justify-center">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-brand-linen text-brand-walnut shadow-2xl flex flex-col justify-between border-l border-brand-sand-dark/25">
              
              {/* Cart Header */}
              <div className="px-6 py-6 border-b border-brand-sand-dark/25 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold tracking-wide">Spaces Cart</h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-brand-clay hover:text-brand-walnut transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <svg className="w-12 h-12 text-brand-clay/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="font-serif text-sm font-semibold mb-1">Your cart is empty</p>
                    <p className="text-xs text-brand-clay font-sans">No pieces have been added to your spaces yet.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={`${item.product.id}-${item.variantId || 'default'}`} className="flex gap-4 pb-4 border-b border-brand-sand-dark/15">
                      <div className="w-20 h-24 bg-brand-sand/10 overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between text-left">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-brand-walnut">{item.product.name}</h4>
                          {item.variantName && (
                            <p className="text-brand-clay text-[10px] font-sans mt-0.5">Variant: {item.variantName}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center border border-brand-sand-dark/30">
                            <button onClick={() => updateQty(item.product.id, item.qty - 1, item.variantId)} className="px-2 py-1 hover:bg-brand-sand-light">-</button>
                            <span className="px-3 py-1 font-mono text-[10px]">{item.qty}</span>
                            <button onClick={() => updateQty(item.product.id, item.qty + 1, item.variantId)} className="px-2 py-1 hover:bg-brand-sand-light">+</button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id, item.variantId)}
                            className="text-brand-clay hover:text-brand-terracotta transition-colors uppercase font-bold text-[9px] tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-brand-sand-dark/25 bg-brand-sand-light/50 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-sm font-semibold">Subtotal</span>
                    <span className="font-serif text-lg font-bold text-brand-terracotta">₹{totalCartValue}.00</span>
                  </div>
                  <p className="text-[10px] text-brand-clay font-sans leading-relaxed mb-6">
                    Shipping and studio packaging options calculated at checkout. Curated furniture ships in padded custom crates.
                  </p>
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="block w-full">
                    <Button variant="primary" className="w-full py-4 text-center">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            {/* Drawer Container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="absolute top-0 right-0 h-full w-[300px] bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen shadow-2xl p-8 flex flex-col justify-between border-l border-brand-sand-dark/20 dark:border-brand-sand-dark/10"
            >
              <div>
                <div className="flex items-center justify-between border-b border-brand-sand-dark/20 dark:border-brand-sand-dark/10 pb-6 mb-8">
                  <span className="font-serif text-lg font-bold tracking-wider">NAVIGATE</span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="flex flex-col gap-6 text-sm font-semibold uppercase tracking-widest text-left">
                  <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-terracotta transition-colors py-2 border-b border-brand-sand-dark/10">All Catalog</Link>
                  <Link to="/products?category=furniture" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-terracotta transition-colors py-2 border-b border-brand-sand-dark/10">Furniture</Link>
                  <Link to="/products?category=lighting" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-terracotta transition-colors py-2 border-b border-brand-sand-dark/10">Lighting</Link>
                  <Link to="/products?category=kitchenware" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-terracotta transition-colors py-2 border-b border-brand-sand-dark/10">Kitchenware</Link>
                  <Link to="/products?category=decor-pieces" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-terracotta transition-colors py-2 border-b border-brand-sand-dark/10">Decor</Link>
                </nav>
              </div>
              <div className="text-[10px] text-brand-clay uppercase tracking-widest text-center">
                © HommieSpace Curated Shop
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicLayout;
