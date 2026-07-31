import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import OrderModel from '../../models/Order.js';
import ProductModel from '../../models/Product.js';
import SettingsModel from '../../models/Settings.js';
import CouponModel from '../../models/Coupon.js';

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const filter: any = {};
    if (req.user.role === 'customer') {
      filter.userId = req.user.id;
    } else if (req.user.role === 'vendor') {
      const { default: VendorModel } = await import('../../models/Vendor.js');
      const vendor = await VendorModel.findOne({ userId: req.user.id });
      if (vendor) {
        filter['items.vendorId'] = vendor._id;
      }
    }

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('items.product', 'name images price');

    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.product', 'name images material price')
      .populate('items.vendorId', 'businessName');

    if (!order) {
      res.status(404).json({ status: 'error', message: 'Order not found.' });
      return;
    }

    if (req.user?.role === 'customer' && order.userId.toString() !== req.user.id) {
      res.status(403).json({ status: 'error', message: 'Forbidden.' });
      return;
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ status: 'error', message: 'Order must contain at least one item.' });
      return;
    }

    const settings = await SettingsModel.findOne({});
    const taxRate = settings?.taxRate || 8;
    const shippingFee = settings?.shippingFee || 25;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const pId = item.product || item.productId || item.id;
      const product = await ProductModel.findById(pId);
      if (!product) {
        res.status(404).json({ status: 'error', message: `Product ${pId} not found.` });
        return;
      }

      const variant = product.colorVariants.find(v => v.name === item.variantName);
      const itemPrice = product.price + (variant?.priceOffset || 0);
      const itemSubtotal = itemPrice * (item.qty || 1);
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        vendorId: product.vendorId,
        variantName: item.variantName || 'Default',
        qty: item.qty || 1,
        price: itemPrice,
        status: 'pending' as const
      });

      if (variant) {
        variant.stock = Math.max(0, variant.stock - (item.qty || 1));
      }
      product.stock = product.colorVariants.reduce((sum, v) => sum + v.stock, 0);
      await product.save();
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (subtotal >= coupon.minPurchase) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round(subtotal * (coupon.discountValue / 100));
          } else {
            discount = coupon.discountValue;
          }
        }
      }
    }

    const tax = Math.round((subtotal - discount) * (taxRate / 100));
    const total = subtotal - discount + tax + shippingFee;

    const defaultAddr = {
      street: '123 Luxury Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    };

    const customerDisplayName = req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Vansh Maheshwari');

    const order = new OrderModel({
      userId: req.user.id,
      customerName: customerDisplayName,
      items: orderItems,
      totalPrice: total,
      discountAmount: discount,
      couponCode: couponCode || undefined,
      shippingAddress: shippingAddress || defaultAddr,
      billingAddress: billingAddress || shippingAddress || defaultAddr,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'card',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending'
    });

    await order.save();
    await order.populate('userId', 'name email');
    await order.populate('items.product', 'name images price');

    res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'vendor' && req.user.role !== 'staff')) {
      res.status(403).json({ status: 'error', message: 'Forbidden.' });
      return;
    }

    const { orderStatus, paymentStatus } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      res.status(404).json({ status: 'error', message: 'Order not found.' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};
