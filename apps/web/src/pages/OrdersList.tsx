import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { Card, Table, Button, Skeleton } from '@hommiespace/ui';
import API from '../api/index.js';

interface Order {
  id: string;
  totalPrice: number;
  discountAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    variantName?: string;
    qty: number;
    price: number;
    productId?: {
      name: string;
      images: string[];
    };
  }>;
}

export const OrdersList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile/orders');
      return;
    }

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
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 bg-brand-linen-light min-h-screen">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">My Orders</h1>
        <p className="text-brand-clay text-sm font-sans">Track order shipment status or review transaction details.</p>
      </div>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {orders.length === 0 ? (
          <div className="p-12 text-center text-brand-clay text-xs font-sans">
            You haven't placed any orders yet.
          </div>
        ) : (
          <Table headers={['Order ID', 'Date Placed', 'Items Count', 'Payment', 'Status', 'TotalPaid', 'Actions']}>
            {orders.map(order => {
              const totalItemsCount = order.items.reduce((sum, item) => sum + item.qty, 0);
              return (
                <tr key={order.id} className="hover:bg-brand-sand-light/35 transition-colors border-b border-brand-sand-dark/15 text-xs text-brand-walnut font-sans">
                  <td className="p-4 font-mono font-bold">{order.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">{totalItemsCount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      order.paymentStatus === 'paid' ? 'bg-brand-sage/10 text-brand-sage' : 'bg-brand-sand-dark/20 text-brand-clay'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize font-semibold text-brand-walnut">{order.orderStatus}</span>
                  </td>
                  <td className="p-4 font-bold font-serif">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="text-brand-sage hover:underline">
                      Invoice
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

export default OrdersList;
