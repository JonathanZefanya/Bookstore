import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import SEOHead from '../components/SEOHead';
import { useSettings } from '../contexts/SettingsContext';
import './BooksPage.css';

interface Book {
  id: number;
  title: string;
  slug: string;
  description: string;
  author: string;
  cover: string;
  isbn: string;
  price: number;
  publishYear: number;
}

const BooksPage: React.FC = () => {
  const { settings } = useSettings();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8086/uploads/';
  const themeColor = settings?.themeColor || '#4f46e5';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/books`);
        setBooks(response.data || []);
      } catch (err) {
        const e = err as AxiosError<{ message?: string }>;
        setError(e.response?.data?.message || e.message || 'Failed to load books. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filtered = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Browse Books"
        description="Explore our complete catalog of books across all genres."
        pageUrl="/books"
      />

      <div className="books-page">
        <div className="books-hero">
          <div className="container">
            <h1 className="books-hero-title">Our Collection</h1>
            <p className="books-hero-sub">Discover your next great read from {books.length}+ books</p>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
                id="books-search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>
        </div>

        <div className="container books-content">
          {loading && (
            <div className="books-loading">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="book-skeleton" />
              ))}
            </div>
          )}

          {error && (
            <div className="books-error">
              <span className="error-icon">⚠️</span>
              <h3>Unable to Load Books</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="books-empty">
              <span className="empty-icon">📭</span>
              <h3>{search ? 'No books found' : 'No books yet'}</h3>
              <p>{search ? `No results for "${search}"` : 'Books will appear here once added.'}</p>
              {search && <button className="btn btn-secondary" onClick={() => setSearch('')}>Clear Search</button>}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              {search && (
                <p className="search-results-count">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                </p>
              )}
              <div className="books-grid">
                {filtered.map(book => (
                  <Link key={book.id} to={`/books/${book.slug}`} className="book-card">
                    <div className="book-cover-wrapper">
                      {book.cover ? (
                        <img
                          src={`${UPLOADS_URL}${book.cover}`}
                          alt={book.title}
                          className="book-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) parent.classList.add('no-cover');
                          }}
                        />
                      ) : (
                        <div className="book-cover-placeholder">📖</div>
                      )}
                      {book.price && (
                        <div className="book-price-badge" style={{ background: themeColor }}>
                          ${book.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="book-card-info">
                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">by {book.author}</p>
                      {book.publishYear && (
                        <p className="book-card-year">{book.publishYear}</p>
                      )}
                      {book.description && (
                        <p className="book-card-desc">{book.description.substring(0, 90)}...</p>
                      )}
                      <div className="book-card-footer">
                        <span className="book-read-more" style={{ color: themeColor }}>
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BooksPage;
