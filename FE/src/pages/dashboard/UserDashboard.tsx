import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import type { Order } from '../../types';
import { ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Order[] }>('/user/orders')
      .then(res => setRecentOrders(res.data.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Manage your orders and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/books" className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1 block relative overflow-hidden group">
          <SparklesIcon className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white opacity-20 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="font-bold text-xl mb-2 relative z-10">Discover New Books</h3>
          <p className="text-indigo-100 mb-6 max-w-[200px] relative z-10">Check out the latest arrivals and bestsellers.</p>
          <span className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm relative z-10">Shop Now</span>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1,2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-semibold">No recent orders</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">You haven't purchased anything yet.</p>
            <Link to="/books" className="text-sm font-medium text-indigo-600 hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">Order #{order.id}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide ${
                      order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'CANCELED' ? 'bg-red-100 text-red-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <span className="font-bold text-lg text-gray-900">${order.grandTotal.toFixed(2)}</span>
                  <Link to={`/dashboard/orders/${order.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
