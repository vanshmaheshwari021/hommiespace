import mongoose, { Schema, Document } from 'mongoose';
import { Enquiry } from '@hommiespace/shared';

export interface EnquiryDocument extends Omit<Enquiry, 'id' | 'userId' | 'productId' | 'vendorId' | 'replies'>, Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  replies: Array<{
    senderId: mongoose.Types.ObjectId;
    senderName: string;
    senderRole: 'customer' | 'vendor' | 'admin' | 'staff';
    message: string;
    createdAt: Date;
  }>;
}

const replySchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['customer', 'vendor', 'admin', 'staff'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const enquirySchema = new Schema<EnquiryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    message: { type: String, required: true },
    replies: [replySchema],
    status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' }
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

export const EnquiryModel = mongoose.model<EnquiryDocument>('Enquiry', enquirySchema);
export default EnquiryModel;
