import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationDocument extends Document {
  recipient: mongoose.Types.ObjectId; // User receiving the notification
  type: string; // e.g. 'order_update', 'vendor_approval', 'enquiry_reply', 'low_stock', 'new_order', 'admin_alert'
  message: string;
  isRead: boolean;
  actionUrl?: string; // Optional URL path to redirect when clicked
  performedBy?: mongoose.Types.ObjectId; // User who triggered it
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' }
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

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', notificationSchema);
export default NotificationModel;
