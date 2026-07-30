import mongoose, { Schema, Document } from 'mongoose';

export interface CommentDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  content: string;
  reply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    reply: { type: String, default: '' }
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

export const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);
export default CommentModel;
