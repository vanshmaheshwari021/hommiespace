import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.js';
import { useAuthStore } from '../store/auth.js';
import { Button, Card } from '@hommiespace/ui';
import API from '../api/index.js';
import { COUNTRIES_LIST, COUNTRY_LOCATION_DATA, lookupPinCode } from '../utils/location.js';

export const Checkout: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    country: 'India'
  });

  const billingSameAsShipping = true;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState<string | undefined>(undefined);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Default Tax and Shipping parameters
  const [taxRate, setTaxRate] = useState(8);
  const [shippingFee, setShippingFee] = useState(25);

  useEffect(() => {
    // Load setting rates
    const loadRates = async () => {
      try {
        const res = await API.get('/settings');
        setTaxRate(res.data.data.taxRate || 8);
        setShippingFee(res.data.data.shippingFee || 25);
      } catch (err) {
        console.error(err);
      }
    };
    loadRates();
  }, []);

  // Country Change Handler
  const handleCountryChange = (newCountry: string) => {
    const countryData = COUNTRY_LOCATION_DATA[newCountry] || COUNTRY_LOCATION_DATA['India'];
    const availableStates = Object.keys(countryData.states);
    const firstState = availableStates[0] || '';
    const firstCity = countryData.states[firstState]?.[0] || '';

    setShippingAddress({
      ...shippingAddress,
      country: newCountry,
      state: firstState,
      city: firstCity
    });
  };

  // State Change Handler
  const handleStateChange = (stateVal: string) => {
    const countryData = COUNTRY_LOCATION_DATA[shippingAddress.country] || COUNTRY_LOCATION_DATA['India'];
    const availableCities = countryData.states[stateVal] || [];
    const firstCity = availableCities[0] || '';

    setShippingAddress({
      ...shippingAddress,
      state: stateVal,
      city: firstCity
    });
  };

  // PIN Code Auto Lookup Effect
  const handlePinCodeChange = (pin: string) => {
    const updated = { ...shippingAddress, pinCode: pin };
    const match = lookupPinCode(pin);
    if (match) {
      updated.country = match.country;
      updated.state = match.state;
      updated.city = match.city;
    }
    setShippingAddress(updated);
  };

  const subtotal = items.reduce((acc, item) => {
    const variant = item.product.colorVariants.find(v => v.name === item.variantName);
    const price = item.product.price + (variant?.priceOffset || 0);
    return acc + price * item.qty;
  }, 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponCode) return;

    try {
      const res = await API.post('/coupons/apply', { code: couponCode, subtotal });
      const coupon = res.data.data;
      let calculatedDiscount = 0;
      if (coupon.discountType === 'percentage') {
        calculatedDiscount = Math.round(subtotal * (coupon.discountValue / 100));
      } else {
        calculatedDiscount = coupon.discountValue;
      }
      setDiscountAmount(calculatedDiscount);
      setActiveCoupon(coupon.code);
      setCouponSuccess(`Coupon ${coupon.code} applied! Saved ₹${calculatedDiscount.toLocaleString()}`);
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Failed to apply coupon.');
      setDiscountAmount(0);
      setActiveCoupon(undefined);
    }
  };

  const tax = Math.round((subtotal - discountAmount) * (taxRate / 100));
  const total = subtotal - discountAmount + tax + shippingFee;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pinCode) {
      alert('Please fill in all shipping address fields including PIN Code.');
      return;
    }

    setPlacing(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        variantName: item.variantName || 'Default',
        qty: item.qty
      }));

      const payloadAddress = {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.pinCode,
        country: shippingAddress.country
      };

      const finalBilling = billingSameAsShipping ? payloadAddress : payloadAddress;

      const response = await API.post('/orders', {
        items: orderItems,
        shippingAddress: payloadAddress,
        billingAddress: finalBilling,
        paymentMethod,
        couponCode: activeCoupon
      });

      setPlacedOrder(response.data.data);
      clearCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-walnut mb-4">Your Cart is Empty</h2>
        <p className="text-brand-clay text-sm mb-8">Add items to your cart before proceeding to checkout.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>Browse Catalog</Button>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-16 h-16 bg-brand-sage/10 text-brand-sage rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold text-brand-walnut mb-2">Order Confirmed!</h2>
          <p className="text-brand-clay text-sm">Thank you for your purchase. Your order has been registered.</p>
          <p className="font-mono text-xs text-brand-clay mt-1">Order Ref: {placedOrder.id}</p>
        </div>

        <Card className="p-6 bg-white border border-brand-sand-dark/20 text-left space-y-4">
          <h3 className="font-serif text-sm font-bold text-brand-walnut border-b border-brand-sand-dark/20 pb-2">Order Receipt</h3>
          <div className="text-xs space-y-1 font-mono text-brand-clay">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>₹{placedOrder.subtotal?.toLocaleString()}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-brand-terracotta">
                <span>Discount applied:</span>
                <span>-₹{placedOrder.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sales Tax ({taxRate}%):</span>
              <span>₹{placedOrder.tax?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>₹{placedOrder.shippingFee?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-walnut border-t border-brand-sand-dark/20 pt-2 text-sm font-serif">
              <span>Total Paid:</span>
              <span>₹{placedOrder.total?.toLocaleString() || placedOrder.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-xs font-sans text-brand-clay mt-4 space-y-1">
            <p className="font-semibold text-brand-walnut">Shipping To:</p>
            <p>{placedOrder.shippingAddress?.street}</p>
            <p>{placedOrder.shippingAddress?.city}, {placedOrder.shippingAddress?.state} PIN: {placedOrder.shippingAddress?.zipCode}</p>
            <p className="font-semibold text-brand-walnut mt-1">Country: {placedOrder.shippingAddress?.country || 'India'}</p>
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.print()}>Print / Save Invoice</Button>
          <Button variant="primary" onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const currentCountryData = COUNTRY_LOCATION_DATA[shippingAddress.country] || COUNTRY_LOCATION_DATA['India'];
  const availableStates = Object.keys(currentCountryData.states);
  const availableCities = currentCountryData.states[shippingAddress.state] || [shippingAddress.city];

  return (
    <div className="bg-brand-linen-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-walnut mb-2">Secure Checkout</h1>
            <p className="text-brand-clay text-sm font-sans">Enter details to complete your marketplace purchase.</p>
          </div>

          <Card className="p-8 bg-white border border-brand-sand-dark/25" hoverEffect={false}>
            <h3 className="font-serif text-lg font-bold text-brand-walnut mb-6">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Street Address *</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="e.g. 123 Luxury Lane, Apartment 4B"
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none"
                />
              </div>

              {/* Country and PIN Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">Country *</label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">PIN Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.pinCode}
                    onChange={(e) => handlePinCodeChange(e.target.value)}
                    placeholder={currentCountryData.pinPlaceholder}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-mono text-brand-walnut focus:outline-none focus:border-brand-walnut"
                  />
                </div>
              </div>

              {/* State and City Selectors Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">State / Region *</label>
                  <select
                    value={shippingAddress.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer"
                  >
                    {availableStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">City *</label>
                  <select
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none cursor-pointer"
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-sand-dark/20">
              <h3 className="font-serif text-lg font-bold text-brand-walnut mb-6">Payment Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-brand-walnut bg-brand-walnut/5 font-semibold text-brand-walnut'
                      : 'border-brand-sand-dark/35 bg-white text-brand-clay'
                  }`}
                >
                  <p className="text-xs uppercase tracking-wider">Credit / Debit Card</p>
                  <p className="text-[10px] mt-1 opacity-85">Instant secure authorization</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-walnut bg-brand-walnut/5 font-semibold text-brand-walnut'
                      : 'border-brand-sand-dark/35 bg-white text-brand-clay'
                  }`}
                >
                  <p className="text-xs uppercase tracking-wider">COD</p>
                  <p className="text-[10px] mt-1 opacity-85">Cash on Delivery</p>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white border border-brand-sand-dark/20" hoverEffect={false}>
            <h3 className="font-serif text-sm font-bold text-brand-walnut border-b border-brand-sand-dark/20 pb-4 mb-4">
              Order Summary
            </h3>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => {
                const variant = item.product.colorVariants.find(v => v.name === item.variantName);
                const price = item.product.price + (variant?.priceOffset || 0);
                return (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-brand-walnut">{item.product.name}</h4>
                      <p className="text-[10px] text-brand-clay">Finish: {item.variantName || 'Default'} × {item.qty}</p>
                    </div>
                    <span className="font-mono text-brand-walnut font-bold">₹{(price * item.qty).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            {/* Promo code form */}
            <form onSubmit={handleApplyCoupon} className="mt-6 pt-6 border-t border-brand-sand-dark/20 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE"
                className="bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-2 text-xs font-mono uppercase focus:outline-none w-full"
              />
              <Button type="submit" variant="outline" className="px-4 text-xs">Apply</Button>
            </form>
            {couponError && <p className="text-brand-terracotta text-[10px] mt-2 font-mono">{couponError}</p>}
            {couponSuccess && <p className="text-brand-sage text-[10px] mt-2 font-semibold">{couponSuccess}</p>}

            <div className="mt-6 pt-6 border-t border-brand-sand-dark/20 space-y-2 text-xs font-mono text-brand-clay">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-brand-terracotta">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax ({taxRate}%):</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-brand-walnut border-t border-brand-sand-dark/20 pt-4">
                <span>Estimated Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-8 py-4 font-serif text-sm tracking-wide"
            >
              {placing ? 'Placing Order...' : `Pay & Place Order (₹${total.toLocaleString()})`}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
