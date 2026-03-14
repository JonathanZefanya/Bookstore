import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import type { Order, PageResponse } from '../../types';
import toast from 'react-hot-toast';

const StaffOrders: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '0');
  
  const [data, setData] = useState<PageResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: PageResponse<Order> }>(`/staff/orders?page=${page}&size=10`);
      setData(res.data.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/staff/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500 animate-pulse">Loading orders...</div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID / Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grand Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.content.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 font-mono">#{o.id.toString().padStart(6, '0')}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(o.createdAt).toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{o.user.name}</p>
                      <p className="text-xs text-indigo-600 mt-1">{o.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">${o.grandTotal.toFixed(2)}</p>
                      <p className="text-xs text-green-600 font-bold mt-1 uppercase">{o.paymentStatus}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold uppercase rounded-md ${
                        o.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        o.orderStatus === 'CANCELED' ? 'bg-red-100 text-red-700' :
                        o.orderStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="text-sm border-gray-300 rounded shadow-sm focus:ring-indigo-500 bg-white font-medium py-1 px-2 cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELED">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data && data.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <span className="text-sm text-gray-700">Page <span className="font-bold">{data.number + 1}</span> of <span className="font-bold">{data.totalPages}</span></span>
                <div className="flex gap-2">
                  <button disabled={data.first} onClick={() => setParams({ page: (page - 1).toString() })} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                  <button disabled={data.last} onClick={() => setParams({ page: (page + 1).toString() })} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default StaffOrders;
