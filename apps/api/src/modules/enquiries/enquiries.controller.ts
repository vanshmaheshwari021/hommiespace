import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import EnquiryModel from '../../models/Enquiry.js';
import ProductModel from '../../models/Product.js';

export const createEnquiry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { productId, message } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found.' });
      return;
    }

    const enquiry = new EnquiryModel({
      userId: req.user.id,
      customerName: req.user.name || 'Anonymous Customer',
      customerEmail: req.user.email || 'customer@hommiespace.com',
      productId,
      vendorId: product.vendorId,
      message,
      replies: []
    });

    await enquiry.save();

    res.status(201).json({
      status: 'success',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnquiries = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const filter: any = {};
    if (req.user.role === 'vendor') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const vendor = await VendorModel.findOne({ userId: req.user.id });
      if (vendor) {
        filter.vendorId = vendor._id;
      }
    } else if (req.user.role === 'customer') {
      filter.userId = req.user.id;
    }

    const enquiries = await EnquiryModel.find(filter)
      .populate('productId', 'name images')
      .populate('vendorId', 'businessName');

    res.status(200).json({
      status: 'success',
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};
