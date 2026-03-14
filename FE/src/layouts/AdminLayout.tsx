import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  HomeIcon, UsersIcon, BookOpenIcon, TagIcon, BuildingOfficeIcon,
  ClipboardDocumentListIcon, Cog6ToothIcon, Bars3Icon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/admin/users', label: 'Users & Roles', icon: UsersIcon },
  { to: '/admin/books', label: 'Books', icon: BookOpenIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagIcon },
  { to: '/admin/publishers', label: 'Publishers', icon: BuildingOfficeIcon },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
  { to: '/admin/settings', label: 'Site Settings', icon: Cog6ToothIcon },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-black">G</div>
          Admin Panel
        </Link>
        <p className="text-xs text-slate-500 mt-1 font-medium">{settings?.siteName || 'Gramedia Bookstore'}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }>
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <Link to="/admin/profile" className="flex items-center gap-3 mb-3 hover:bg-slate-800 p-2 -mx-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
            <p className="text-xs text-indigo-400 font-medium">Administrator</p>
          </div>
        </Link>
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 block mb-2 transition-colors">← Public Site</Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors w-full">
          <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:flex flex-col w-64 fixed h-full z-20 shadow-xl">
        <SidebarContent />
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-64 h-full shadow-2xl flex flex-col"><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
          <button onClick={() => setOpen(true)}><Bars3Icon className="w-6 h-6 text-slate-100" /></button>
          <span className="font-bold text-white">Admin Panel</span>
          <div />
        </div>
        <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
