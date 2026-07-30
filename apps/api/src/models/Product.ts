import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '@hommiespace/shared';

export interface ProductDocument extends Omit<Product, 'id' | 'categoryId' | 'vendorId'>, Document {
  categoryId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
}

const colorVariantSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String },
  stock: { type: Number, required: true, default: 0 },
  priceOffset: { type: Number, required: true, default: 0 }
});

const dimensionSchema = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  unit: { type: String, default: 'cm' }
});

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    material: { type: String, required: true },
    dimensions: { type: dimensionSchema, required: true },
    colorVariants: { type: [colorVariantSchema], required: true },
    images: { type: [String], required: true },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['draft', 'active'], default: 'draft' },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
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

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
export default ProductModel;
