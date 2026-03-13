import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../contexts/SettingsContext';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  pageUrl?: string;
}

const SEOHead: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  pageUrl,
}) => {
  const { settings } = useSettings();
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8086/uploads/';

  const seoTitle = title
    ? `${title} | ${settings?.siteName || 'Bookstore'}`
    : settings?.metaTitle || settings?.siteName || 'Bookstore';

  const seoDescription = description || settings?.metaDescription || 'Welcome to our bookstore — discover your next great read.';
  const seoKeywords = keywords || settings?.metaKeywords || '';
  const seoOgTitle = ogTitle || settings?.ogTitle || seoTitle;
  const seoOgDescription = ogDescription || settings?.ogDescription || seoDescription;
  const seoOgImage = ogImage || (settings?.ogImage ? `${uploadsBaseUrl}${settings.ogImage}` : '');

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const seoCanonicalUrl = canonicalUrl || settings?.canonicalUrl ||
    `${baseUrl}${pageUrl || window.location.pathname}`;

  const faviconUrl = settings?.siteFavicon
    ? `${uploadsBaseUrl}${settings.siteFavicon}`
    : '/favicon.svg';

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}

      {/* Favicon */}
      <link rel="icon" href={faviconUrl} />
      <link rel="shortcut icon" href={faviconUrl} />

      {/* OpenGraph */}
      <meta property="og:title" content={seoOgTitle} />
      <meta property="og:description" content={seoOgDescription} />
      {seoOgImage && <meta property="og:image" content={seoOgImage} />}
      <meta property="og:url" content={seoCanonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={settings?.siteName || 'Bookstore'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoOgTitle} />
      <meta name="twitter:description" content={seoOgDescription} />
      {seoOgImage && <meta name="twitter:image" content={seoOgImage} />}

      {/* Canonical */}
      {seoCanonicalUrl && <link rel="canonical" href={seoCanonicalUrl} />}
    </Helmet>
  );
};

export default SEOHead;
