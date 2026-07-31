import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface Order {
  id: string;
  customerName?: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const mockOrdersList: Order[] = [
  { id: 'ORD-89401', customerName: 'Rohan Mehta', totalPrice: 48500, paymentMethod: 'UPI / Razorpay', paymentStatus: 'paid', orderStatus: 'delivered', createdAt: '2026-07-30T10:15:00Z' },
  { id: 'ORD-89402', customerName: 'Priya Sundaram', totalPrice: 124000, paymentMethod: 'Credit Card', paymentStatus: 'paid', orderStatus: 'shipped', createdAt: '2026-07-30T11:45:00Z' },
  { id: 'ORD-89403', customerName: 'Kabir Verma', totalPrice: 32000, paymentMethod: 'Net Banking', paymentStatus: 'pending', orderStatus: 'processing', createdAt: '2026-07-30T14:20:00Z' },
  { id: 'ORD-89404', customerName: 'Anushka Sen', totalPrice: 16850, paymentMethod: 'UPI', paymentStatus: 'paid', orderStatus: 'delivered', createdAt: '2026-07-30T16:05:00Z' },
  { id: 'ORD-89405', customerName: 'Siddharth Kapoor', totalPrice: 95000, paymentMethod: 'EMI Card', paymentStatus: 'paid', orderStatus: 'shipped', createdAt: '2026-07-30T18:30:00Z' },
  { id: 'ORD-89406', customerName: 'Divya Nambiar', totalPrice: 27900, paymentMethod: 'Credit Card', paymentStatus: 'paid', orderStatus: 'processing', createdAt: '2026-07-31T08:10:00Z' },
  { id: 'ORD-89407', customerName: 'Arjun Singhania', totalPrice: 215000, paymentMethod: 'Wire Transfer', paymentStatus: 'paid', orderStatus: 'shipped', createdAt: '2026-07-31T09:15:00Z' },
  { id: 'ORD-89408', customerName: 'Tanya Banerjee', totalPrice: 14200, paymentMethod: 'UPI', paymentStatus: 'pending', orderStatus: 'pending', createdAt: '2026-07-31T10:30:00Z' },
  { id: 'ORD-89409', customerName: 'Aditya Deshmukh', totalPrice: 63400, paymentMethod: 'Credit Card', paymentStatus: 'paid', orderStatus: 'processing', createdAt: '2026-07-31T11:50:00Z' },
  { id: 'ORD-89410', customerName: 'Neha Bhattacharya', totalPrice: 89000, paymentMethod: 'Net Banking', paymentStatus: 'paid', orderStatus: 'shipped', createdAt: '2026-07-31T12:40:00Z' }
];

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrdersList);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/orders');
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.warn('API fetch fallback to mock orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await API.put(`/orders/${String(orderId)}/status`, { orderStatus: status });
    } catch (err) {
      console.warn('API update fallback:', err);
    }
    setOrders(prev =>
      prev.map(o => {
        const oId = o.id || (o as any)._id;
        return String(oId) === String(orderId) ? { ...o, orderStatus: status } : o;
      })
    );
  };

  const handleUpdatePayment = async (orderId: string, payment: string) => {
    try {
      await API.put(`/orders/${String(orderId)}/status`, { paymentStatus: payment });
    } catch (err) {
      console.warn('API payment update fallback:', err);
    }
    setOrders(prev =>
      prev.map(o => {
        const oId = o.id || (o as any)._id;
        return String(oId) === String(orderId) ? { ...o, paymentStatus: payment } : o;
      })
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Customer Orders Manager</h1>
        <p className="text-brand-clay text-sm font-sans">Moderate order shipping lifecycles and payments across the marketplace.</p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No orders recorded on the platform yet.</div>
        ) : (
          <Table headers={['Order ID', 'Customer Name', 'Payment Method & Status', 'Shipment Status', 'Grand Total', 'Action Steps']}>
            {orders.map(order => {
              const oId = order.id || (order as any)._id;
              return (
                <tr key={String(oId)} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                  <td className="p-4 font-mono font-bold text-brand-terracotta">{String(oId).toUpperCase()}</td>
                  <td className="p-4 font-bold">{order.customerName || 'Customer Account'}</td>
                  <td className="p-4 space-y-1">
                    <p className="text-[10px] text-brand-clay uppercase font-semibold">{order.paymentMethod}</p>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePayment(String(oId), e.target.value)}
                      className="bg-brand-linen-light border border-brand-sand-dark/30 px-2 py-1 text-[11px] font-sans rounded-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(String(oId), e.target.value)}
                      className="bg-brand-linen-light border border-brand-sand-dark/30 px-2 py-1 text-[11px] font-sans rounded-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 font-bold font-serif text-sm">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="p-1 hover:underline text-brand-sage font-semibold text-[10px] uppercase tracking-wider">
                      Print Invoice
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default OrdersManager;
