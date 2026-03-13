import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const siteName = settings?.siteName || 'Bookstore';
  const footerText = settings?.footerText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const themeColor = settings?.themeColor || '#4f46e5';

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">📚</span>
          <span className="footer-name" style={{ color: themeColor }}>{siteName}</span>
        </div>
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/books" className="footer-link">Books</Link>
          <Link to="/admin" className="footer-link">Admin</Link>
        </div>
        <p className="footer-copy">{footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
