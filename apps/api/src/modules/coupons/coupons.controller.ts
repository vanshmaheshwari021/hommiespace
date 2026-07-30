import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import CouponModel from '../../models/Coupon.js';

export const getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupons = await CouponModel.find({});
    res.status(200).json({ status: 'success', data: coupons });
  } catch (error) {
    next(error);
  }
};

export const upsertCoupon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const { code, discountType, discountValue, minPurchase, startDate, endDate, isActive } = req.body;
    let coupon = await CouponModel.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      coupon = new CouponModel({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        startDate,
        endDate,
        isActive
      });
    } else {
      coupon.discountType = discountType;
      coupon.discountValue = discountValue;
      coupon.minPurchase = minPurchase;
      coupon.startDate = startDate;
      coupon.endDate = endDate;
      coupon.isActive = isActive;
    }

    await coupon.save();
    res.status(200).json({ status: 'success', data: coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const coupon = await CouponModel.findByIdAndDelete(req.params.id);
    if (!coupon) {
      res.status(404).json({ status: 'error', message: 'Coupon not found.' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Coupon deleted.' });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(404).json({ status: 'error', message: 'Invalid or inactive coupon code.' });
      return;
    }

    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      res.status(400).json({ status: 'error', message: 'Coupon has expired or is not yet active.' });
      return;
    }

    if (subtotal < coupon.minPurchase) {
      res.status(400).json({ status: 'error', message: `Minimum purchase of $${coupon.minPurchase} is required.` });
      return;
    }

    res.status(200).json({ status: 'success', data: coupon });
  } catch (error) {
    next(error);
  }
};
