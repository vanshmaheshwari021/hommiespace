import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';

interface OrderItem {
  product: {
    name: string;
    images: string[];
    price: number;
  };
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
  };
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Address state for saving
  const [street, setStreet] = useState('124 Luxury Studio Ave, Golf Course Road');
  const [city, setCity] = useState('Gurugram / NCR');
  const [state, setState] = useState('Haryana');
  const [zipCode, setZipCode] = useState('122002');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders/my-orders');
        setOrders(response.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-[85vh] bg-brand-linen py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Banner Card */}
        <Card className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl text-left" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-brand-sand-dark/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3D2E26] text-brand-linen flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-brand-walnut">{user.name}</h1>
                  <span className="bg-brand-terracotta/15 text-brand-terracotta px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest font-mono">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-brand-clay font-sans mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/products">
                <Button variant="outline" size="sm" className="text-xs font-serif uppercase tracking-wider">
                  Browse Catalog
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { logout(); navigate('/login'); }}
                className="text-xs uppercase font-mono text-brand-terracotta hover:bg-brand-terracotta/10"
              >
                Log Out
              </Button>
            </div>
          </div>

          {/* Profile Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center font-sans">
            <div className="p-4 bg-brand-sand-light/50 border border-brand-sand-dark/15">
              <span className="block font-serif font-bold text-2xl text-brand-walnut">{orders.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-brand-clay font-semibold">Total Orders</span>
            </div>
            <div className="p-4 bg-brand-sand-light/50 border border-brand-sand-dark/15">
              <span className="block font-serif font-bold text-2xl text-brand-terracotta">
                {orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-brand-clay font-semibold">Active Shipments</span>
            </div>
            <div className="p-4 bg-brand-sand-light/50 border border-brand-sand-dark/15">
              <span className="block font-serif font-bold text-2xl text-brand-walnut">1</span>
              <span className="text-[10px] uppercase tracking-wider text-brand-clay font-semibold">Saved Address</span>
            </div>
          </div>
        </Card>

        {/* Profile Navigation Tabs */}
        <div className="flex border-b border-brand-sand-dark/30 gap-8 text-xs font-serif uppercase font-bold tracking-widest text-left">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-brand-terracotta text-brand-terracotta'
                : 'border-transparent text-brand-clay hover:text-brand-walnut'
            }`}
          >
            📦 My Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-brand-terracotta text-brand-terracotta'
                : 'border-transparent text-brand-clay hover:text-brand-walnut'
            }`}
          >
            📍 Delivery Addresses
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-brand-terracotta text-brand-terracotta'
                : 'border-transparent text-brand-clay hover:text-brand-walnut'
            }`}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* Tab Content 1: Orders & Shipment Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6 text-left">
            {loading ? (
              <Card className="p-8 text-center text-brand-clay" hoverEffect={false}>
                Loading your order history...
              </Card>
            ) : orders.length === 0 ? (
              <Card className="p-12 text-center bg-white border border-brand-sand-dark/25" hoverEffect={false}>
                <div className="text-4xl mb-3">🛍️</div>
                <h3 className="font-serif text-lg font-bold text-brand-walnut mb-2">No Orders Found Yet</h3>
                <p className="text-xs text-brand-clay max-w-md mx-auto mb-6">
                  You haven't placed any orders yet. Explore our curated Scandinavian furniture and decor pieces!
                </p>
                <Link to="/products">
                  <Button variant="primary" className="py-3 px-8 bg-[#3D2E26] text-white">
                    Explore Collection →
                  </Button>
                </Link>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order._id} className="p-6 bg-white border border-brand-sand-dark/25 shadow-md" hoverEffect={false}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-brand-sand-dark/15 gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-brand-walnut">
                          Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest ${
                          order.status === 'delivered' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : order.status === 'shipped'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-brand-clay font-mono block mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-brand-clay block">Total Amount</span>
                      <span className="font-serif font-bold text-lg text-brand-terracotta">
                        ₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress Tracker */}
                  <div className="py-6 border-b border-brand-sand-dark/15">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-brand-terracotta text-white mx-auto flex items-center justify-center text-xs font-bold shadow">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-brand-walnut block">Confirmed</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                          order.status !== 'pending' ? 'bg-brand-terracotta text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                        }`}>
                          {order.status !== 'pending' ? '✓' : '2'}
                        </div>
                        <span className="text-[10px] font-bold text-brand-walnut block">Processing</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                          order.status === 'shipped' || order.status === 'delivered' ? 'bg-brand-terracotta text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                        }`}>
                          {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '3'}
                        </div>
                        <span className="text-[10px] font-bold text-brand-walnut block">Shipped</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                          order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                        }`}>
                          {order.status === 'delivered' ? '✓' : '4'}
                        </div>
                        <span className="text-[10px] font-bold text-brand-walnut block">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="pt-4 space-y-3">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-sans">
                        <span className="text-brand-walnut font-medium">
                          {item.product?.name || 'Curated Product'} x {item.qty}
                        </span>
                        <span className="text-brand-clay font-mono">
                          ₹{((item.price || 0) * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab Content 2: Delivery Address Management */}
        {activeTab === 'addresses' && (
          <Card className="p-8 bg-white border border-brand-sand-dark/25 text-left space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg font-bold text-brand-walnut">Saved Shipping Address</h3>

            {addressSaved && (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider border border-emerald-300">
                ✓ Address updated successfully!
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); setAddressSaved(true); setTimeout(() => setAddressSaved(false), 3000); }} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    Pincode / Postal Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="py-3 px-8 bg-[#3D2E26] text-white">
                Save Address Details
              </Button>
            </form>
          </Card>
        )}

        {/* Tab Content 3: Security & Account Settings */}
        {activeTab === 'settings' && (
          <Card className="p-8 bg-white border border-brand-sand-dark/25 text-left space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg font-bold text-brand-walnut">Account Credentials</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full bg-brand-sand-light/50 border border-brand-sand-dark/20 px-4 py-3 text-xs font-sans text-brand-walnut cursor-not-allowed rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-brand-sand-light/50 border border-brand-sand-dark/20 px-4 py-3 text-xs font-sans text-brand-walnut cursor-not-allowed rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                  Account Type
                </label>
                <input
                  type="text"
                  value={user.role.toUpperCase()}
                  disabled
                  className="w-full bg-brand-sand-light/50 border border-brand-sand-dark/20 px-4 py-3 text-xs font-sans text-brand-walnut font-mono cursor-not-allowed rounded-none"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
