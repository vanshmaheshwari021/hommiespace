import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendorOnboardingSchema } from '@hommiespace/shared';
import type { VendorOnboardingInput } from '@hommiespace/shared';
import { Button, Card } from '@hommiespace/ui';
import { useAuthStore } from '../../store/auth.js';
import API from '../../api/index.js';

export const Onboarding: React.FC = () => {
  const { vendor, updateVendor } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VendorOnboardingInput>({
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      businessName: vendor?.businessName || '',
      businessAddress: vendor?.businessAddress || '',
      phone: vendor?.phone || '',
      description: vendor?.description || '',
      logoUrl: vendor?.logoUrl || '',
      bannerUrl: vendor?.bannerUrl || ''
    }
  });

  const onSubmit = async (data: VendorOnboardingInput) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      // Send onboarding details update to the server
      const response = await API.put('/vendors/onboard', data);
      updateVendor(response.data.data);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update onboarding profile. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">
          Studio Onboarding Profile
        </h1>
        <p className="text-brand-clay text-sm font-sans">
          Provide your business credentials and catalog brand biography. Admin approval is required for updates.
        </p>
      </div>

      <Card className="p-8 bg-white border border-brand-sand-dark/25" hoverEffect={false}>
        {success && (
          <div className="mb-6 p-4 bg-brand-sage/10 text-brand-sage text-xs font-semibold uppercase tracking-wider border border-brand-sage/20">
            Studio profile updated successfully! Pending review.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Business Name *
              </label>
              <input
                type="text"
                {...register('businessName')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="Nordic Designs"
              />
              {errors.businessName && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Business Contact Phone *
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="+45 88 88 88 88"
              />
              {errors.phone && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
              Business Address *
            </label>
            <input
              type="text"
              {...register('businessAddress')}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
              placeholder="102 Design Avenue, Copenhagen"
            />
            {errors.businessAddress && (
              <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                {errors.businessAddress.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
              Studio Biography / Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
              placeholder="Tell customers about your craftsmanship, values, and design ethos..."
            />
            {errors.description && (
              <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                {...register('logoUrl')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="https://..."
              />
              {errors.logoUrl && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.logoUrl.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Banner URL (Optional)
              </label>
              <input
                type="text"
                {...register('bannerUrl')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="https://..."
              />
              {errors.bannerUrl && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.bannerUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="py-4 px-8"
              disabled={loading}
            >
              {loading ? 'Saving Profile...' : 'Save Onboarding Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Onboarding;
