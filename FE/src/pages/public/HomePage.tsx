import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, TruckIcon, ShieldCheckIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-slate-900 border-b border-indigo-900/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle gradient shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] opacity-50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
              Discover Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Great Read</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Explore thousands of books from top publishers across all genres. Join with us today and build the library of your dreams with exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/books" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all text-lg flex items-center justify-center gap-2">
                <BookOpenIcon className="w-5 h-5" /> Browse Collection
              </Link>
              <Link to="/register" className="px-8 py-4 bg-white/10 text-white backdrop-blur-md font-semibold rounded-full hover:bg-white/20 transition-all text-lg border border-white/10 text-center">
                Join Now for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-gray-100 relative z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center">
            <div className="py-8 px-4 flex flex-col items-center">
              <TruckIcon className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Calculated Shipping</h3>
              <p className="text-sm text-gray-500 mt-1">Weight-based fair rates across regions</p>
            </div>
            <div className="py-8 px-4 flex flex-col items-center">
              <ShieldCheckIcon className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Secure Payments</h3>
              <p className="text-sm text-gray-500 mt-1">Safe simulated checkout process</p>
            </div>
            <div className="py-8 px-4 flex flex-col items-center">
              <HandThumbUpIcon className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-gray-900">Quality Verified</h3>
              <p className="text-sm text-gray-500 mt-1">Books sourced directly from publishers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start reading?</h2>
          <p className="text-gray-600 mb-8">Access our full catalog and start adding to your cart instantly.</p>
          <Link to="/books" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            View All Books →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
