import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  HomeIcon, BookOpenIcon, TagIcon, BuildingOfficeIcon, ClipboardDocumentListIcon,
  Bars3Icon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { to: '/staff', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/staff/books', label: 'Books', icon: BookOpenIcon },
  { to: '/staff/categories', label: 'Categories', icon: TagIcon },
  { to: '/staff/publishers', label: 'Publishers', icon: BuildingOfficeIcon },
  { to: '/staff/orders', label: 'Orders', icon: ClipboardDocumentListIcon },
];

const StaffLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-amber-100 bg-amber-50">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-amber-700">
          <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center text-white text-xs font-black">S</div>
          Staff Panel
        </Link>
        <p className="text-xs text-amber-600 mt-1 font-medium">{settings?.siteName || 'Gramedia Bookstore'}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-gray-600 hover:bg-gray-100'
              }`
            }>
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-amber-600 font-medium">Staff</p>
          </div>
        </div>
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 block mb-2">← Public Site</Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <SidebarContent />
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-64 bg-white h-full shadow-xl flex flex-col"><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200 sticky top-0 z-40">
          <button onClick={() => setOpen(true)}><Bars3Icon className="w-6 h-6 text-amber-700" /></button>
          <span className="font-bold text-amber-700">Staff Panel</span>
          <div />
        </div>
        <main className="flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default StaffLayout;
