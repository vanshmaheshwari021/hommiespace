import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, Skeleton, EmptyState } from '@hommiespace/ui';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/index.js';
import type { Product } from '@hommiespace/shared';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSelectedCat(searchParams.get('category') || '');
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await API.get('/products/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products?status=active';
        const params = [];
        
        if (selectedCat) params.push(`category=${selectedCat}`);
        if (searchVal) params.push(`search=${searchVal}`);
        
        if (params.length > 0) {
          url += `&${params.join('&')}`;
        }
        
        const response = await API.get(url);
        setProducts(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCat, searchVal]);

  // Sync URL search params when changed
  const handleCategoryClick = (slug: string) => {
    const newSlug = selectedCat === slug ? '' : slug;
    setSelectedCat(newSlug);
    setSearchParams(prev => {
      if (newSlug) {
        prev.set('category', newSlug);
      } else {
        prev.delete('category');
      }
      return prev;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    setSearchParams(prev => {
      if (val) {
        prev.set('search', val);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Perform client-side price filter and sorting
  const filteredAndSortedProducts = products
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured/id
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-left">
      <header className="mb-12 border-b border-brand-sand-dark/20 pb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-walnut mb-2">Independent Design Catalog</h1>
        <p className="text-brand-clay text-sm font-sans max-w-xl">
          Browse handcrafted, sustainable furniture pieces directly from independent studios.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-8 bg-white border border-brand-sand-dark/25 p-6 sticky top-24">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay">Search Catalog</label>
            <div className="flex border border-brand-sand-dark/30">
              <input
                type="text"
                value={searchVal}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Sideboard, Chair..."
                className="w-full bg-brand-linen-light px-3 py-2 text-xs focus:outline-none rounded-none"
              />
              <button type="submit" className="bg-brand-walnut text-brand-linen px-3 text-xs font-semibold hover:bg-brand-charcoal">
                Go
              </button>
            </div>
          </form>

          {/* Categories Filter */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay mb-3">Categories</label>
            <div className="flex flex-col gap-2">
              {/* "All" Option */}
              <button
                onClick={() => {
                  setSelectedCat('');
                  setSearchParams(prev => {
                    prev.delete('category');
                    return prev;
                  });
                }}
                className={`text-left px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-l-2
                  ${selectedCat === ''
                    ? 'border-brand-terracotta bg-brand-sand-light text-brand-walnut font-bold'
                    : 'border-transparent text-brand-clay hover:bg-brand-linen-light hover:text-brand-walnut'}`}
              >
                All Pieces
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`text-left px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-l-2
                    ${selectedCat === cat.slug
                      ? 'border-brand-terracotta bg-brand-sand-light text-brand-walnut font-bold'
                      : 'border-transparent text-brand-clay hover:bg-brand-linen-light hover:text-brand-walnut'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-brand-clay">
              <span>Max Price</span>
              <span className="font-mono text-brand-terracotta">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="40"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-terracotta bg-brand-sand"
            />
          </div>

          {/* Sort selection */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-bold text-brand-clay">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/30 px-3 py-2 text-xs text-brand-walnut focus:outline-none rounded-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Average Rating</option>
            </select>
          </div>
        </aside>

        {/* Catalog Showcase Grid */}
        <main className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Card key={idx} className="p-4" hoverEffect={false}>
                  <Skeleton variant="rect" className="aspect-[4/5] mb-4" />
                  <Skeleton variant="text" className="w-3/4 h-5 mb-2" />
                  <Skeleton variant="text" className="w-1/4 h-4" />
                </Card>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <EmptyState
              title="No Studio Pieces Found"
              description="Try adjusting your category filter, max price range, or search keyword."
              actionLabel="Reset All Filters"
              onAction={() => {
                setSelectedCat('');
                setSearchVal('');
                setMaxPrice(3000);
                setSearchParams({});
              }}
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedProducts.map(prod => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 10 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    key={prod.id}
                  >
                    <Card className="relative group flex flex-col h-full bg-brand-linen" hoverEffect={true}>
                      <Link to={`/products/${prod.id}`}>
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-sand-light cursor-pointer">
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                          />
                          <img 
                            src={prod.images[1] || prod.images[0]} 
                            alt={`${prod.name} Detail`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                          />
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
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
