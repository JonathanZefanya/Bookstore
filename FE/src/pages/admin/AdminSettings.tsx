import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../api/axios';
import type { Settings } from '../../types';
import toast from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ data: Settings }>('/settings')
      .then(res => setSettings(res.data.data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (type: 'logo' | 'favicon' | 'og-image', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/settings/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings(res.data.data);
      toast.success(`${type} uploaded successfully`);
    } catch {
      toast.error(`Failed to upload ${type}`);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4 max-w-4xl"><div className="h-40 bg-gray-200 rounded-xl"/><div className="h-96 bg-gray-200 rounded-xl"/></div>;

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Site Settings</h1>
        <p className="text-slate-500 mt-2">Manage branding, SEO, and global website configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">General Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                  <input type="text" value={settings.siteName || ''} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Base Currency</label>
                  <select value={settings.currency || 'USD'} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5">
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="SGD">SGD (S$)</option>
                    <option value="MYR">MYR (RM)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Theme Color (Hex)</label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.themeColor || '#4f46e5'} onChange={e => setSettings({...settings, themeColor: e.target.value})} className="h-10 w-12 rounded border-0 p-0 shadow-sm" />
                    <input type="text" value={settings.themeColor || ''} onChange={e => setSettings({...settings, themeColor: e.target.value})} className="flex-1 border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Text</label>
                <input type="text" value={settings.footerText || ''} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 mb-6">SEO Configuration</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Title</label>
                  <input type="text" value={settings.metaTitle || ''} onChange={e => setSettings({...settings, metaTitle: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                  <textarea value={settings.metaDescription || ''} onChange={e => setSettings({...settings, metaDescription: e.target.value})} rows={3} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
                  <input type="text" value={settings.metaKeywords || ''} onChange={e => setSettings({...settings, metaKeywords: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" placeholder="Comma separated..." />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Open Graph (Social Sharing)</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">OG Title</label>
                  <input type="text" value={settings.ogTitle || ''} onChange={e => setSettings({...settings, ogTitle: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">OG Description</label>
                  <textarea value={settings.ogDescription || ''} onChange={e => setSettings({...settings, ogDescription: e.target.value})} rows={2} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Canonical URL</label>
                  <input type="url" value={settings.canonicalUrl || ''} onChange={e => setSettings({...settings, canonicalUrl: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 py-2.5" placeholder="https://..." />
                </div>
              </div>
              <div className="mt-8">
                <button type="submit" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 text-lg">
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Branding Images */}
        <div className="space-y-6">
          <ImageCard title="Website Logo" image={settings.siteLogo} onUpload={(f: File) => uploadFile('logo', f)} recommended="PNG, SVG (max 2MB)" transparent />
          <ImageCard title="Favicon" image={settings.siteFavicon} onUpload={(f: File) => uploadFile('favicon', f)} recommended="ICO, PNG 32x32" transparent />
          <ImageCard title="OG Share Image" image={settings.ogImage} onUpload={(f: File) => uploadFile('og-image', f)} recommended="1200x630 JPG/PNG" />
        </div>
      </div>
    </div>
  );
};

const ImageCard = ({ title, image, onUpload, recommended, transparent=false }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
    <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
    <div className={`w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden flex flex-col items-center justify-center mb-4 relative group ${transparent ? 'bg-checkerboard' : 'bg-slate-50'}`}>
      {image ? (
        <>
          <img src={getImageUrl(image)!} className="w-full h-full object-contain p-2" alt="upload" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <label className="cursor-pointer text-white font-semibold text-sm">Replace<input type="file" className="hidden" accept="image/*" onChange={e => {if(e.target.files?.[0]) onUpload(e.target.files[0])}} /></label>
          </div>
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition w-full h-full">
          <PhotoIcon className="w-8 h-8 mb-2" />
          <span className="text-xs font-semibold">Upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={e => {if(e.target.files?.[0]) onUpload(e.target.files[0])}} />
        </label>
      )}
    </div>
    <p className="text-xs text-slate-500 font-medium">Recommended: {recommended}</p>
    <style>{`.bg-checkerboard { background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }`}</style>
  </div>
);

export default AdminSettings;
