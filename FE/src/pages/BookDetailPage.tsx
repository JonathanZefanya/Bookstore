import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import SEOHead from '../components/SEOHead';
import { useSettings } from '../contexts/SettingsContext';
import './BookDetailPage.css';

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
  content: string;
}

const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8086/uploads/';
  const themeColor = settings?.themeColor || '#4f46e5';

  useEffect(() => {
    if (!slug) return;
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/books/slug/${slug}`);
        setBook(response.data);
      } catch (err) {
        const e = err as AxiosError<{ message?: string }>;
        if (e.response?.status === 404) {
          setError('Book not found. It may have been removed or the URL is incorrect.');
        } else {
          setError(e.response?.data?.message || e.message || 'Failed to load book details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [slug]);

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="detail-skeleton">
            <div className="skeleton skeleton-cover" />
            <div className="skeleton-info">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="detail-error">
            <span className="detail-error-icon">📚</span>
            <h2>Book Not Found</h2>
            <p>{error || 'This book does not exist.'}</p>
            <Link to="/books" className="btn btn-primary">← Back to Books</Link>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = book.cover ? `${UPLOADS_URL}${book.cover}` : null;

  return (
    <>
      <SEOHead
        title={book.title}
        description={book.description}
        keywords={`${book.title}, ${book.author}, books`}
        ogTitle={book.title}
        ogDescription={book.description}
        ogImage={coverUrl || undefined}
        pageUrl={`/books/${book.slug}`}
      />

      <div className="book-detail-page">
        <div className="container">
          <Link to="/books" className="back-link">← Back to Books</Link>

          <div className="detail-container">
            {/* Cover */}
            <div className="detail-cover-col">
              {coverUrl ? (
                <img src={coverUrl} alt={book.title} className="detail-cover-img" />
              ) : (
                <div className="detail-cover-placeholder">📖</div>
              )}
              {book.price && (
                <div className="detail-price" style={{ color: themeColor }}>
                  ${book.price.toFixed(2)}
                </div>
              )}
              <button
                className="btn btn-primary detail-buy-btn"
                style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #7c3aed 100%)` }}
              >
                🛒 Buy Now
              </button>
            </div>

            {/* Info */}
            <div className="detail-info-col">
              <div className="detail-meta">
                {book.publishYear && (
                  <span className="badge badge-primary">{book.publishYear}</span>
                )}
                {book.isbn && (
                  <span className="badge badge-primary">ISBN: {book.isbn}</span>
                )}
              </div>

              <h1 className="detail-title">{book.title}</h1>
              <p className="detail-author">by <strong>{book.author}</strong></p>

              {book.description && (
                <div className="detail-section">
                  <h2 className="detail-section-title">About This Book</h2>
                  <p className="detail-description">{book.description}</p>
                </div>
              )}

              {book.content && (
                <div className="detail-section">
                  <h2 className="detail-section-title">Content Preview</h2>
                  <div
                    className="detail-content"
                    dangerouslySetInnerHTML={{ __html: book.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailPage;
