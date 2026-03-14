import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api, { getImageUrl } from '../../api/axios';
import { LockClosedIcon, ShieldCheckIcon, DocumentTextIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState((user as any)?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart || cart.items.length === 0) navigate('/cart');
  }, [cart, navigate]);

  if (!cart) return null;

  const total = cart.items.reduce((sum, item) => sum + (item.quantity * item.book.price), 0);
  const totalWeight = cart.items.reduce((sum, item) => sum + (item.quantity * (item.book.weightGram || 0)), 0);
  const weightKg = Math.ceil(totalWeight / 1000); // round up to nearest kg
  // Match backend shipping calculation logic
  const SHP_RATE = 5.0; // $5/kg
  const shippingCost = Math.max(weightKg * SHP_RATE, 1.0); // min $1
  const grandTotal = total + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return toast.error('Shipping address is required');

    setLoading(true);
    try {
      await api.post('/user/orders/checkout', { shippingAddress: address, notes });
      toast.success('Order placed successfully!');
      await fetchCart(); // Clear cart context
      navigate('/dashboard/orders');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <LockClosedIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Shipping Form */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6 text-slate-900">Shipping Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Address *</label>
                <textarea
                  required value={address} onChange={e => setAddress(e.target.value)}
                  rows={4}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 resize-none bg-slate-50 focus:bg-white"
                  placeholder="Street address, city, state, zip code..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Order Notes (Optional)</label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 resize-none bg-slate-50 focus:bg-white"
                  placeholder="Special instructions for delivery..."
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-4">
                <ShieldCheckIcon className="w-8 h-8 text-amber-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900">Simulated Payment System</h4>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    This is a demo bookstore. Your order will be placed instantly without actual payment processing.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-xl font-bold border-b border-slate-100 pb-4 mb-6 text-slate-900 flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-indigo-500" /> Order Summary
            </h2>
            
            <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mb-6">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-24 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(item.book.coverImage)!} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 text-sm pt-1">
                    <p className="font-bold leading-tight line-clamp-2 text-slate-900 mb-1">{item.book.title}</p>
                    <p className="text-slate-500 mb-1">Qty: {item.quantity}</p>
                    <p className="font-semibold text-slate-900">${(item.book.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm font-medium border-t border-slate-100 pt-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-500">Shipping Estimate</span>
                  <span className="text-xs text-slate-400 font-normal">{(totalWeight / 1000).toFixed(2)} kg @ $5.00/kg (min $1)</span>
                </div>
                <span className="text-slate-900">${shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-200 pt-4 mt-2">
                <div className="flex justify-between items-center text-xl font-black text-slate-900">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              form="checkout-form" type="submit" disabled={loading}
              className="mt-8 w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-lg"
            >
              <CreditCardIcon className="w-6 h-6" />
              {loading ? 'Processing...' : 'Place Order Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
