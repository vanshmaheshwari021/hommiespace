import { UserRole, OrderStatus, EnquiryStatus, RefundStatus } from '../constants/index.js';
import { Dimension, ColorVariant } from '../schemas/index.js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  userId: string | User;
  businessName: string;
  businessAddress: string;
  phone: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | Category;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string | Category;
  vendorId: string | Vendor;
  material: string;
  dimensions: Dimension;
  colorVariants: ColorVariant[];
  images: string[];
  stock: number;
  status: 'draft' | 'active';
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  qty: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface OrderItem {
  product: Product | string;
  vendorId: string;
  qty: number;
  variantId?: string;
  variantName?: string;
  price: number;
  status: OrderStatus;
}

export interface Order {
  id: string;
  userId: string | User;
  items: OrderItem[];
  totalPrice: number;
  discountAmount: number;
  couponCode?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'cod' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryReply {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  userId: string | User;
  productId: string | Product;
  vendorId: string | Vendor;
  message: string;
  replies: EnquiryReply[];
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string | User;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string; // rich text or layout JSON
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  siteLogo?: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'info' | 'order' | 'enquiry' | 'system';
  read: boolean;
  createdAt: string;
}
