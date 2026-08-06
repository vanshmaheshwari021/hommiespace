import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { couponSchema } from '@hommiespace/shared';
import type { CouponInput } from '@hommiespace/shared';
import { Button, Card, Table, Modal, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema)
  });

  const SAMPLE_COUPONS = [
    {
      _id: 'c-01', id: 'c-01',
      code: 'WELCOME10', discountType: 'percentage', discountValue: 10,
      minPurchase: 5000, isActive: true,
      startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.000Z'
    },
    {
      _id: 'c-02', id: 'c-02',
      code: 'LUXURY20', discountType: 'percentage', discountValue: 20,
      minPurchase: 50000, isActive: true,
      startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.000Z'
    },
    {
      _id: 'c-03', id: 'c-03',
      code: 'STUDIO15', discountType: 'percentage', discountValue: 15,
      minPurchase: 25000, isActive: true,
      startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.000Z'
    }
  ];

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await API.get('/coupons');
      if (response.data?.data && response.data.data.length > 0) {
        setCoupons(response.data.data);
      } else {
        setCoupons(SAMPLE_COUPONS as any);
      }
    } catch (err) {
      setCoupons(SAMPLE_COUPONS as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddClick = () => {
    reset({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      startDate: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (couponId: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/coupons/${couponId}`);
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    } catch (err) {
      alert('Failed to delete coupon.');
    }
  };

  const onSubmit = async (data: CouponInput) => {
    setError(null);
    try {
      await API.post('/coupons', data);
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save coupon.');
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
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Coupons & Offers</h1>
          <p className="text-brand-clay text-sm font-sans">Manage checkout discount promotional coupon codes.</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>Create Coupon +</Button>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {coupons.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No coupon offers configured yet.</div>
        ) : (
          <Table headers={['Coupon Code', 'Discount Type', 'Value', 'Min Purchase', 'Start Date', 'End Date', 'Status', 'Actions']}>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                <td className="p-4 font-mono font-bold">{coupon.code}</td>
                <td className="p-4 capitalize">{coupon.discountType}</td>
                <td className="p-4 font-bold">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </td>
                <td className="p-4">₹{coupon.minPurchase}</td>
                <td className="p-4">{new Date(coupon.startDate).toLocaleDateString()}</td>
                <td className="p-4">{new Date(coupon.endDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    coupon.isActive ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-terracotta/10 text-brand-terracotta'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(coupon.id)} className="text-brand-terracotta hover:underline">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Coupon Offer">
        {error && <div className="mb-4 text-xs font-semibold text-brand-terracotta bg-brand-terracotta/10 p-3">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Coupon Code *</label>
            <input type="text" {...register('code')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-mono text-brand-walnut focus:outline-none uppercase" placeholder="WELCOME20" />
            {errors.code && <p className="text-brand-terracotta text-[10px] mt-1">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Type *</label>
              <select {...register('discountType')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none rounded-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Price (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Discount Value *</label>
              <input type="number" {...register('discountValue', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.discountValue && <p className="text-brand-terracotta text-[10px] mt-1">{errors.discountValue.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Min Purchase Target (₹)</label>
            <input type="number" {...register('minPurchase', { valueAsNumber: true })} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Start Date *</label>
              <input type="text" {...register('startDate')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-mono text-brand-walnut focus:outline-none" placeholder="2026-01-01T00:00:00Z" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">End Date *</label>
              <input type="text" {...register('endDate')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-mono text-brand-walnut focus:outline-none" placeholder="2027-12-31T23:59:59Z" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-sand-dark/20">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CouponsPage;
