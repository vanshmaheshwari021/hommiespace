import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@hommiespace/shared';

export interface CategoryDocument extends Omit<Category, 'id' | 'parentCategoryId'>, Document {
  parentCategoryId?: mongoose.Types.ObjectId | null;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
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

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);
export default CategoryModel;
