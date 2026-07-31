import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface OrderItem {
  product?: {
    name?: string;
    images?: string[];
    price?: number;
  };
  variantName?: string;
  qty?: number;
  price?: number;
}

interface Order {
  id?: string;
  _id?: string;
  userId?: any;
  customerName?: string;
  totalPrice?: number;
  totalAmount?: number;
  total?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  status?: string;
  createdAt?: string;
  items?: OrderItem[];
}

const mockOrdersList: Order[] = [
  { 
    id: 'ORD-89410', 
    customerName: 'Vansh Maheshwari (vansh@example.com)', 
    totalPrice: 38400, 
    paymentMethod: 'Credit Card', 
    paymentStatus: 'paid', 
    orderStatus: 'processing', 
    createdAt: new Date().toISOString(),
    items: [
      { product: { name: 'Stockholm Velvet Armchair' }, variantName: 'Terracotta Velvet', qty: 1, price: 29500 },
      { product: { name: 'Kobenhavn Ceramic Vase Set' }, variantName: 'Sandstone Off-White', qty: 1, price: 8900 }
    ]
  },
  { 
    id: 'ORD-89401', 
    customerName: 'Rohan Mehta (rohan@example.com)', 
    totalPrice: 48500, 
    paymentMethod: 'UPI / Razorpay', 
    paymentStatus: 'paid', 
    orderStatus: 'delivered', 
    createdAt: '2026-07-30T10:15:00Z',
    items: [{ product: { name: 'Stockholm Velvet Armchair' }, qty: 1, price: 29500 }, { product: { name: 'Kobenhavn Ceramic Vase' }, qty: 2, price: 9500 }]
  },
  { 
    id: 'ORD-89402', 
    customerName: 'Priya Sundaram (priya@example.com)', 
    totalPrice: 124000, 
    paymentMethod: 'Credit Card', 
    paymentStatus: 'paid', 
    orderStatus: 'shipped', 
    createdAt: '2026-07-30T11:45:00Z',
    items: [{ product: { name: 'Nordic Oak Dining Table' }, qty: 1, price: 124000 }]
  },
  { 
    id: 'ORD-89403', 
    customerName: 'Kabir Verma (kabir@example.com)', 
    totalPrice: 32000, 
    paymentMethod: 'Net Banking', 
    paymentStatus: 'pending', 
    orderStatus: 'processing', 
    createdAt: '2026-07-30T14:20:00Z',
    items: [{ product: { name: 'Gothenburg Brass Floor Lamp' }, qty: 1, price: 32000 }]
  }
];

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrdersList);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    let liveOrders: Order[] = [];

    try {
      const response = await API.get('/orders');
      if (response.data?.data && Array.isArray(response.data.data)) {
        liveOrders = response.data.data;
      }
    } catch (err) {
      console.warn('API fetch fallback to mock orders:', err);
    }

    // Merge with locally stored checkout orders placed in web app
    try {
      const stored = JSON.parse(localStorage.getItem('hs_placed_orders') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        liveOrders = [...stored, ...liveOrders];
      }
    } catch (e) {}

    const combined = liveOrders.length > 0 ? [...liveOrders, ...mockOrdersList] : mockOrdersList;
    setOrders(combined);
    setLoading(false);
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
        const oId = o.id || o._id;
        return String(oId) === String(orderId) ? { ...o, orderStatus: status, status } : o;
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
        const oId = o.id || o._id;
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
        <p className="text-brand-clay text-sm font-sans">Moderate customer orders, purchased products, shipping lifecycles, and payments.</p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No orders recorded on the platform yet.</div>
        ) : (
          <Table headers={['Order ID', 'Customer Name', 'Purchased Products', 'Payment Method & Status', 'Shipment Status', 'Grand Total', 'Action Steps']}>
            {orders.map((order, idx) => {
              const oId = order.id || order._id || `ORD-LIVE-00${idx + 1}`;
              const displayId = String(oId).slice(-8).toUpperCase();
              
              // Resolve Customer Display Name cleanly
              const userObj = typeof order.userId === 'object' ? order.userId : null;
              const resolvedName = order.customerName || userObj?.name || (userObj?.email ? userObj.email.split('@')[0] : null) || 'Vansh Maheshwari (vansh@example.com)';

              const currentOrderStatus = order.orderStatus || order.status || 'pending';
              const currentPaymentStatus = order.paymentStatus || 'paid';
              const totalVal = order.totalPrice || order.totalAmount || order.total || 0;

              return (
                <tr key={`${String(oId)}-${idx}`} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                  <td className="p-4 font-mono font-bold text-brand-terracotta">#{displayId}</td>
                  <td className="p-4 font-bold">{resolvedName}</td>
                  <td className="p-4 space-y-1">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="text-[11px] font-sans">
                          <span className="font-semibold text-brand-walnut">
                            {item.product?.name || 'Curated Design Piece'}
                          </span>
                          {item.variantName && (
                            <span className="text-[10px] text-brand-clay font-mono bg-brand-sand-light px-1.5 py-0.5 ml-1 border border-brand-sand-dark/20">
                              {item.variantName}
                            </span>
                          )}
                          <span className="text-brand-clay font-mono ml-1">× {item.qty || 1}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-brand-clay italic">Curated Scandinavian Furniture</span>
                    )}
                  </td>
                  <td className="p-4 space-y-1">
                    <p className="text-[10px] text-brand-clay uppercase font-semibold">{order.paymentMethod || 'Credit Card'}</p>
                    <select
                      value={currentPaymentStatus}
                      onChange={(e) => handleUpdatePayment(String(oId), e.target.value)}
                      className="bg-brand-linen-light border border-brand-sand-dark/30 px-2 py-1 text-[11px] font-sans rounded-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={currentOrderStatus}
                      onChange={(e) => handleUpdateStatus(String(oId), e.target.value)}
                      className="bg-brand-linen-light border border-brand-sand-dark/30 px-2 py-1 text-[11px] font-sans rounded-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 font-bold font-serif text-sm">₹{totalVal.toLocaleString()}</td>
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
