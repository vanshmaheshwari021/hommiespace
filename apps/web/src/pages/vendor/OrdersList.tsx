import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Skeleton } from '@hommiespace/ui';
import API from '../../api/index.js';

interface Order {
  id: string;
  createdAt: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  items: Array<{
    variantName?: string;
    qty: number;
    price: number;
    productId?: {
      name: string;
    };
  }>;
}

export const VendorOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await API.get('/orders');
      setOrders(response.data.data);
    } catch (err) {
      console.error(err);
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
      setOrders(prev =>
        prev.map(o => {
          const oId = o.id || (o as any)._id;
          return String(oId) === String(orderId) ? { ...o, orderStatus: status } : o;
        })
      );
    } catch (err) {
      alert('Failed to update status.');
    }
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
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Studio Orders</h1>
        <p className="text-brand-clay text-sm font-sans">Ship your custom furniture products and update shipping logs.</p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-brand-clay text-xs font-sans">No orders recorded for your studio catalog yet.</div>
        ) : (
          <Table headers={['Order Ref', 'Date Placed', 'Grand Total', 'Payment', 'Shipment Status', 'Actions']}>
            {orders.map(order => {
              const oId = order.id || (order as any)._id;
              return (
                <tr key={String(oId)} className="hover:bg-brand-sand-light/35 text-xs text-brand-walnut border-b border-brand-sand-dark/10">
                  <td className="p-4 font-mono font-bold">{String(oId).slice(-6).toUpperCase()}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="p-4 capitalize">{order.paymentStatus}</td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(String(oId), e.target.value)}
                      className="bg-brand-linen-light border border-brand-sand-dark/30 px-2 py-1 text-[11px]"
                    >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" onClick={() => window.print()} className="hover:underline text-brand-sage font-semibold">
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

export default VendorOrdersList;
