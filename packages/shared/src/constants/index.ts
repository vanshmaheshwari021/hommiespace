export const USER_ROLES = ['customer', 'vendor', 'admin', 'staff'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ENQUIRY_STATUSES = ['pending', 'responded', 'closed'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const REFUND_STATUSES = ['none', 'requested', 'approved', 'rejected'] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];
