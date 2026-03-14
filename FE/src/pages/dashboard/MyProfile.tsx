import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/user/profile').then(res => {
        const d = res.data.data;
        setProfile({ name: d.name || '', phone: d.phone || '', address: d.address || '' });
      });
    }
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await api.put('/user/profile', profile);
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword.length < 8) return toast.error('New password must be at least 8 chars');
    if (password.newPassword !== password.confirmPassword) return toast.error('Passwords do not match');
    
    setLoadingPass(true);
    try {
      await api.put('/user/password', { oldPassword: password.oldPassword, newPassword: password.newPassword });
      toast.success('Password changed');
      setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Password change failed');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Update your account information and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        </div>
        <form onSubmit={updateProfile} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">Email (Read Only)</label>
              <input type="email" value={user?.email || ''} readOnly className="w-full border-gray-200 rounded-lg bg-gray-50 text-gray-500 py-2.5 px-3 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 max-w-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Saved Address</label>
            <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} rows={3} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-3 resize-none" placeholder="This will be auto-filled during checkout" />
          </div>
          <button type="submit" disabled={loadingProfile} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {loadingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
        </div>
        <form onSubmit={updatePassword} className="p-6 space-y-6">
          <div className="max-w-md space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input type="password" value={password.oldPassword} onChange={e => setPassword({...password, oldPassword: e.target.value})} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password <span className="text-xs font-normal text-gray-500">(min 8 chars)</span></label>
              <input type="password" value={password.newPassword} onChange={e => setPassword({...password, newPassword: e.target.value})} required minLength={8} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input type="password" value={password.confirmPassword} onChange={e => setPassword({...password, confirmPassword: e.target.value})} required className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" />
            </div>
            <button type="submit" disabled={loadingPass} className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-colors">
              {loadingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
