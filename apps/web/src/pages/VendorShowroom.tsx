import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Skeleton } from '@hommiespace/ui';
import API from '../api/index.js';

interface VendorDetails {
  id: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  material: string;
  stock: number;
}

export const VendorShowroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const vendorRes = await API.get(`/vendors/${id}`);
        setVendor(vendorRes.data.data);

        const productsRes = await API.get(`/products?vendorId=${id}`);
        setProducts(productsRes.data.data.products || productsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Skeleton variant="rect" className="w-full h-80" />
        <Skeleton variant="text" className="w-1/3 h-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-xl text-brand-walnut">Studio partner profile not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-linen-light min-h-screen">
      <div className="relative h-80 lg:h-96 bg-brand-sand-light overflow-hidden">
        <img
          src={vendor.bannerUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200'}
          alt={vendor.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-walnut/20" />
        <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white border border-brand-sand-dark/10 p-2 overflow-hidden flex items-center justify-center">
              <img
                src={vendor.logoUrl || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200'}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">{vendor.businessName}</h1>
              <p className="text-sm opacity-90 font-sans mt-1">{vendor.businessAddress}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest opacity-75">Contact Studio</p>
            <p className="font-mono text-sm mt-1">{vendor.phone}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-brand-sand-dark/20 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-walnut">About the Studio</h3>
            <p className="text-xs font-sans text-brand-clay leading-relaxed">
              {vendor.description || 'Dedicated partner designer of premium, crafted furnishing accessories, seating layouts, and visual decoration accents.'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-walnut mb-2">Studio Collection</h2>
            <p className="text-xs text-brand-clay font-sans">Browse exclusive items designed and distributed directly by {vendor.businessName}.</p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-brand-sand-dark/20 p-12 text-center text-brand-clay text-xs font-sans">
              No products published by this studio partner yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map(product => (
                <a href={`/products/${product.id}`} key={product.id} className="group">
                  <Card className="bg-white border border-brand-sand-dark/25 p-4 rounded-none h-full flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-square bg-brand-linen overflow-hidden mb-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stock === 0 && (
                          <div className="absolute top-2 right-2 bg-brand-terracotta text-white font-mono text-[9px] uppercase tracking-wider px-2 py-1">
                            Sold Out
                          </div>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-bold text-brand-walnut group-hover:text-brand-terracotta transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-brand-clay font-sans mt-1 uppercase tracking-widest">{product.material}</p>
                    </div>
                    <div className="pt-4 mt-auto flex items-center justify-between border-t border-brand-sand-dark/20">
                      <span className="font-serif text-xs font-bold text-brand-walnut">₹{product.price.toLocaleString()}</span>
                      <span className="text-[10px] font-sans text-brand-sage font-bold hover:underline">View Details →</span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorShowroom;
