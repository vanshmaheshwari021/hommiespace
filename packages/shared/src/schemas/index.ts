import { z } from 'zod';
import { USER_ROLES, ORDER_STATUSES, ENQUIRY_STATUSES } from '../constants/index.js';

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'vendor']).default('customer')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Vendor Schemas
export const vendorOnboardingSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessAddress: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal(''))
});

// Product Schemas
export const dimensionSchema = z.object({
  width: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().positive('Width must be positive')),
  height: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().positive('Height must be positive')),
  depth: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().positive('Depth must be positive')),
  unit: z.string().default('cm')
});

export const colorVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  hex: z.preprocess(
    (val) => {
      if (!val || typeof val !== 'string') return '';
      const trimmed = val.trim();
      if (!trimmed) return '';
      if (!trimmed.startsWith('#') && /^[A-Fa-f0-9]{3,6}$/.test(trimmed)) return `#${trimmed}`;
      return trimmed;
    },
    z.string().optional()
  ),
  stock: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().int().nonnegative('Stock cannot be negative')),
  priceOffset: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().default(0))
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().positive('Price must be positive')),
  salePrice: z.preprocess((val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)), z.number().nonnegative().optional()),
  categoryId: z.string().min(1, 'Category is required'),
  material: z.string().min(2, 'Material is required'),
  dimensions: dimensionSchema,
  colorVariants: z.array(colorVariantSchema).min(1, 'At least one color variant is required'),
  images: z.preprocess(
    (val) => {
      if (!Array.isArray(val)) return [];
      return val.map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.value || item.url || item['0'] || Object.values(item).find(v => typeof v === 'string') || '';
        }
        return String(item || '');
      }).filter(s => typeof s === 'string' && s.trim().length > 0);
    },
    z.array(z.string().min(1, 'Image path cannot be empty')).min(1, 'At least one image is required')
  ),
  stock: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().int().nonnegative('Global stock must be non-negative')),
  status: z.enum(['draft', 'active']).default('draft')
});

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(), // optional if product has only one default variant
  qty: z.number().int().positive('Quantity must be at least 1')
});

// Order Schemas
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  country: z.string().min(2, 'Country is required')
});

export const orderCreateSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.enum(['card', 'cod', 'paypal']).default('card'),
  couponCode: z.string().optional()
});

// Enquiry Schemas
export const enquiryCreateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const enquiryReplySchema = z.object({
  replyMessage: z.string().min(5, 'Reply must be at least 5 characters')
});

// Review Schemas
export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters')
});

// Coupon Schemas
export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive('Discount value must be positive'),
  minPurchase: z.number().nonnegative().default(0),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().default(true)
});

// CMS Schemas
export const cmsPageSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  content: z.string().min(1, 'Content is required')
});

// Site Settings Schema
export const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name is required'),
  siteLogo: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10),
  currency: z.string().default('INR'),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  footerText: z.string().optional(),
  taxRate: z.number().optional(),
  shippingFee: z.number().optional(),
  commissionRate: z.number().optional(),
  maintenanceMode: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  googleAnalyticsId: z.string().optional()
});

// Types from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VendorOnboardingInput = z.infer<typeof vendorOnboardingSchema>;
export type Dimension = z.infer<typeof dimensionSchema>;
export type ColorVariant = z.infer<typeof colorVariantSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type EnquiryCreateInput = z.infer<typeof enquiryCreateSchema>;
export type EnquiryReplyInput = z.infer<typeof enquiryReplySchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type CMSPageInput = z.infer<typeof cmsPageSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
