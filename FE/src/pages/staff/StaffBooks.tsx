import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { getImageUrl } from '../../api/axios';
import type { Book, PageResponse } from '../../types';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const StaffBooks: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '0');
  const search = params.get('q') || '';
  
  const [data, setData] = useState<PageResponse<Book> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: page.toString(), size: '10', sortBy: 'createdAt', sortDir: 'desc' });
      if (search) q.append('search', search);
      const res = await api.get<{ data: PageResponse<Book> }>(`/books?${q.toString()}`);
      setData(res.data.data);
    } catch {
      toast.error('Failed to loading books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page, search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this book permanently? This action cannot be reversed.')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch {
      toast.error('Failed to delete book');
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get('q') as string;
    setParams({ q, page: '0' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Books Catalog</h1>
        <div className="flex w-full sm:w-auto gap-4">
          <form onSubmit={handleSearch} className="flex-1 sm:w-64 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="q" defaultValue={search} placeholder="Search title or ISBN..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 text-sm" />
          </form>
          <Link to="/staff/books/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
            <PlusIcon className="w-4 h-4" /> Add Book
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500 animate-pulse">Loading catalog...</div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author / Publisher</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.content.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
                          {b.coverImage ? <img src={getImageUrl(b.coverImage)!} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full text-[8px] text-gray-400 flex items-center justify-center p-1 text-center font-bold uppercase">No<br/>Cover</div>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 max-w-xs">{b.title}</p>
                          <p className="text-xs text-indigo-600 font-medium mt-1">{b.category?.name || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{b.author}</p>
                      <p className="text-xs text-gray-500 mt-1">{b.publisher?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">${b.price.toFixed(2)}</p>
                      <p className={`text-xs mt-1 font-semibold ${b.stock <= 5 ? (b.stock===0?'text-red-600':'text-amber-600') : 'text-green-600'}`}>
                        {b.stock} in stock
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/staff/books/${b.id}/edit`} className="inline-block p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors mr-2"><PencilIcon className="w-5 h-5"/></Link>
                      <button onClick={() => handleDelete(b.id)} className="inline-block p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <span className="text-sm text-gray-700">Showing page <span className="font-bold">{data.number + 1}</span> of <span className="font-bold">{data.totalPages}</span></span>
                <div className="flex gap-2">
                  <button disabled={data.first} onClick={() => setParams({ q: search, page: (page - 1).toString() })} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">Prev</button>
                  <button disabled={data.last} onClick={() => setParams({ q: search, page: (page + 1).toString() })} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default StaffBooks;
