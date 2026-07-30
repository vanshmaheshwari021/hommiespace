import mongoose, { Schema, Document } from 'mongoose';

export interface ActivityLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  action: string;
  details?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, default: '' }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

export const ActivityLogModel = mongoose.model<ActivityLogDocument>('ActivityLog', activityLogSchema);
export default ActivityLogModel;
