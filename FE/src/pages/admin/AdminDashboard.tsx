import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { TruckIcon, BanknotesIcon, UsersIcon, BookOpenIcon, Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { formatCurrency } = useSettings();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = () => {
    setRefreshing(true);
    api.get('/admin/stats').then(res => setStats(res.data.data)).finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Operations Control</h1>
          <p className="text-gray-500 mt-2">Welcome, {user?.name}. Here's an overview of the platform's performance.</p>
        </div>
        <button 
          onClick={fetchStats} 
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Live Data'}
        </button>
      </div>

      {loading ? <div className="animate-pulse space-y-8"><div className="h-32 bg-gray-100 rounded-xl" /><div className="h-64 bg-gray-100 rounded-xl" /></div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue || 0)} icon={<BanknotesIcon className="w-6 h-6 text-green-600" />} trend="All Time" />
            <StatCard title="Orders Processed" value={stats.totalOrders || 0} icon={<TruckIcon className="w-6 h-6 text-indigo-600" />} trend="System-wide" />
            <StatCard title="Active Users" value="Manage" to="/admin/users" icon={<UsersIcon className="w-6 h-6 text-blue-600" />} isLink />
            <StatCard title="Global Settings" value="Configure" to="/admin/settings" icon={<Cog6ToothIcon className="w-6 h-6 text-slate-600" />} isLink />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><BookOpenIcon className="w-5 h-5 text-indigo-500" /> Catalog Quick Links</h3>
               <div className="grid grid-cols-2 gap-4">
                 <Link to="/admin/books" className="p-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-semibold transition border border-gray-100">Manage Books →</Link>
                 <Link to="/admin/categories" className="p-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-semibold transition border border-gray-100">Categories →</Link>
                 <Link to="/admin/publishers" className="p-4 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl font-semibold transition border border-gray-100">Publishers →</Link>
                 <Link to="/admin/orders" className="p-4 bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 rounded-xl font-bold transition flex items-center justify-between">Review Orders <span>→</span></Link>
               </div>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <h3 className="font-bold text-xl mb-2 relative z-10 text-indigo-100">Store Performance</h3>
                <div className="grid grid-cols-2 gap-6 mt-6 relative z-10">
                  <div>
                    <p className="text-indigo-300 text-sm font-medium mb-1">Paid Orders</p>
                    <p className="text-3xl font-black">{stats.paidOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-indigo-300 text-sm font-medium mb-1">Pending Orders</p>
                    <p className="text-3xl font-black">{stats.pendingOrders || 0}</p>
                  </div>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, to, isLink }: any) => {
  const content = (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-full ${isLink ? 'hover:border-indigo-500 hover:shadow-md transition-all group' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>
        <div className={`p-2 bg-gray-50 rounded-lg ${isLink ? 'group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors' : ''}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <p className={`text-2xl font-black ${isLink ? 'text-indigo-600 group-hover:text-indigo-700' : 'text-gray-900'}`}>{value}</p>
        {trend && <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-md">{trend}</span>}
      </div>
    </div>
  );
  return isLink ? <Link to={to} className="block">{content}</Link> : content;
};

export default AdminDashboard;
