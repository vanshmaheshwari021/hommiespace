import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import OrderModel from '../../models/Order.js';
import ProductModel from '../../models/Product.js';
import UserModel from '../../models/User.js';
import VendorModel from '../../models/Vendor.js';
import ActivityLogModel from '../../models/ActivityLog.js';

export const getAnalyticsStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const totalSalesList = await OrderModel.find({ paymentStatus: 'paid' });
    const totalSalesVolume = totalSalesList.reduce((sum, o) => sum + o.totalPrice, 0);

    const totalOrdersCount = await OrderModel.countDocuments();
    const totalVendorsCount = await VendorModel.countDocuments();
    const totalCustomersCount = await UserModel.countDocuments({ role: 'customer' });

    const products = await ProductModel.find({});
    let lowStockCount = 0;
    for (const p of products) {
      if (p.stock <= 5) lowStockCount++;
    }

    const latestOrders = await OrderModel.find({}).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        totalSalesVolume,
        totalOrdersCount,
        totalVendorsCount,
        totalCustomersCount,
        lowStockCount,
        latestOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCSVReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }

    const { type } = req.query;
    let csvContent = '';
    let filename = 'report.csv';

    if (type === 'sales') {
      filename = 'sales_report.csv';
      const orders = await OrderModel.find({}).populate('userId', 'name');
      csvContent = 'Order ID,Customer,Total Amount,Payment Status,Order Status,Date\n';
      orders.forEach(o => {
        const u = typeof o.userId === 'object' ? (o.userId as any)?.name : 'Anonymous';
        csvContent += `${o._id},"${u}",$${o.totalPrice},${o.paymentStatus},${o.orderStatus},${o.createdAt}\n`;
      });
    } else if (type === 'product') {
      filename = 'product_report.csv';
      const products = await ProductModel.find({}).populate('vendorId', 'businessName');
      csvContent = 'Product ID,Name,Price,Stock,Status,Studio Partner\n';
      products.forEach(p => {
        const v = typeof p.vendorId === 'object' ? (p.vendorId as any).businessName : 'Unknown';
        csvContent += `${p._id},"${p.name}",$${p.price},${p.stock},${p.status},"${v}"\n`;
      });
    } else if (type === 'vendor') {
      filename = 'vendor_report.csv';
      const vendors = await VendorModel.find({});
      csvContent = 'Vendor ID,Studio Name,Address,Phone,Approved Status\n';
      vendors.forEach(v => {
        csvContent += `${v._id},"${v.businessName}","${v.businessAddress}",${v.phone},${v.isApproved}\n`;
      });
    } else {
      filename = 'customers_report.csv';
      const customers = await UserModel.find({ role: 'customer' });
      csvContent = 'Customer ID,Name,Email,Date Registered\n';
      customers.forEach(c => {
        csvContent += `${c._id},"${c.name}",${c.email},${c.createdAt}\n`;
      });
    }

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
      return;
    }
    const logs = await ActivityLogModel.find({}).sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ status: 'success', data: logs });
  } catch (error) {
    next(error);
  }
};
