import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8086/uploads/';
  const logoUrl = settings?.siteLogo ? `${uploadsUrl}${settings.siteLogo}` : null;
  const siteName = settings?.siteName || 'Bookstore';

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/books', label: 'Books' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="navbar-logo-img" />
          ) : (
            <div className="navbar-logo-text">
              <span className="logo-icon">📚</span>
              <span className="logo-name">{siteName}</span>
            </div>
          )}
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${
                link.exact
                  ? location.pathname === link.to ? 'active' : ''
                  : isActive(link.to) && link.to !== '/' ? 'active' : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/books" className="btn btn-primary btn-sm nav-cta" onClick={() => setMenuOpen(false)}>
            Browse Books
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
