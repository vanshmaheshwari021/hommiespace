import mongoose, { Schema, Document } from 'mongoose';

export interface TicketDocument extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  replies: {
    senderRole: 'customer' | 'admin' | 'staff';
    senderName: string;
    message: string;
    createdAt: Date;
  }[];
}

const ticketSchema = new Schema<TicketDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
    replies: [
      {
        senderRole: { type: String, enum: ['customer', 'admin', 'staff'], required: true },
        senderName: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        const r = ret as any;
        delete r._id;
        delete r.__v;
      }
    }
  }
);

export const TicketModel = mongoose.model<TicketDocument>('Ticket', ticketSchema);
export default TicketModel;
