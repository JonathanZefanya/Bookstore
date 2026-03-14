import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Book, Review } from '../../types';
import api, { getImageUrl } from '../../api/axios';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon, ShoppingCartIcon, BuildingOfficeIcon, UserIcon, IdentificationIcon, BookOpenIcon, ScaleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const BookDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<{ data: Book }>(`/books/${slug}`)
      .then(res => {
        const b = res.data.data;
        setBook(b);
        return Promise.all([
          api.get(`/reviews/book/${b.id}`),
          api.get(`/reviews/book/${b.id}/summary`)
        ]);
      })
      .then(([revRes, sumRes]) => {
        setReviews(revRes.data.data);
        setSummary(sumRes.data.data);
      })
      .catch(() => toast.error('Book not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddCart = () => {
    if (book) addToCart(book.id, qty);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    setSubmittingReview(true);
    try {
      await api.post('/reviews', { bookId: book.id, rating, comment });
      toast.success('Review added!');
      const [revRes, sumRes] = await Promise.all([
        api.get(`/reviews/book/${book.id}`),
        api.get(`/reviews/book/${book.id}/summary`)
      ]);
      setReviews(revRes.data.data);
      setSummary(sumRes.data.data);
      setComment(''); setRating(5);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto p-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-96 aspect-[2/3] bg-gray-200 rounded-2xl" />
        <div className="flex-1 space-y-6">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded w-1/3 mt-8" />
        </div>
      </div>
    </div>
  );

  if (!book) return (
    <div className="text-center py-20 text-gray-500">
      <h2 className="text-2xl font-bold mb-4">Book not found</h2>
      <Link to="/books" className="text-indigo-600 underline">Back to catalog</Link>
    </div>
  );

  return (
    <div className="bg-white pb-16">
      {/* Top Banner (subtle background for the header area) */}
      <div className="bg-slate-50 border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Left: Cover Image */}
            <div className="w-full max-w-sm mx-auto lg:w-96 lg:mx-0 flex-shrink-0 relative z-10 lg:-mb-32">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/10 border-4 border-white bg-white aspect-[2/3] relative group">
                {book.coverImage ? (
                  <img src={getImageUrl(book.coverImage)!} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">No cover image</div>
                )}
                {book.stock <= 5 && book.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Only {book.stock} left</div>
                )}
                {book.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Out of stock</div>
                )}
              </div>
            </div>

            {/* Right: Book Details Intro */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Link to={`/books?categoryId=${book.category?.id}`} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider hover:bg-indigo-200 transition">
                  {book.category?.name}
                </Link>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                  <StarSolid className="w-4 h-4" />
                  {summary.average > 0 ? summary.average.toFixed(1) : 'No ratings yet'} 
                  <span className="text-amber-700/60 font-normal ml-1">({summary.count} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {book.title}
              </h1>
              
              <p className="text-xl text-slate-600 mb-6 font-medium">
                by <span className="text-indigo-600">{book.author}</span>
              </p>

              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-slate-200">
                <span className="text-4xl font-black text-slate-900">${book.price.toFixed(2)}</span>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{book.stock} in stock</span>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white overflow-hidden h-14 w-full sm:w-auto">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 h-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-r border-slate-200 font-bold font-mono text-lg transition-colors">-</button>
                  <input type="number" value={qty} min="1" max={book.stock} readOnly className="w-16 h-full text-center font-bold text-slate-900 focus:outline-none bg-transparent" />
                  <button type="button" onClick={() => setQty(Math.min(book.stock, qty + 1))} className="px-5 h-full text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l border-slate-200 font-bold font-mono text-lg transition-colors">+</button>
                </div>
                <button
                  onClick={handleAddCart}
                  disabled={book.stock === 0 || cartLoading}
                  className="w-full sm:w-auto flex-1 h-14 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {book.stock === 0 ? 'Out of Stock' : 'Add to Cart — $' + (book.price * qty).toFixed(2)}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Description & Metadata */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6 text-indigo-500" /> About this book
              </h2>
              <div className="prose prose-lg prose-indigo max-w-none text-slate-600 leading-relaxed bg-slate-50/50 p-6 lg:p-8 rounded-2xl border border-slate-100">
                {book.description ? (
                  book.description.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ))
                ) : (
                  <p className="italic text-slate-400 text-center py-4">No description provided.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-indigo-500" /> Customer Reviews ({summary.count})
              </h2>
              
              {isAuthenticated ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 mb-8">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Write a Review</h3>
                  <form onSubmit={handleReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(v => (
                          <button type="button" key={v} onClick={() => setRating(v)} className={`${rating >= v ? 'text-amber-400' : 'text-slate-200'} focus:outline-none transition-colors`}>
                            <StarSolid className="w-8 h-8 hover:scale-110 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                      <textarea
                        value={comment} onChange={e => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        rows={3} className="w-full border-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 resize-none bg-slate-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    <button type="submit" disabled={submittingReview} className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-indigo-100 p-6 mb-8 text-center">
                  <p className="text-slate-600 mb-3">Please sign in to write a review.</p>
                  <Link to="/login" className="inline-block px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">Sign In</Link>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-slate-500 italic p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-white">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                          {r.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{r.user.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                              {Array.from({length: 5}).map((_, i) => (
                                <StarSolid key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Key Details Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28 border-t-4 border-t-indigo-600">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-widest text-xs mb-6 text-center text-indigo-600">Product Details</h3>
              <ul className="space-y-4 divide-y divide-slate-100">
                <li className="pt-2 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><BuildingOfficeIcon className="w-5 h-5 text-slate-400" /> Publisher</span>
                    <span className="font-semibold text-slate-900 text-right">{book.publisher?.name || '-'}</span>
                  </div>
                </li>
                <li className="pt-4 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><ClockIcon className="w-5 h-5 text-slate-400" /> Publish Year</span>
                    <span className="font-semibold text-slate-900 text-right">{book.publishYear || '-'}</span>
                  </div>
                </li>
                <li className="pt-4 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><IdentificationIcon className="w-5 h-5 text-slate-400" /> ISBN</span>
                    <span className="font-medium font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded text-right">{book.isbn || '-'}</span>
                  </div>
                </li>
                <li className="pt-4 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><ScaleIcon className="w-5 h-5 text-slate-400" /> Weight</span>
                    <span className="font-semibold text-slate-900 text-right">{book.weightGram ? `${book.weightGram} g` : '-'}</span>
                  </div>
                </li>
                <li className="pt-4 pb-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-500"><UserIcon className="w-5 h-5 text-slate-400" /> Added On</span>
                    <span className="font-semibold text-slate-900 text-right">{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
