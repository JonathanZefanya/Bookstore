import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useSettings } from '../../contexts/SettingsContext';
import { TrashIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../../api/axios';

const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatCurrency } = useSettings();
  const navigate = useNavigate();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const total = cart?.items.reduce((sum, item) => sum + (item.quantity * item.book.price), 0) || 0;
  const weight = cart?.items.reduce((sum, item) => sum + (item.quantity * (item.book.weightGram || 0)), 0) || 0;

  if (loading && !cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-24 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCartIcon className="w-12 h-12 text-indigo-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any books to your cart yet. Discover something new today!</p>
        <Link to="/books" className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition shadow-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <ShoppingCartIcon className="w-8 h-8 text-indigo-600" />
          Shopping Cart
        </h1>
        <button onClick={() => setIsClearModalOpen(true)} className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline">
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cart.items.map(item => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                  <Link to={`/books/${item.book.slug}`} className="w-24 h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative group shadow-sm border border-gray-200">
                    <img src={getImageUrl(item.book.coverImage)!} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.book.title} />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4">
                          <Link to={`/books/${item.book.slug}`} className="hover:text-indigo-600 transition-colors">{item.book.title}</Link>
                        </h3>
                        <p className="text-lg font-black text-gray-900">{formatCurrency(item.book.price * item.quantity)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.book.author}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-100 inline-block px-2 py-1 rounded">Unit: {formatCurrency(item.book.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden h-9 shadow-sm">
                        <button disabled={item.quantity <= 1 || loading} onClick={() => updateQuantity(item.book.id, item.quantity - 1)} className="px-3 h-full text-gray-500 hover:bg-gray-100 border-r border-gray-200 font-bold transition-colors disabled:opacity-50">-</button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button disabled={item.quantity >= item.book.stock || loading} onClick={() => updateQuantity(item.book.id, item.quantity + 1)} className="px-3 h-full text-gray-500 hover:bg-gray-100 border-l border-gray-200 font-bold transition-colors disabled:opacity-50">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.book.id)} disabled={loading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                        <TrashIcon className="w-5 h-5" /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                    {item.quantity >= item.book.stock && (
                      <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" /> Max stock reached
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            <div className="space-y-4 text-sm text-gray-600 mb-6 font-medium">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="text-gray-900 font-bold">{cart.items.reduce((a,b)=>a+b.quantity,0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Total Weight Est.</span>
                <span className="font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 text-gray-800">{(weight / 1000).toFixed(2)} kg</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-gray-900">Total Estimate</span>
                <span className="text-2xl font-black text-gray-900">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-gray-500 text-right">Shipping calculated at checkout</p>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full h-12 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition"
            >
              Proceed to Checkout <ArrowRightIcon className="w-5 h-5" />
            </button>
            <Link to="/books" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-4 underline-offset-2 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Cart</h3>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to remove all items from your cart? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  clearCart();
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center min-w-[5rem]"
                disabled={loading}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
