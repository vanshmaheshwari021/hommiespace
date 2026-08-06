import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@hommiespace/shared';
import type { ProductInput } from '@hommiespace/shared';
import { Card, Table, Button, Skeleton, Modal } from '@hommiespace/ui';
import API from '../../api/index.js';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: 'draft' | 'active';
  material: string;
  categoryId: string | { id: string; name: string };
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  colorVariants: Array<{
    name: string;
    hex?: string;
    stock: number;
    priceOffset: number;
  }>;
  images: string[];
  vendorId?: {
    businessName: string;
  };
}

const getProductId = (prod: any): string => {
  if (!prod) return '';
  if (typeof prod === 'string') return prod;
  const raw = prod.id || prod._id;
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    if (raw._id) return getProductId(raw._id);
    if (typeof raw.toString === 'function') return raw.toString();
  }
  return String(raw);
};

export const CatalogModeration: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema)
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'colorVariants'
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images' as any
  });

  const SAMPLE_ADMIN_CATS = [
    { _id: 'cat-chairs', id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
    { _id: 'cat-tables', id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
    { _id: 'cat-decor', id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
    { _id: 'cat-lighting', id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
    { _id: 'cat-sofas', id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' }
  ];

  const SAMPLE_ADMIN_PRODUCTS = [
    {
      _id: 'prod-chair-01', id: 'prod-chair-01', name: 'Stockholm Velvet Armchair', slug: 'stockholm-velvet-armchair',
      price: 29500, status: 'active', approvalStatus: 'approved',
      categoryId: { _id: 'cat-chairs', name: 'Chairs & Seating', slug: 'chairs' },
      vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio' },
      images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
      colorVariants: [{ colorName: 'Sandstone Velvet', colorHex: '#D4C4B5', stock: 15 }]
    },
    {
      _id: 'prod-table-01', id: 'prod-table-01', name: 'Nordic Oak Extension Dining Table', slug: 'nordic-oak-extension-dining-table',
      price: 124000, status: 'active', approvalStatus: 'approved',
      categoryId: { _id: 'cat-tables', name: 'Dining Tables', slug: 'tables' },
      vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio' },
      images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80'],
      colorVariants: [{ colorName: 'Natural Oak', colorHex: '#C5A059', stock: 8 }]
    },
    {
      _id: 'prod-decor-01', id: 'prod-decor-01', name: 'Kobenhavn Ceramic Vase Set (Trio)', slug: 'kobenhavn-ceramic-vase-set',
      price: 8900, status: 'active', approvalStatus: 'approved',
      categoryId: { _id: 'cat-decor', name: 'Vases & Decor', slug: 'decor' },
      vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio' },
      images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80'],
      colorVariants: [{ colorName: 'Matte Cream', colorHex: '#F5F2EB', stock: 24 }]
    },
    {
      _id: 'prod-light-01', id: 'prod-light-01', name: 'Gothenburg Brass Floor Lamp', slug: 'gothenburg-brass-floor-lamp',
      price: 18900, status: 'active', approvalStatus: 'approved',
      categoryId: { _id: 'cat-lighting', name: 'Lighting & Lamps', slug: 'lighting' },
      vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio' },
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
      colorVariants: [{ colorName: 'Brushed Brass', colorHex: '#D4AF37', stock: 12 }]
    },
    {
      _id: 'prod-sofa-01', id: 'prod-sofa-01', name: 'Malmo Minimalist Linen 3-Seater Sofa', slug: 'malmo-minimalist-linen-sofa',
      price: 185000, status: 'active', approvalStatus: 'approved',
      categoryId: { _id: 'cat-sofas', name: 'Sofas & Couches', slug: 'sofas' },
      vendorId: { _id: 'ven-nordic', businessName: 'Nordic Craft Studio' },
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      colorVariants: [{ colorName: 'Oatmeal Linen', colorHex: '#E2DAC8', stock: 5 }]
    }
  ];

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      if (response.data?.data && response.data.data.length > 0) {
        setProducts(response.data.data);
      } else {
        setProducts(SAMPLE_ADMIN_PRODUCTS as any);
      }
      const catResponse = await API.get('/products/categories').catch(() => null);
      if (catResponse?.data?.data && catResponse.data.data.length > 0) {
        setCategories(catResponse.data.data);
      } else {
        setCategories(SAMPLE_ADMIN_CATS as any);
      }
    } catch (err) {
      setProducts(SAMPLE_ADMIN_PRODUCTS as any);
      setCategories(SAMPLE_ADMIN_CATS as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    const defaultCatId = categories.length > 0 ? getProductId(categories[0]) : '';
    reset({
      name: '',
      description: 'Hand-crafted artisan piece designed for modern living spaces.',
      price: 890,
      salePrice: 0,
      categoryId: defaultCatId,
      material: 'Oak Wood & High-Density Bouclé',
      dimensions: {
        width: 60,
        height: 80,
        depth: 65,
        unit: 'cm'
      },
      colorVariants: [{ name: 'Cream White', hex: '#EAE5DB', stock: 20, priceOffset: 0 }],
      images: ['https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800'],
      stock: 20,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    const catObj = prod.categoryId as any;
    const catId = typeof prod.categoryId === 'object' && prod.categoryId ? getProductId(catObj) : getProductId(prod.categoryId);

    reset({
      name: prod.name,
      description: prod.description || 'Premium hand-crafted piece.',
      price: prod.price,
      salePrice: prod.salePrice || 0,
      categoryId: catId,
      material: prod.material,
      dimensions: {
        width: prod.dimensions?.width || 0,
        height: prod.dimensions?.height || 0,
        depth: prod.dimensions?.depth || 0,
        unit: prod.dimensions?.unit || 'cm'
      },
      colorVariants: prod.colorVariants || [{ name: 'Default Finish', hex: '#EAE5DB', stock: prod.stock || 5, priceOffset: 0 }],
      images: prod.images || ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=80'],
      stock: prod.stock || 5,
      status: prod.status || 'draft'
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (productId: string, currentStatus: 'draft' | 'active') => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    try {
      await API.put(`/products/${productId}`, { status: newStatus });
      setProducts(prev =>
        prev.map(p => {
          const idVal = getProductId(p);
          return idVal === productId ? { ...p, status: newStatus } : p;
        })
      );
    } catch (err) {
      alert('Failed to update product approval status.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Delete this product from the platform?')) return;
    try {
      await API.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => getProductId(p) !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setError(null);

    // Recalculate global stock from variants sum
    const totalStock = (data.colorVariants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
    const rawImages = (data as any).images || [];
    const sanitizedImages = rawImages.map((img: any) => {
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img !== null) return img.value || img.url || img['0'] || Object.values(img).find(v => typeof v === 'string') || '';
      return String(img || '');
    }).filter((s: string) => typeof s === 'string' && s.trim().length > 0);

    const finalPayload = {
      ...data,
      images: sanitizedImages.length > 0 ? sanitizedImages : ['https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=800'],
      stock: totalStock
    };

    try {
      if (editingProduct) {
        const targetId = getProductId(editingProduct);
        await API.put(`/products/${targetId}`, finalPayload);
      } else {
        await API.post('/products', finalPayload);
      }
      setIsModalOpen(false);
      fetchCatalog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product details.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Catalog Moderation</h1>
          <p className="text-brand-clay text-sm font-sans">Approve, update, or draft product listings published by studio partners.</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          Add Product +
        </Button>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {products.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No products submitted for moderation yet.</div>
        ) : (
          <Table headers={['Product Name', 'Studio Partner', 'Material', 'Stock', 'Price', 'Status', 'Actions']}>
            {products.map(prod => {
              const partner = prod.vendorId?.businessName || 'Unknown Partner';
              const pId = getProductId(prod);
              return (
                <tr key={pId} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                  <td className="p-4 font-serif font-bold text-left">{prod.name}</td>
                  <td className="p-4 text-left">{partner}</td>
                  <td className="p-4 text-left font-mono text-[10px]">{prod.material}</td>
                  <td className="p-4">{prod.stock}</td>
                  <td className="p-4 font-bold font-mono">₹{prod.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      prod.status === 'active' ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-terracotta/10 text-brand-terracotta'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(prod)}
                      className="px-2 py-1 bg-brand-sand-light hover:bg-brand-sand text-brand-walnut font-bold text-[11px] rounded border border-brand-sand-dark/30 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(pId, prod.status)}
                      className="px-2 py-1 bg-brand-walnut/10 hover:bg-brand-walnut/20 text-brand-walnut font-bold text-[11px] rounded border border-brand-walnut/30 transition-colors cursor-pointer"
                    >
                      {prod.status === 'active' ? 'Draft' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(pId)}
                      className="px-2 py-1 bg-brand-terracotta/10 hover:bg-brand-terracotta/20 text-brand-terracotta font-bold text-[11px] rounded border border-brand-terracotta/30 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Platform Product Details" className="max-w-3xl">
        {error && <div className="mb-4 text-xs font-semibold text-brand-terracotta bg-brand-terracotta/10 p-3">{error}</div>}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 text-xs font-semibold text-brand-terracotta bg-brand-terracotta/10 p-3">
            Please correct the validation errors below to submit the form.
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Product Title *</label>
              <input type="text" {...register('name')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.name && <p className="text-brand-terracotta text-[10px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Category *</label>
              <select {...register('categoryId')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none rounded-none">
                {categories.map(cat => {
                  const catId = cat.id || (cat as any)._id;
                  return (
                    <option key={catId} value={catId}>{cat.name}</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Price (₹) *</label>
              <input type="number" step="any" {...register('price', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.price && <p className="text-brand-terracotta text-[10px] mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Sale Price (₹)</label>
              <input type="number" step="any" {...register('salePrice', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Status *</label>
              <select {...register('status')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none rounded-none">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Description *</label>
            <textarea rows={3} {...register('description')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.description && <p className="text-brand-terracotta text-[10px] mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Material *</label>
              <input type="text" {...register('material')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Width (cm)</label>
                <input type="number" {...register('dimensions.width', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Height (cm)</label>
                <input type="number" {...register('dimensions.height', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Depth (cm)</label>
                <input type="number" {...register('dimensions.depth', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
              </div>
            </div>
          </div>

          {/* Color finishes / Quantities */}
          <div className="space-y-4 pt-4 border-t border-brand-sand-dark/20">
            <div className="flex justify-between items-center">
              <h4 className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Color Finishes & Stock Level *</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ name: '', hex: '', stock: 1, priceOffset: 0 })}>
                Add Finish +
              </Button>
            </div>
            {variantFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input type="text" placeholder="Finish Name" {...register(`colorVariants.${idx}.name`)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-full focus:outline-none" />
                <input type="text" placeholder="Hex Code" {...register(`colorVariants.${idx}.hex`)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-28 text-center focus:outline-none font-mono" />
                <input type="number" placeholder="Stock" {...register(`colorVariants.${idx}.stock`, { valueAsNumber: true })} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-24 text-center focus:outline-none font-mono" />
                <input type="number" placeholder="Offset" {...register(`colorVariants.${idx}.priceOffset`, { valueAsNumber: true })} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-24 text-center focus:outline-none font-mono" />
                <Button type="button" variant="ghost" className="text-brand-terracotta" onClick={() => removeVariant(idx)}>×</Button>
              </div>
            ))}
          </div>

          {/* Picture URLs */}
          <div className="space-y-4 pt-4 border-t border-brand-sand-dark/20">
            <div className="flex justify-between items-center">
              <h4 className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Product Picture URLs *</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => appendImage('' as any)}>
                Add Image URL +
              </Button>
            </div>
            {imageFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 items-center">
                <input type="text" placeholder="https://..." {...register(`images.${idx}` as any)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-full focus:outline-none" />
                <Button type="button" variant="ghost" className="text-brand-terracotta" onClick={() => removeImage(idx)}>×</Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-brand-sand-dark/20">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CatalogModeration;
