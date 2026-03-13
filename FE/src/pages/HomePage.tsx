import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useSettings } from '../contexts/SettingsContext';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const themeColor = settings?.themeColor || '#4f46e5';

  return (
    <>
      <SEOHead pageUrl="/" />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" style={{ background: `radial-gradient(circle, ${themeColor}40 0%, transparent 70%)` }} />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge badge badge-primary">
            <span>✨</span> New Books Added Weekly
          </div>
          <h1 className="hero-title">
            Discover Your Next
            <span className="hero-gradient" style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, #7c3aed 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}> Favorite Book</span>
          </h1>
          <p className="hero-subtitle">
            Explore our curated collection of books across every genre. From timeless classics to modern bestsellers.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-primary" style={{ '--theme': themeColor } as React.CSSProperties}>
              <span>🔍</span> Browse Collection
            </Link>
            <Link to="/admin" className="btn btn-secondary">
              <span>⚙️</span> Admin Dashboard
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value" style={{ color: themeColor }}>1000+</span>
              <span className="stat-label">Books</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value" style={{ color: themeColor }}>50+</span>
              <span className="stat-label">Genres</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value" style={{ color: themeColor }}>Free</span>
              <span className="stat-label">Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Everything you need to find your perfect read</p>
          <div className="features-grid">
            {[
              { icon: '📖', title: 'Vast Collection', desc: 'Over 1,000 titles across all genres, from fiction to technical literature.' },
              { icon: '🔍', title: 'Easy Discovery', desc: 'Search by title, author, or browse by category to find exactly what you want.' },
              { icon: '🏷️', title: 'Great Prices', desc: 'Competitive pricing with regular deals and discounts on featured books.' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Quick shipping to your door. Order today, receive tomorrow.' },
            ].map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon" style={{ background: `${themeColor}20`, color: themeColor }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card" style={{ borderColor: `${themeColor}40` }}>
            <div className="cta-glow" style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)` }} />
            <h2>Ready to Start Reading?</h2>
            <p>Join thousands of readers who discovered their next favorite book here.</p>
            <Link to="/books" className="btn btn-primary">
              Explore All Books →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
