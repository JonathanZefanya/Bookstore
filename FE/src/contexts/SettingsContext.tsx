import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Settings {
  id?: number;
  siteName: string;
  siteLogo?: string;
  siteFavicon?: string;
  themeColor?: string;
  footerText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<Settings>;
  uploadLogo: (file: File) => Promise<Settings>;
  uploadFavicon: (file: File) => Promise<Settings>;
  uploadOgImage: (file: File) => Promise<Settings>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  siteName: 'Bookstore',
  themeColor: '#000000',
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/settings`, {
        timeout: 5000,
      });
      setSettings(response.data || defaultSettings);
    } catch (err) {
      // Use default settings if API is unavailable
      setSettings(defaultSettings);
      const message = err instanceof Error ? err.message : 'Failed to fetch settings';
      console.warn('Using default settings:', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/settings`, newSettings);
      setSettings(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      setError(message);
      throw err;
    }
  };

  const uploadFile = async (file: File, endpoint: string) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/settings/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSettings(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'File upload failed';
      setError(message);
      throw err;
    }
  };

  const uploadLogo = (file: File) => uploadFile(file, 'upload-logo');
  const uploadFavicon = (file: File) => uploadFile(file, 'upload-favicon');
  const uploadOgImage = (file: File) => uploadFile(file, 'upload-og-image');

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    refreshSettings,
    updateSettings,
    uploadLogo,
    uploadFavicon,
    uploadOgImage,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
