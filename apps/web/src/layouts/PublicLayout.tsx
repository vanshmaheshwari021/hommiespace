import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { useCartStore } from '../store/cart.js';
import { Button } from '@hommiespace/ui';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/index.js';
import { SmoothScroll } from '../components/SmoothScroll.js';

export const PublicLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items, removeItem, updateQty } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        setSettings(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const taxRate = settings?.taxRate ?? 0.18;
  const shippingFee = subtotal > 1500 || items.length === 0 ? 0 : (settings?.shippingFee ?? 50);
  const grandTotal = subtotal + subtotal * taxRate + shippingFee;

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen flex flex-col font-sans transition-colors duration-300">
        {/* Editorial Top Announcement Bar */}
        <div className="bg-brand-walnut text-brand-linen text-[10px] uppercase tracking-widest py-2 px-4 text-center font-sans font-medium flex items-center justify-between border-b border-brand-charcoal/40">
          <span>{settings?.announcementText || "Complimentary Shipping across Copenhagen & Delhi National Capital Region"}</span>
          <span className="hidden sm:inline font-mono">EST. 2026</span>
        </div>

        {/* Global Navigation Bar */}
        <header className="sticky top-0 z-40 bg-brand-linen/95 dark:bg-brand-charcoal/95 backdrop-blur-md border-b border-brand-sand-dark/20 dark:border-brand-sand-dark/10 px-6 lg:px-12 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-serif text-2xl font-bold tracking-wider flex items-center gap-3">
              <img src="/logo.png" alt="HommieSpace Logo" className="w-8 h-8 object-contain rounded-full border border-brand-sand-dark/20 dark:border-brand-sand-dark/40 shadow-sm" />
              <span className="font-serif text-2xl font-black tracking-wider">
                <span className="text-[#3D2E26] dark:text-[#3D2E26] font-extrabold" style={{ color: '#3D2E26' }}>HOMMIE</span>
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
                  <svg className="w-5 h-5 text-[#3D2E26]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                className="relative text-[#3D2E26] dark:text-white hover:text-brand-terracotta transition-colors flex items-center p-1 hover:scale-105 active:scale-95 duration-200 cursor-pointer"
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
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Account / Login State */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/orders" className="text-xs font-semibold text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors hidden sm:block">
                  Orders ({user.name.split(' ')[0]})
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-[10px]">
                  Log Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Outlet />
        </main>

        {/* Curated Editorial Footer */}
        <footer className="bg-brand-walnut text-brand-linen-dark py-16 px-6 lg:px-12 border-t border-brand-charcoal/35 text-left">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold tracking-wider text-brand-linen">HOMMIE<span className="text-brand-terracotta">SPACE</span></h3>
              <p className="text-brand-clay text-xs leading-relaxed font-sans">
                Curated marketplace connecting independent design studios with lovers of quiet luxury and earth-born home decor.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-brand-linen mb-4 uppercase tracking-widest">Catalog</h4>
              <ul className="space-y-2 text-xs text-brand-sand-dark">
                <li><Link to="/products?category=furniture" className="hover:text-brand-linen transition-colors">Solid Wood Furniture</Link></li>
                <li><Link to="/products?category=lighting" className="hover:text-brand-linen transition-colors">Architectural Lighting</Link></li>
                <li><Link to="/products?category=kitchenware" className="hover:text-brand-linen transition-colors">Artisan Kitchenware</Link></li>
                <li><Link to="/products?category=decor-pieces" className="hover:text-brand-linen transition-colors">Organic Decor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-brand-linen mb-4 uppercase tracking-widest">Studio Network</h4>
              <ul className="space-y-2 text-xs text-brand-sand-dark">
                <li><Link to="/vendor/onboarding" className="hover:text-brand-linen transition-colors">Become a Studio Partner</Link></li>
                <li><a href="http://localhost:5174" target="_blank" rel="noreferrer" className="hover:text-brand-linen transition-colors">Partner Dashboard</a></li>
                <li><Link to="/support" className="hover:text-brand-linen transition-colors">Design Support Desk</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-brand-linen uppercase tracking-widest">Design Journal</h4>
              <p className="text-xs text-brand-clay">Subscribe for seasonal release lookbooks and private studio studio access.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="studio@hommiespace.com" 
                  className="bg-brand-charcoal border border-brand-sand-dark/20 px-4 py-2 text-brand-linen focus:outline-none w-full text-xs font-sans rounded-none"
                />
                <Button variant="primary" className="shrink-0 px-4">Join</Button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-charcoal/60 flex flex-col md:flex-row justify-between items-center text-[10px] text-brand-clay tracking-widest uppercase font-mono">
            <div>© 2026 HOMMIESPACE DESIGN INC. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>TERMS OF SERVICE</span>
              <span>PRIVACY POLICY</span>
              <span>COOKIES</span>
            </div>
          </div>
        </footer>

        {/* Cart Drawer Component */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-xs" 
                onClick={() => setIsCartOpen(false)} 
              />
              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-screen max-w-md bg-brand-linen text-brand-walnut shadow-2xl flex flex-col justify-between border-l border-brand-sand-dark/25"
                >
                  <div className="px-6 py-6 border-b border-brand-sand-dark/25 flex items-center justify-between">
                    <h2 className="font-serif text-lg font-bold text-brand-walnut">Cart Bag ({totalCount})</h2>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-brand-clay hover:text-brand-walnut transition-colors p-2 text-sm font-mono"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <p className="text-brand-clay text-sm font-sans mb-4">Your curation bag is currently empty.</p>
                        <Button variant="outline" onClick={() => { setIsCartOpen(false); navigate('/products'); }}>
                          Explore Catalog
                        </Button>
                      </div>
                    ) : (
                      items.map(item => (
                        <div key={`${item.product.id}-${item.variantId || 'default'}`} className="flex gap-4 pb-4 border-b border-brand-sand-dark/15">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-20 h-24 object-cover border border-brand-sand-dark/20 flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div>
                              <h4 className="font-serif font-bold text-sm text-brand-walnut">{item.product.name}</h4>
                              {item.variantName && <p className="text-[10px] text-brand-clay uppercase tracking-wider">{item.variantName}</p>}
                              <p className="text-xs font-semibold text-brand-terracotta mt-1">₹{item.product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-brand-sand-dark/30">
                                <button 
                                  onClick={() => updateQty(item.product.id, item.qty - 1, item.variantId)}
                                  className="px-2 py-0.5 text-xs text-brand-walnut hover:bg-brand-sand-light"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-mono font-bold">{item.qty}</span>
                                <button 
                                  onClick={() => updateQty(item.product.id, item.qty + 1, item.variantId)}
                                  className="px-2 py-0.5 text-xs text-brand-walnut hover:bg-brand-sand-light"
                                >
                                  +
                                </button>
                              </div>
                              <button 
                                onClick={() => removeItem(item.product.id, item.variantId)}
                                className="text-[10px] text-brand-clay hover:text-brand-terracotta underline uppercase tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-6 border-t border-brand-sand-dark/25 bg-brand-sand-light/50 text-left">
                      <div className="space-y-2 mb-4 text-xs font-sans">
                        <div className="flex justify-between text-brand-clay">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-brand-clay">
                          <span>Est. Tax ({(taxRate * 100).toFixed(0)}%)</span>
                          <span>₹{(subtotal * taxRate).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-brand-clay">
                          <span>Shipping</span>
                          <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                        </div>
                        <div className="flex justify-between font-serif font-bold text-sm text-brand-walnut pt-2 border-t border-brand-sand-dark/20">
                          <span>Grand Total</span>
                          <span className="text-brand-terracotta">₹{grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="primary" 
                        className="w-full py-4"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/checkout');
                        }}
                      >
                        Proceed to Checkout →
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-xs" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute top-0 right-0 h-full w-[300px] bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen shadow-2xl p-8 flex flex-col justify-between border-l border-brand-sand-dark/20 dark:border-brand-sand-dark/10"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-brand-sand-dark/20 dark:border-brand-sand-dark/10 pb-6 mb-8">
                    <h3 className="font-serif text-lg font-bold">Menu Navigation</h3>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <nav className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-widest">
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
    </SmoothScroll>
  );
};

export default PublicLayout;
