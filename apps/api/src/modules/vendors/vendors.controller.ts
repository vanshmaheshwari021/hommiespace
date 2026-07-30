import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import VendorModel from '../../models/Vendor.js';

export const onboardVendor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'vendor') {
      res.status(403).json({ status: 'error', message: 'Forbidden. Only vendors can update onboarding details.' });
      return;
    }

    const { businessName, businessAddress, phone, description, logoUrl, bannerUrl } = req.body;

    let vendor = await VendorModel.findOne({ userId: req.user.id });

    if (!vendor) {
      vendor = new VendorModel({
        userId: req.user.id,
        businessName,
        businessAddress,
        phone,
        description,
        logoUrl,
        bannerUrl,
        isApproved: true // Auto-approve in dev environment
      });
    } else {
      vendor.businessName = businessName;
      vendor.businessAddress = businessAddress;
      vendor.phone = phone;
      vendor.description = description;
      vendor.logoUrl = logoUrl;
      vendor.bannerUrl = bannerUrl;
      // In dev, keep approved status so preview does not break
      vendor.isApproved = true;
    }

    await vendor.save();

    res.status(200).json({
      status: 'success',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.userId || req.user?.id;
    const vendor = await VendorModel.findOne({ userId });
    if (!vendor) {
      res.status(404).json({ status: 'error', message: 'Vendor profile not found.' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

export const approveVendor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isApproved } = req.body;
    const vendor = await VendorModel.findById(req.params.id);
    if (!vendor) {
      res.status(404).json({ status: 'error', message: 'Vendor not found.' });
      return;
    }

    vendor.isApproved = isApproved;
    await vendor.save();

    res.status(200).json({
      status: 'success',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVendors = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vendors = await VendorModel.find({}).populate('userId', 'name email role');
    res.status(200).json({
      status: 'success',
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};
