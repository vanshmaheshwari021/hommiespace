import mongoose, { Schema, Document } from 'mongoose';
import type { CMSPageInput } from '@hommiespace/shared';

export interface CMSPageDocument extends CMSPageInput, Document {}

const cmsPageSchema = new Schema<CMSPageDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true }
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

export const CMSPageModel = mongoose.model<CMSPageDocument>('CMSPage', cmsPageSchema);
export default CMSPageModel;
