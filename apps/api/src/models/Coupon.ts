import mongoose, { Schema, Document } from 'mongoose';
import type { CouponInput } from '@hommiespace/shared';

export interface CouponDocument extends CouponInput, Document {}

const couponSchema = new Schema<CouponDocument>(
  {
    code: { type: String, required: true, unique: true, index: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    isActive: { type: Boolean, default: true }
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

export const CouponModel = mongoose.model<CouponDocument>('Coupon', couponSchema);
export default CouponModel;
