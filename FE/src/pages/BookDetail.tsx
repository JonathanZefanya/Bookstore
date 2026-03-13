import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEOHead from '../components/SEOHead';
import '../styles/BookDetail.css';

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

interface BookDetailProps {
  slug?: string;
}

const BookDetail: React.FC<BookDetailProps> = ({ slug = 'the-clean-coder' }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8080/uploads/';

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/books/slug/${slug}`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to fetch book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBook();
    }
  }, [slug]);

  if (loading) {
    return <div className="book-detail"><p>Loading...</p></div>;
  }

  if (error || !book) {
    return <div className="book-detail"><p>{error || 'Book not found'}</p></div>;
  }

  return (
    <div className="book-detail">
      <SEOHead
        title={book.title}
        description={book.description}
        keywords={`${book.title}, ${book.author}, books`}
        ogTitle={book.title}
        ogDescription={book.description}
        ogImage={book.cover ? `${UPLOADS_URL}${book.cover}` : undefined}
        pageUrl={`/books/${book.slug}`}
      />

      <div className="book-container">
        <div className="book-cover">
          {book.cover && (
            <img src={`${UPLOADS_URL}${book.cover}`} alt={book.title} />
          )}
        </div>

        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by {book.author}</p>

          {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
          {book.publishYear && (
            <p className="book-year">Published: {book.publishYear}</p>
          )}

          {book.price && (
            <p className="book-price">${book.price.toFixed(2)}</p>
          )}

          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>

          {book.content && (
            <div className="book-content">
              <h3>Content</h3>
              <div dangerouslySetInnerHTML={{ __html: book.content }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
