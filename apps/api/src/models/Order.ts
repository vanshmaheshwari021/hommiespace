import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '@hommiespace/shared';

export interface OrderDocument extends Omit<Order, 'id' | 'userId' | 'items'>, Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    product: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    qty: number;
    variantId?: string;
    variantName?: string;
    price: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  }>;
}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  qty: { type: Number, required: true },
  variantId: { type: String },
  variantName: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
});

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    paymentMethod: { type: String, enum: ['card', 'cod', 'paypal'], default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
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

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
export default OrderModel;
