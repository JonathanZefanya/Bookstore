import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getImageUrl } from '../../api/axios';
import type { Order } from '../../types';
import toast from 'react-hot-toast';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Order }>(`/user/orders/${id}`)
      .then(res => setOrder(res.data.data))
      .catch(() => toast.error('Failed to load order detail'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />;
  if (!order) return <div className="text-center py-10">Order not found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
        <Link to="/dashboard/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">← Back to orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold bg-gray-50 p-4 border-b border-gray-200 text-gray-900">Items Ordered</h2>
            <ul className="divide-y divide-gray-100">
              {order.items.map(item => (
                <li key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-24 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                    <img src={getImageUrl(item.book.coverImage)!} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.book.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">{item.book.author}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Order Summary</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Status</span> <span className="font-bold text-indigo-700">{order.orderStatus}</span></div>
              <div className="flex justify-between"><span>Payment</span> <span className="font-bold text-green-600">{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span>Items Subtotal</span> <span>${order.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span> <span>${order.shippingCost.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between font-black text-lg text-gray-900">
                <span>Total</span>
                <span>${order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Shipping Information</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mb-4">{order.shippingAddress}</p>
            {order.notes && (
              <>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Notes</h3>
                <p className="text-sm text-gray-600 italic">{order.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
