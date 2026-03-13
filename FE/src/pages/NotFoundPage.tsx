import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="404 - Page Not Found" />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '40px 24px',
        textAlign: 'center',
        gap: '20px',
      }}>
        <div style={{ fontSize: '80px' }}>📚</div>
        <h1 style={{ fontSize: '3rem', letterSpacing: '-2px', color: 'var(--text-heading)' }}>404</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-heading)', fontWeight: 600 }}>Page Not Found</p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/books" className="btn btn-secondary">Browse Books</Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
