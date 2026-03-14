import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getImageUrl } from '../../api/axios';
import type { Book, Category, Publisher } from '../../types';
import toast from 'react-hot-toast';

const StaffBookForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', description: '',
    price: 0, stock: 0, weightGram: 500, publishYear: new Date().getFullYear(),
    categoryId: '', publisherId: ''
  });
  
  const [cover, setCover] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/publishers')]).then(([c, p]) => {
      setCategories(c.data.data); setPublishers(p.data.data);
      if (c.data.data.length && form.categoryId === '') setForm(f => ({...f, categoryId: c.data.data[0].id.toString()}));
      if (p.data.data.length && form.publisherId === '') setForm(f => ({...f, publisherId: p.data.data[0].id.toString()}));
    });

    if (isEdit) {
      api.get<{data: Book}>(`/books/id/${id}`).then(res => {
        const b = res.data.data;
        setForm({
          title: b.title, author: b.author || '', isbn: b.isbn || '', description: b.description || '',
          price: b.price, stock: b.stock, weightGram: b.weightGram || 0, publishYear: b.publishYear || new Date().getFullYear(),
          categoryId: b.category?.id.toString() || '', publisherId: b.publisher?.id.toString() || ''
        });
        setExistingCoverUrl(b.coverImage || null);
      }).catch(() => {
        toast.error('Book not found'); navigate('/staff/books');
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const fd = new FormData();
      fd.append('book', JSON.stringify({
        ...form, price: Number(form.price), stock: Number(form.stock), weightGram: Number(form.weightGram), publishYear: Number(form.publishYear)
      }));
      if (cover) fd.append('cover', cover);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (isEdit) {
        await api.put(`/books/${id}`, fd, config);
        toast.success('Book updated!');
      } else {
        await api.post('/books', fd, config);
        toast.success('Book created successfully!');
      }
      navigate('/staff/books');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse">Loading form data...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
        <button onClick={() => navigate('/staff/books')} className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Book Cover</label>
            <div className="flex items-start gap-6">
              <div className="w-32 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex flex-col items-center justify-center relative">
                {cover ? (
                  <img src={URL.createObjectURL(cover)} className="w-full h-full object-cover" alt="Preview"/>
                ) : existingCoverUrl ? (
                  <img src={getImageUrl(existingCoverUrl)!} className="w-full h-full object-cover" alt="Existing"/>
                ) : (
                  <span className="text-xs text-gray-400 font-semibold p-4 text-center">No cover selected</span>
                )}
                <input type="file" accept="image/*" onChange={e => {if(e.target.files) setCover(e.target.files[0])}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <div className="flex-1 mt-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Upload a high quality cover image</p>
                <p className="text-xs text-gray-500 mb-4">Recommended format: JPG, PNG, WEBP. Max size: 2MB.</p>
                <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <span>Browse File</span>
                  <input type="file" accept="image/*" onChange={e => {if(e.target.files) setCover(e.target.files[0])}} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title *</label>
              <input required type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name</label>
              <input type="text" value={form.author} onChange={e=>setForm({...form, author: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
              <input type="text" value={form.isbn} onChange={e=>setForm({...form, isbn: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select required value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher *</label>
              <select required value={form.publisherId} onChange={e=>setForm({...form, publisherId: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5">
                <option value="">Select Publisher</option>
                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (USD) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e=>setForm({...form, price: parseFloat(e.target.value)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
              <input required type="number" min="0" value={form.stock} onChange={e=>setForm({...form, stock: parseInt(e.target.value)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Weight in Grams (for shipping) *</label>
               <input required type="number" min="0" value={form.weightGram} onChange={e=>setForm({...form, weightGram: parseInt(e.target.value)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Year</label>
               <input type="number" min="1800" max={new Date().getFullYear()} value={form.publishYear} onChange={e=>setForm({...form, publishYear: parseInt(e.target.value)})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea rows={6} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 py-3 px-4 resize-none" placeholder="Format paragraphs intuitively..." />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 items-center">
          <p className="text-xs text-gray-500 italic mr-auto">Please double check all information before saving</p>
          <button type="button" onClick={() => navigate('/staff/books')} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Book Info'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffBookForm;
