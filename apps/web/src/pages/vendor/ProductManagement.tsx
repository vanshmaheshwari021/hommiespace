import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@hommiespace/shared';
import type { ProductInput } from '@hommiespace/shared';
import { Button, Card, Table, Modal, EmptyState, Skeleton } from '@hommiespace/ui';
import { useAuthStore } from '../../store/auth.js';
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
  categoryId: Category | string;
  vendorId: string;
  material: string;
  dimensions: { width: number; height: number; depth: number; unit: string };
  colorVariants: { name: string; hex: string; stock: number; priceOffset: number }[];
  images: string[];
  stock: number;
  status: 'draft' | 'active';
  rating: number;
  numReviews: number;
}

export const ProductManagement: React.FC = () => {
  const { vendor } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Setup form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      material: '',
      dimensions: { width: 0, height: 0, depth: 0, unit: 'cm' },
      colorVariants: [{ name: 'Default', hex: '#FFFFFF', stock: 10, priceOffset: 0 }],
      images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'],
      stock: 10,
      status: 'draft'
    }
  });

  // Dynamic arrays for colorVariants & image URLs
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'colorVariants'
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images' as any
  });

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const catRes = await API.get('/products/categories');
      setCategories(catRes.data.data);

      if (vendor) {
        const prodRes = await API.get(`/products?vendorId=${vendor.id}`);
        setProducts(prodRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [vendor]);

  // Open modal for editing
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    
    // Map to Zod schema inputs
    const catObj = product.categoryId as any;
    const catId = typeof product.categoryId === 'object' && product.categoryId ? (catObj.id || catObj._id) : product.categoryId;
    
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      categoryId: catId,
      material: product.material,
      dimensions: product.dimensions,
      colorVariants: product.colorVariants,
      images: product.images,
      stock: product.stock,
      status: product.status
    });
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAddClick = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      salePrice: undefined,
      categoryId: categories[0]?.id || (categories[0] as any)?._id || '',
      material: '',
      dimensions: { width: 0, height: 0, depth: 0, unit: 'cm' },
      colorVariants: [{ name: 'Default', hex: '#FFFFFF', stock: 10, priceOffset: 0 }],
      images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800'],
      stock: 10,
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => {
        const idVal = p.id || (p as any)._id;
        return idVal !== productId;
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setError(null);
    
    // Calculate global stock as sum of variant stocks
    const totalStock = (data.colorVariants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
    const rawImages = (data as any).images || [];
    const sanitizedImages = rawImages.map((img: any) => {
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img !== null) return img.value || img.url || img['0'] || Object.values(img).find(v => typeof v === 'string') || '';
      return String(img || '');
    }).filter((s: string) => typeof s === 'string' && s.trim().length > 0);

    const finalData = { 
      ...data, 
      images: sanitizedImages.length > 0 ? sanitizedImages : (editingProduct?.images || ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=80']),
      stock: totalStock 
    };

    try {
      if (editingProduct) {
        const targetId = editingProduct.id || (editingProduct as any)._id;
        await API.put(`/products/${String(targetId)}`, finalData);
      } else {
        await API.post('/products', finalData);
      }
      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product details.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
            Catalog Management
          </h1>
          <p className="text-brand-clay text-sm font-sans">
            Post and moderate listings in your partner showroom.
          </p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          Add New Piece +
        </Button>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {products.length === 0 ? (
          <EmptyState
            title="No Catalog Listings Found"
            description="Start showcasing your independent furniture collection to customers."
            actionLabel="Add Your First Piece"
            onAction={handleAddClick}
          />
        ) : (
          <Table headers={['Item', 'Material', 'Price', 'Stock', 'Status', 'Actions']}>
            {products.map(prod => {
              const pId = prod.id || (prod as any)._id;
              const safeId = typeof pId === 'object' ? (pId.toString ? pId.toString() : String(pId)) : String(pId || '');
              return (
                <tr key={safeId} className="hover:bg-brand-sand-light/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-12 bg-brand-sand/15 overflow-hidden flex-shrink-0">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-brand-walnut text-sm">{prod.name}</h4>
                      <p className="text-brand-clay text-[10px] uppercase tracking-wider font-semibold font-sans mt-0.5">
                        {typeof prod.categoryId === 'object' ? (prod.categoryId as any).name : 'Unknown Category'}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 font-sans text-brand-clay">{prod.material}</td>
                  <td className="p-4 font-semibold text-brand-walnut">
                    {prod.salePrice ? (
                      <div className="flex flex-col">
                        <span className="text-brand-terracotta">₹{prod.salePrice}</span>
                        <span className="text-[10px] line-through text-brand-clay">₹{prod.price}</span>
                      </div>
                    ) : (
                      <span>₹{prod.price}</span>
                    )}
                  </td>
                  <td className="p-4 font-sans text-brand-clay">{prod.stock} items</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold 
                      ${prod.status === 'active' ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-terracotta/10 text-brand-terracotta'}`}>
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
                      onClick={() => handleDeleteClick(safeId)}
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

      {/* Edit / Create Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Modify Showcase Piece' : 'Showcase New Design Piece'}
        className="max-w-3xl"
      >
        {error && (
          <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/20">
            {error}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/20">
            Please correct the validation errors below to save changes.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left max-h-[70vh] overflow-y-auto pr-2">
          {/* Base Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Product Title *</label>
              <input type="text" {...register('name')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors" />
              {errors.name && <p className="text-brand-terracotta text-[10px] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Category *</label>
              <select {...register('categoryId')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none">
                {categories.map(cat => {
                  const catId = cat.id || (cat as any)._id;
                  return (
                    <option key={catId} value={catId}>{cat.name}</option>
                  );
                })}
              </select>
              {errors.categoryId && <p className="text-brand-terracotta text-[10px] mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Price (₹) *</label>
              <input type="number" step="any" {...register('price', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.price && <p className="text-brand-terracotta text-[10px] mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Sale Price (₹) (Optional)</label>
              <input type="number" step="any" {...register('salePrice', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Listing Status *</label>
              <select {...register('status')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none rounded-none">
                <option value="draft">Draft / Offline</option>
                <option value="active">Active / Online</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Material / Finishes *</label>
              <input type="text" {...register('material')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" placeholder="Steam-bent white ash, paper cord" />
              {errors.material && <p className="text-brand-terracotta text-[10px] mt-1">{errors.material.message}</p>}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Dimensions (W x H x D) *</label>
                <div className="flex gap-1">
                  <input type="number" placeholder="W" {...register('dimensions.width', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
                  <input type="number" placeholder="H" {...register('dimensions.height', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
                  <input type="number" placeholder="D" {...register('dimensions.depth', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs focus:outline-none text-center" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Unit</label>
                <input type="text" {...register('dimensions.unit')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs text-center focus:outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Item Description *</label>
            <textarea {...register('description')} rows={3} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.description && <p className="text-brand-terracotta text-[10px] mt-1">{errors.description.message}</p>}
          </div>

          {/* Color Variants Dynamic Form */}
          <div className="border-t border-brand-sand-dark/15 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-sm font-bold text-brand-walnut">Color / Materials Variants *</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ name: 'New Variant', hex: '#FFFFFF', stock: 5, priceOffset: 0 })}>
                Add Variant +
              </Button>
            </div>
            <div className="space-y-3">
              {variantFields.map((field, idx) => (
                <div key={field.id} className="flex gap-3 items-center">
                  <input type="text" placeholder="Name (e.g. Sage Linen)" {...register(`colorVariants.${idx}.name`)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-full focus:outline-none" />
                  <input type="text" placeholder="Hex (e.g. #8C9A86)" {...register(`colorVariants.${idx}.hex`)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-28 text-center focus:outline-none font-mono" />
                  <input type="number" placeholder="Stock" {...register(`colorVariants.${idx}.stock`, { valueAsNumber: true })} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-20 text-center focus:outline-none" />
                  <input type="number" placeholder="Price Offset" {...register(`colorVariants.${idx}.priceOffset`, { valueAsNumber: true })} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-24 text-center focus:outline-none" />
                  {variantFields.length > 1 && (
                    <Button type="button" variant="ghost" className="text-brand-terracotta hover:underline uppercase text-[9px] font-bold py-1 px-2" onClick={() => removeVariant(idx)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image URLs Dynamic Form */}
          <div className="border-t border-brand-sand-dark/15 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-sm font-bold text-brand-walnut">Showcase Image URLs *</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => appendImage('https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' as any)}>
                Add Image +
              </Button>
            </div>
            <div className="space-y-3">
              {imageFields.map((field, idx) => (
                <div key={field.id} className="flex gap-3 items-center">
                  <input type="text" placeholder="https://..." {...register(`images.${idx}` as any)} className="bg-brand-linen-light border border-brand-sand-dark/35 p-2 text-xs w-full focus:outline-none" />
                  {imageFields.length > 1 && (
                    <Button type="button" variant="ghost" className="text-brand-terracotta hover:underline uppercase text-[9px] font-bold py-1 px-2" onClick={() => removeImage(idx)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-brand-sand-dark/20 pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? 'Save Changes' : 'Post Showcase Piece'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
