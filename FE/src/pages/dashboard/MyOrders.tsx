import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../api/axios';
import type { Order } from '../../types';
import toast from 'react-hot-toast';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Order[] }>('/user/orders')
      .then(res => setOrders(res.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/books" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 flex-1 w-full">
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Placed</span>
                    <span className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">TotalAmount</span>
                    <span className="text-sm font-semibold text-gray-900">${order.grandTotal.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      order.orderStatus === 'CANCELED' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order #</span>
                    <span className="text-sm font-mono text-gray-900">{order.id.toString().padStart(6, '0')}</span>
                  </div>
                </div>
                <Link to={`/dashboard/orders/${order.id}`} className="w-full sm:w-auto text-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
                  View Details
                </Link>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {order.items.slice(0, 5).map(item => (
                    <div key={item.id} className="w-16 h-24 flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden" title={item.book.title}>
                      <img src={getImageUrl(item.book.coverImage)!} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="w-16 h-24 flex-shrink-0 bg-gray-50 rounded border border-gray-200 border-dashed flex items-center justify-center text-gray-500 text-xs font-medium">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
