import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import type { Publisher } from '../../types';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const StaffPublishers: React.FC = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: 0, name: '', description: '', website: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPubs = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Publisher[] }>('/publishers');
      setPublishers(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPubs(); }, []);

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) await api.put(`/publishers/${form.id}`, form);
      else await api.post('/publishers', form);
      toast.success(`Publisher saved!`);
      setModalOpen(false);
      fetchPubs();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you really sure? Watch out for foreign keys on books!')) return;
    try {
      await api.delete(`/publishers/${id}`);
      toast.success('Deleted');
      fetchPubs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openForm = (p?: Publisher) => {
    setForm(p ? { id: p.id, name: p.name, description: p.description || '', website: p.website || '' } : { id: 0, name: '', description: '', website: '' });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Publishers</h1>
        <button onClick={() => openForm()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Publisher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500 animate-pulse">Loading...</div> : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Website</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm">
              {publishers.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-blue-600"><a href={p.website} target="_blank" rel="noreferrer" className="hover:underline">{p.website}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openForm(p)} className="text-indigo-600 hover:text-indigo-900 mr-4"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-lg bg-gray-50">{form.id ? 'Edit Publisher' : 'New Publisher'}</div>
            <form onSubmit={handleSub} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                <input required type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
                <input type="url" value={form.website} onChange={e=>setForm({...form, website: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700">Save Publisher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffPublishers;
