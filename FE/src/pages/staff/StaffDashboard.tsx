import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpenIcon, TruckIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Both ADMIN and STAFF can call /api/admin/stats
    api.get('/admin/stats').then(res => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name.split(' ')[0]} (Staff)</h1>
      <p className="text-gray-500">Welcome to the Gramedia staff portal. Manage catalog and process orders here.</p>
      
      {loading ? <div className="animate-pulse h-32 bg-gray-100 rounded-xl" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={<TruckIcon className="w-6 h-6 text-emerald-500" />} />
          <StatCard title="Pending Orders" value={stats.pendingOrders || 0} icon={<TruckIcon className="w-6 h-6 text-amber-500" />} />
          <StatCard title="Paid Orders" value={stats.paidOrders || 0} icon={<TruckIcon className="w-6 h-6 text-blue-500" />} />
          <StatCard title="Active Catalog" value="System" icon={<BookOpenIcon className="w-6 h-6 text-indigo-500" />} />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-black text-gray-900">{value}</p>
  </div>
);

export default StaffDashboard;
