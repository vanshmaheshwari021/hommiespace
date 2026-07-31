import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema } from '@hommiespace/shared';
import type { SettingsInput } from '@hommiespace/shared';
import { Button, Card, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await API.get('/settings');
        reset(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    setError(null);
    setSuccess(false);
    try {
      const response = await API.put('/settings', data);
      reset(response.data.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings.');
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
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
          Global Site Settings
        </h1>
        <p className="text-brand-clay text-sm font-sans">
          Configure site metadata, brand logo, support contact details, and base currency.
        </p>
      </div>

      <Card className="p-8 bg-white border border-brand-sand-dark/25" hoverEffect={false}>
        {success && (
          <div className="mb-6 p-4 bg-brand-sage/10 text-brand-sage text-xs font-semibold border border-brand-sage/20">
            Platform settings updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold border border-brand-terracotta/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Site Name *</label>
            <input type="text" {...register('siteName')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.siteName && <p className="text-brand-terracotta text-[10px] mt-1">{errors.siteName.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Brand Logo URL</label>
            <input type="text" {...register('siteLogo')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            {errors.siteLogo && <p className="text-brand-terracotta text-[10px] mt-1">{errors.siteLogo.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Support Contact Email *</label>
              <input type="email" {...register('contactEmail')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.contactEmail && <p className="text-brand-terracotta text-[10px] mt-1">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Support Contact Phone *</label>
              <input type="text" {...register('contactPhone')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
              {errors.contactPhone && <p className="text-brand-terracotta text-[10px] mt-1">{errors.contactPhone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Base Platform Currency</label>
            <select {...register('currency')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none rounded-none">
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="space-y-6 pt-6 border-t border-brand-sand-dark/20">
            <h3 className="font-serif text-base font-bold text-brand-walnut">Storefront CMS & Landing Controls</h3>
            <p className="text-brand-clay text-xs font-sans">Manage homepage hero texts, backdrop visuals, and global footer summaries.</p>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Homepage Hero Title</label>
              <input type="text" {...register('heroTitle')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Homepage Hero Subtitle</label>
              <input type="text" {...register('heroSubtitle')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Homepage Hero Description</label>
              <textarea rows={3} {...register('heroDescription')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Homepage Hero Backdrop Image URL</label>
              <input type="text" {...register('heroImageUrl')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Global Footer Description</label>
              <textarea rows={3} {...register('footerText')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-brand-sand-dark/20">
            <h3 className="font-serif text-base font-bold text-brand-walnut">Global SEO & Tracking Configuration</h3>
            <p className="text-brand-clay text-xs font-sans">Manage global search engine optimization tags, site indexing descriptors, and Google Analytics ids.</p>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Meta Title Tag *</label>
              <input type="text" {...register('seoTitle')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" placeholder="e.g. HommieSpace | Curated Furniture & Quiet Luxury Decor" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Meta Description Tag *</label>
              <textarea rows={3} {...register('seoDescription')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" placeholder="e.g. A curated multi-vendor marketplace connecting independent design studios..." />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Meta Keywords *</label>
              <input type="text" {...register('seoKeywords')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" placeholder="e.g. furniture, minimalist, travertine table, boucle chair" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Google Analytics Measurement ID</label>
              <input type="text" {...register('googleAnalyticsId')} className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none" placeholder="e.g. G-XXXXXXXXXX" />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-sand-dark/20 flex justify-end">
            <Button type="submit" variant="primary" className="py-4 px-8">Save Settings</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
