import React, { createContext, useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api, { getImageUrl } from '../api/axios';
import type { Settings } from '../types';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({ settings: null, loading: true });

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Settings }>('/settings')
      .then(res => setSettings(res.data.data))
      .catch((e) => console.error('Failed to load settings', e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Dynamic style update for theme colour
    if (settings.themeColor) {
      document.documentElement.style.setProperty('--color-primary', settings.themeColor);
    }

    // Explicitly update document base title
    document.title = settings.metaTitle || settings.siteName || 'Gramedia Bookstore';

    // Explicitly update favicon
    if (settings.siteFavicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = getImageUrl(settings.siteFavicon) || '/favicon.svg';
    }
  }, [settings]);



  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {settings && (
        <Helmet>
          <title>{settings.metaTitle || settings.siteName || 'Gramedia Bookstore'}</title>
          {settings.metaDescription && <meta name="description" content={settings.metaDescription} />}
          {settings.metaKeywords && <meta name="keywords" content={settings.metaKeywords} />}
          
          {settings.siteName && <meta property="og:site_name" content={settings.siteName} />}
          {settings.ogTitle && <meta property="og:title" content={settings.ogTitle} />}
          {settings.ogDescription && <meta property="og:description" content={settings.ogDescription} />}
          {settings.ogImage ? <meta property="og:image" content={getImageUrl(settings.ogImage)!} /> : null}
          {settings.canonicalUrl && <link rel="canonical" href={settings.canonicalUrl} />}
          
          {settings.siteFavicon ? <link rel="icon" href={getImageUrl(settings.siteFavicon)!} /> : null}
          {settings.themeColor && <meta name="theme-color" content={settings.themeColor} />}
        </Helmet>
      )}
      {children}
    </SettingsContext.Provider>
  );
};
