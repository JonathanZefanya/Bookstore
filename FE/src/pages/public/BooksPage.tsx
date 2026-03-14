import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Book, Category, Publisher, PageResponse } from '../../types';
import api, { getImageUrl } from '../../api/axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShoppingCartIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BooksPage: React.FC = () => {
  const { formatCurrency } = useSettings();
  const [params, setParams] = useSearchParams();
  const searchParam = params.get('search') || '';
  const categoryParam = params.get('categoryId') || '';
  const pubParam = params.get('publisherId') || '';
  const minParam = params.get('minPrice') || '';
  const maxParam = params.get('maxPrice') || '';
  const sortParam = params.get('sortBy') || 'createdAt';
  const dirParam = params.get('sortDir') || 'desc';

  const [data, setData] = useState<PageResponse<Book> | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);

  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated, isStaff, isAdmin } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/publishers'),
    ]).then(([catRes, pubRes]) => {
      setCategories(catRes.data.data);
      setPublishers(pubRes.data.data);
    });
  }, []);

  const fetchBooks = async (page = 0) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        size: '12',
        sortBy: sortParam,
        sortDir: dirParam,
      });
      if (searchParam) q.append('search', searchParam);
      if (categoryParam) q.append('categoryId', categoryParam);
      if (pubParam) q.append('publisherId', pubParam);
      if (minParam) q.append('minPrice', minParam);
      if (maxParam) q.append('maxPrice', maxParam);

      const res = await api.get<{ data: PageResponse<Book> }>(`/books?${q.toString()}`);
      setData(res.data.data);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(0);
  }, [searchParam, categoryParam, pubParam, minParam, maxParam, sortParam, dirParam]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setParams(newParams);
  };

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="radio" name="cat" checked={!categoryParam} onChange={() => updateParam('categoryId', '')} className="text-indigo-600 focus:ring-indigo-500" />
            All Categories
          </label>
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" name="cat" checked={categoryParam === c.id.toString()} onChange={() => updateParam('categoryId', c.id.toString())} className="text-indigo-600 focus:ring-indigo-500" />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Publisher</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="radio" name="pub" checked={!pubParam} onChange={() => updateParam('publisherId', '')} className="text-indigo-600 focus:ring-indigo-500" />
            All Publishers
          </label>
          {publishers.map(p => (
            <label key={p.id} className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" name="pub" checked={pubParam === p.id.toString()} onChange={() => updateParam('publisherId', p.id.toString())} className="text-indigo-600 focus:ring-indigo-500" />
              {p.name}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Sort By</h3>
        <select value={`${sortParam}|${dirParam}`} onChange={e => {
          const [s, d] = e.target.value.split('|');
          const p = new URLSearchParams(params);
          p.set('sortBy', s); p.set('sortDir', d);
          setParams(p);
        }} className="w-full text-sm border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="createdAt|desc">Newest Arrivals</option>
          <option value="price|asc">Price: Low to High</option>
          <option value="price|desc">Price: High to Low</option>
          <option value="title|asc">Title: A-Z</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Collection</h1>
          {searchParam && <p className="text-gray-500 mt-2">Search results for "{searchParam}"</p>}
        </div>
        <button className="lg:hidden p-2 border border-gray-300 rounded-lg text-gray-600 shadow-sm flex items-center gap-2"
          onClick={() => setMobileFilters(!mobileFilters)}>
          <FunnelIcon className="w-5 h-5" /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`lg:w-64 flex-shrink-0 ${mobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <Filters />
          </div>
        </aside>

        {/* Catalog */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({length: 8}).map((_,i) => (
                <div key={i} className="animate-pulse bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : data?.content.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No books found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              <button onClick={() => setParams(new URLSearchParams())} className="mt-4 text-indigo-600 font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {data?.content.map(book => (
                  <div key={book.id} className="group bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgb(0,0,0,0.08)] transition-all overflow-hidden flex flex-col h-full">
                    <Link to={`/books/${book.slug}`} className="block aspect-[2/3] overflow-hidden bg-gray-100 relative">
                      {book.coverImage ? (
                        <img src={getImageUrl(book.coverImage)!} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 p-4 text-center text-sm font-medium">Cover not available</div>
                      )}
                      {book.stock <= 5 && book.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                          Only {book.stock} left
                        </div>
                      )}
                      {book.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                          Out of Stock
                        </div>
                      )}
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1">{book.category?.name}</p>
                      <Link to={`/books/${book.slug}`} className="block group-hover:text-indigo-600 transition-colors">
                        <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-3">{book.author}</p>
                      <div className="mt-auto flex items-end justify-between">
                        <span className="font-extrabold text-lg text-gray-900">{formatCurrency(book.price)}</span>
                        {(!isAuthenticated || (!isAdmin && !isStaff)) && (
                          <button
                            disabled={book.stock === 0 || cartLoading}
                            onClick={() => addToCart(book.id, 1)}
                            className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                            title={book.stock === 0 ? "Out of stock" : "Add to Cart"}
                          >
                            <ShoppingCartIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <button
                    disabled={data.first}
                    onClick={() => { window.scrollTo(0, 0); fetchBooks(data.number - 1); }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-500">
                    Page {data.number + 1} of {data.totalPages}
                  </span>
                  <button
                    disabled={data.last}
                    onClick={() => { window.scrollTo(0, 0); fetchBooks(data.number + 1); }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
