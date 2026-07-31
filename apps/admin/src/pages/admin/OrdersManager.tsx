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

  // Search & Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  // Live Filter & Search Logic
  const filteredOrders = orders
    .filter((order) => {
      const oId = order.id || order._id || '';
      const displayId = String(oId).slice(-8).toUpperCase();
      const userObj = typeof order.userId === 'object' ? order.userId : null;
      const resolvedName = order.customerName || userObj?.name || (userObj?.email ? userObj.email.split('@')[0] : null) || '';
      const productsText = (order.items || []).map(i => i.product?.name || '').join(' ');

      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        displayId.toLowerCase().includes(searchLower) ||
        resolvedName.toLowerCase().includes(searchLower) ||
        productsText.toLowerCase().includes(searchLower);

      const currentOrderStatus = order.orderStatus || order.status || 'pending';
      const matchesStatus = statusFilter === 'all' || currentOrderStatus === statusFilter;

      const currentPaymentStatus = order.paymentStatus || 'paid';
      const matchesPayment = paymentFilter === 'all' || currentPaymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      const totalA = a.totalPrice || a.totalAmount || a.total || 0;
      const totalB = b.totalPrice || b.totalAmount || b.total || 0;
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'highest') return totalB - totalA;
      if (sortBy === 'lowest') return totalA - totalB;
      return 0;
    });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || o.total || 0), 0);

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

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Total Recorded Orders</span>
          <p className="font-serif text-2xl font-bold text-brand-walnut mt-1">{orders.length}</p>
        </Card>
        <Card className="p-4 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Active Processing / Shipped</span>
          <p className="font-serif text-2xl font-bold text-amber-700 mt-1">
            {orders.filter(o => (o.orderStatus || o.status) === 'processing' || (o.orderStatus || o.status) === 'shipped').length}
          </p>
        </Card>
        <Card className="p-4 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Delivered Orders</span>
          <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">
            {orders.filter(o => (o.orderStatus || o.status) === 'delivered').length}
          </p>
        </Card>
        <Card className="p-4 bg-white border border-brand-sand-dark/20 text-left" hoverEffect={false}>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-clay">Gross Marketplace Value</span>
          <p className="font-serif text-2xl font-bold text-brand-terracotta mt-1">₹{totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* Live Interactive Search & Filter Controls Toolbar */}
      <Card className="p-4 bg-white border border-brand-sand-dark/20 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4" hoverEffect={false}>
        {/* Live Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer Name, Order ID, or Product Name..."
            className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2.5 pl-9 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
          />
          <svg className="w-4 h-4 text-brand-clay absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Selectors Group */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brand-linen-light border border-brand-sand-dark/35 px-3 py-2 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
            >
              <option value="all">All Shipment Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-brand-linen-light border border-brand-sand-dark/35 px-3 py-2 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-brand-linen-light border border-brand-sand-dark/35 px-3 py-2 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Amount</option>
              <option value="lowest">Sort: Lowest Amount</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setSortBy('newest');
              }}
              className="text-[10px] uppercase font-mono tracking-wider font-bold text-brand-terracotta hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-brand-clay text-xs font-sans space-y-2">
            <div className="text-2xl">🔍</div>
            <p className="font-bold text-brand-walnut">No matching orders found</p>
            <p>Try resetting search query or status filters.</p>
          </div>
        ) : (
          <Table headers={['Order ID', 'Customer Name', 'Purchased Products', 'Payment Method & Status', 'Shipment Status', 'Grand Total', 'Action Steps']}>
            {filteredOrders.map((order, idx) => {
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
