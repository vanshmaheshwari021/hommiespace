import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import SettingsModel from '../../models/Settings.js';
import ActivityLogModel from '../../models/ActivityLog.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = new SettingsModel({
        siteName: 'HommieSpace',
        siteLogo: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=80',
        contactEmail: 'support@hommiespace.com',
        contactPhone: '+1 555 555 5555',
        currency: 'INR',
        taxRate: 8,
        shippingFee: 25,
        commissionRate: 10,
        maintenanceMode: false,
        heroTitle: 'Spaces that speak of quiet luxury.',
        heroSubtitle: 'Summer Collection 2026',
        heroDescription: 'Hand-finished solid wood furniture, organic clays, and textured linens curated from top independent design studios. Built to breathe and crafted to endure.',
        heroImageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600',
        footerText: 'A curated MERN multi-vendor marketplace connecting discerning customers with independent design studios crafting quiet luxury.',
        seoTitle: 'HommieSpace | Curated Furniture & Decor',
        seoDescription: 'A curated multi-vendor marketplace connecting independent design studios crafting quiet luxury with discerning buyers.',
        seoKeywords: 'furniture, minimalist, quiet luxury, travertine table, boucle chair',
        googleAnalyticsId: 'G-XXXXXXXXXX'
      });
      await settings.save();
    }
    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const { 
      siteName, siteLogo, contactEmail, contactPhone, currency, 
      taxRate, shippingFee, commissionRate, maintenanceMode,
      heroTitle, heroSubtitle, heroDescription, heroImageUrl,
      footerText, seoTitle, seoDescription, seoKeywords, googleAnalyticsId
    } = req.body;
    let settings = await SettingsModel.findOne({});

    if (!settings) {
      settings = new SettingsModel({ 
        siteName, siteLogo, contactEmail, contactPhone, currency, 
        taxRate, shippingFee, commissionRate, maintenanceMode,
        heroTitle, heroSubtitle, heroDescription, heroImageUrl,
        footerText, seoTitle, seoDescription, seoKeywords, googleAnalyticsId
      });
    } else {
      settings.siteName = siteName;
      settings.siteLogo = siteLogo;
      settings.contactEmail = contactEmail;
      settings.contactPhone = contactPhone;
      settings.currency = currency;
      if (taxRate !== undefined) settings.taxRate = taxRate;
      if (shippingFee !== undefined) settings.shippingFee = shippingFee;
      if (commissionRate !== undefined) settings.commissionRate = commissionRate;
      if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
      if (heroTitle !== undefined) settings.heroTitle = heroTitle;
      if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
      if (heroDescription !== undefined) settings.heroDescription = heroDescription;
      if (heroImageUrl !== undefined) settings.heroImageUrl = heroImageUrl;
      if (footerText !== undefined) settings.footerText = footerText;
      if (seoTitle !== undefined) settings.seoTitle = seoTitle;
      if (seoDescription !== undefined) settings.seoDescription = seoDescription;
      if (seoKeywords !== undefined) settings.seoKeywords = seoKeywords;
      if (googleAnalyticsId !== undefined) settings.googleAnalyticsId = googleAnalyticsId;
    }

    await settings.save();

    const log = new ActivityLogModel({
      userId: req.user.id,
      userName: req.user.name,
      action: 'Updated Platform Settings & SEO Configuration',
      details: `Updated site settings for ${settings.siteName}.`
    });
    await log.save();

    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    next(error);
  }
};
