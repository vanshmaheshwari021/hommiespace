import mongoose, { Schema, Document } from 'mongoose';
import { Vendor } from '@hommiespace/shared';

export interface VendorDocument extends Omit<Vendor, 'id'>, Document {}

const vendorSchema = new Schema<VendorDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    isApproved: { type: Boolean, default: false },
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

export const VendorModel = mongoose.model<VendorDocument>('Vendor', vendorSchema);
export default VendorModel;
