import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { getImageUrl } from '../api/axios';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const PublicLayout: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, isStaff } = useAuth();
  const { cartCount } = useCart();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              {settings?.siteLogo ? (
                <img src={getImageUrl(settings.siteLogo)!} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-black">
                  {(settings?.siteName || 'G').charAt(0).toUpperCase()}
                </div>
              )}
              {settings?.siteName || 'Gramedia'}
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search books, authors..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/books" className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">Books</Link>

              {isAdmin && <Link to="/admin" className="text-sm text-red-600 hover:text-red-700 font-medium">Admin</Link>}
              {isStaff && !isAdmin && <Link to="/staff" className="text-sm text-amber-600 hover:text-amber-700 font-medium">Staff</Link>}

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                    <UserCircleIcon className="w-5 h-5" />
                    {user?.name}
                  </Link>
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                    <ShoppingCartIcon className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                  <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">Register</Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search books..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">Go</button>
            </form>
            <Link to="/books" className="block text-gray-700 font-medium py-1" onClick={() => setMobileOpen(false)}>Books</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 font-medium py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/cart" className="block text-gray-700 font-medium py-1" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
                {isAdmin && <Link to="/admin" className="block text-red-600 font-medium py-1" onClick={() => setMobileOpen(false)}>Admin</Link>}
                {isStaff && !isAdmin && <Link to="/staff" className="block text-amber-600 font-medium py-1" onClick={() => setMobileOpen(false)}>Staff</Link>}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-red-500 font-medium py-1 text-left w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 font-medium py-1" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl mb-3">
                {settings?.siteLogo ? (
                  <img src={getImageUrl(settings.siteLogo)!} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white" />
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-black text-white">
                    {(settings?.siteName || 'G').charAt(0).toUpperCase()}
                  </div>
                )}
                {settings?.siteName || 'Gramedia Bookstore'}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {settings?.footerText || 'Your trusted online bookstore with thousands of titles across all genres.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Browse</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <Link to="/books" className="block hover:text-white transition-colors">All Books</Link>
                <Link to="/books?sortBy=price&sortDir=asc" className="block hover:text-white transition-colors">Cheapest</Link>
                <Link to="/books?sortBy=createdAt&sortDir=desc" className="block hover:text-white transition-colors">Newest</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Account</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <Link to="/login" className="block hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="block hover:text-white transition-colors">Register</Link>
                <Link to="/dashboard/orders" className="block hover:text-white transition-colors">My Orders</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || 'Gramedia Bookstore'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
