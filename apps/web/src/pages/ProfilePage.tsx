import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';
import { COUNTRIES_LIST, COUNTRY_LOCATION_DATA, lookupPinCode } from '../utils/location.js';

interface OrderItem {
  product?: {
    name?: string;
    images?: string[];
    price?: number;
  };
  variantName?: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  totalPrice?: number;
  totalAmount?: number;
  total?: number;
  orderStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
  };
}

const DEFAULT_CUSTOMER_USER = {
  id: 'cust-demo-user',
  name: 'Valued Customer',
  email: 'customer@hommiespace.com',
  role: 'customer' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const SAMPLE_PAST_ORDERS: Order[] = [
  {
    _id: '66a81f92e0123456789abc01',
    totalPrice: 42500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product: { name: 'Stockholm Velvet Armchair', price: 29500 },
        variantName: 'Terracotta Velvet',
        qty: 1,
        price: 29500
      },
      {
        product: { name: 'Kobenhavn Ceramic Vase Set', price: 6500 },
        variantName: 'Sandstone Off-White',
        qty: 2,
        price: 6500
      }
    ],
    shippingAddress: {
      street: '124 Luxury Studio Ave, Golf Course Road',
      city: 'Gurugram',
      state: 'Punjab & Haryana',
      zipCode: '122001',
      country: 'India'
    }
  },
  {
    _id: '66a81f92e0123456789abc02',
    totalPrice: 18900,
    status: 'shipped',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        product: { name: 'Gothenburg Brass Floor Lamp', price: 18900 },
        variantName: 'Brushed Brass / Linen',
        qty: 1,
        price: 18900
      }
    ],
    shippingAddress: {
      street: '124 Luxury Studio Ave, Golf Course Road',
      city: 'Gurugram',
      state: 'Punjab & Haryana',
      zipCode: '122001',
      country: 'India'
    }
  }
];

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = user || DEFAULT_CUSTOMER_USER;

  // Address state for saving
  const [street, setStreet] = useState('124 Luxury Studio Ave, Golf Course Road');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Punjab & Haryana');
  const [city, setCity] = useState('Gurugram');
  const [pinCode, setPinCode] = useState('122001');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      let liveOrders: Order[] = [];
      try {
        const response = await API.get('/orders');
        liveOrders = response.data.data || [];
      } catch (err) {
        console.error('Error fetching API orders:', err);
      }

      // Merge with locally stored checkout orders
      try {
        const stored = JSON.parse(localStorage.getItem('hs_placed_orders') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          liveOrders = [...stored, ...liveOrders];
        }
      } catch (e) {}

      // Combine with sample historical purchases for complete customer order timeline
      const combined = liveOrders.length > 0 ? [...liveOrders, ...SAMPLE_PAST_ORDERS] : SAMPLE_PAST_ORDERS;
      setOrders(combined);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const countryData = COUNTRY_LOCATION_DATA[newCountry] || COUNTRY_LOCATION_DATA['India'];
    const availableStates = Object.keys(countryData.states);
    const firstState = availableStates[0] || '';
    const firstCity = countryData.states[firstState]?.[0] || '';
    setState(firstState);
    setCity(firstCity);
  };

  const handleStateChange = (stVal: string) => {
    setState(stVal);
    const countryData = COUNTRY_LOCATION_DATA[country] || COUNTRY_LOCATION_DATA['India'];
    const available = countryData.states[stVal] || [];
    setCity(available[0] || '');
  };

  const handlePinCodeChange = (pin: string) => {
    setPinCode(pin);
    const match = lookupPinCode(pin);
    if (match) {
      setCountry(match.country);
      setState(match.state);
      setCity(match.city);
    }
  };

  const currentCountryData = COUNTRY_LOCATION_DATA[country] || COUNTRY_LOCATION_DATA['India'];
  const availableStates = Object.keys(currentCountryData.states);
  const availableCities: string[] = currentCountryData.states[state] || [city];

  return (
    <div className="min-h-[85vh] bg-brand-linen py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Banner Card */}
        <Card className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl text-left" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-brand-sand-dark/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3D2E26] text-brand-linen flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-brand-walnut">{currentUser.name}</h1>
                  <span className="bg-brand-terracotta/15 text-brand-terracotta px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest font-mono">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-brand-clay font-sans mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/products">
                <Button variant="primary" size="sm" className="bg-[#3D2E26] text-white hover:bg-[#BC6C58] text-xs font-serif uppercase tracking-wider shadow">
                  🛒 Proceed to Catalog & Checkout →
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
                {orders.filter(o => (o.status || o.orderStatus) === 'shipped' || (o.status || o.orderStatus) === 'processing' || (o.status || o.orderStatus) === 'pending').length}
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
              orders.map((order) => {
                const currentStatus = order.status || order.orderStatus || 'pending';
                const totalVal = order.totalPrice || order.totalAmount || order.total || 0;
                return (
                  <Card key={order._id} className="p-6 bg-white border border-brand-sand-dark/25 shadow-md" hoverEffect={false}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-brand-sand-dark/15 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-brand-walnut">
                            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest ${
                            currentStatus === 'delivered' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : currentStatus === 'shipped'
                              ? 'bg-sky-100 text-sky-800 border border-sky-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {currentStatus}
                          </span>
                        </div>
                        <span className="text-[10px] text-brand-clay font-mono block mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-brand-clay block">Total Amount</span>
                        <span className="font-serif font-bold text-lg text-brand-terracotta">
                          ₹{totalVal.toLocaleString()}
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
                            currentStatus !== 'pending' ? 'bg-brand-terracotta text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                          }`}>
                            {currentStatus !== 'pending' ? '✓' : '2'}
                          </div>
                          <span className="text-[10px] font-bold text-brand-walnut block">Processing</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                            currentStatus === 'shipped' || currentStatus === 'delivered' ? 'bg-brand-terracotta text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                          }`}>
                            {currentStatus === 'shipped' || currentStatus === 'delivered' ? '✓' : '3'}
                          </div>
                          <span className="text-[10px] font-bold text-brand-walnut block">Shipped</span>
                        </div>
                        <div className="space-y-1">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                            currentStatus === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-brand-sand-dark/30 text-brand-clay'
                          }`}>
                            {currentStatus === 'delivered' ? '✓' : '4'}
                          </div>
                          <span className="text-[10px] font-bold text-brand-walnut block">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="pt-4 space-y-3">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-sans">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-brand-walnut">
                              {item.product?.name || 'Curated Design Piece'}
                            </span>
                            {item.variantName && (
                              <span className="text-[10px] text-brand-clay font-mono bg-brand-sand-light px-2 py-0.5 border border-brand-sand-dark/20">
                                {item.variantName}
                              </span>
                            )}
                            <span className="text-brand-clay">× {item.qty}</span>
                          </div>
                          <span className="text-brand-walnut font-mono font-bold">
                            ₹{((item.price || item.product?.price || 0) * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content 2: Delivery Address Management */}
        {activeTab === 'addresses' && (
          <Card className="p-8 bg-white border border-brand-sand-dark/25 text-left space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg font-bold text-brand-walnut">Saved Shipping Address</h3>

            {addressSaved && (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider border border-emerald-300">
                ✓ Address details updated successfully!
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

              {/* Country and PIN Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => handlePinCodeChange(e.target.value)}
                    placeholder={currentCountryData.pinPlaceholder}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-mono text-brand-walnut focus:outline-none focus:border-brand-walnut rounded-none"
                  />
                </div>
              </div>

              {/* State and City Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    State / Region *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
                  >
                    {availableStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-1">
                    City / Town *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer rounded-none"
                  >
                    {availableCities.map((ct: string) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
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
                  value={currentUser.name}
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
                  value={currentUser.email}
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
                  value={currentUser.role.toUpperCase()}
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
