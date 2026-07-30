import mongoose, { Schema, Document } from 'mongoose';
import type { SettingsInput } from '@hommiespace/shared';

export interface SettingsDocument extends Document {
  siteName: string;
  siteLogo?: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  commissionRate: number;
  maintenanceMode: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  googleAnalyticsId?: string;
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    siteName: { type: String, required: true },
    siteLogo: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    currency: { type: String, default: 'INR' },
    taxRate: { type: Number, default: 8 },
    shippingFee: { type: Number, default: 25 },
    commissionRate: { type: Number, default: 10 },
    maintenanceMode: { type: Boolean, default: false },
    heroTitle: { type: String, default: 'Spaces that speak of quiet luxury.' },
    heroSubtitle: { type: String, default: 'Summer Collection 2026' },
    heroDescription: { type: String, default: 'Hand-finished solid wood furniture, organic clays, and textured linens curated from top independent design studios. Built to breathe and crafted to endure.' },
    heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600' },
    footerText: { type: String, default: 'A curated MERN multi-vendor marketplace connecting discerning customers with independent design studios crafting quiet luxury.' },
    seoTitle: { type: String, default: 'HommieSpace | Curated Furniture & Decor' },
    seoDescription: { type: String, default: 'A curated multi-vendor marketplace connecting independent design studios crafting quiet luxury with discerning buyers.' },
    seoKeywords: { type: String, default: 'furniture, minimalist, quiet luxury, travertine table, boucle chair' },
    googleAnalyticsId: { type: String, default: 'G-XXXXXXXXXX' }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        const r = ret as any;
        delete r._id;
        delete r.__v;
      }
    }
  }
);

export const SettingsModel = mongoose.model<SettingsDocument>('Settings', settingsSchema);
export default SettingsModel;
