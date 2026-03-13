import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

export interface Settings {
  id?: number;
  siteName?: string;
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
  themeColor: '#4f46e5',
};

function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (typeof data === 'string') return data;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'An unknown error occurred';
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/settings`, { timeout: 8000 });
      setSettings(response.data || defaultSettings);
    } catch (err) {
      setSettings(defaultSettings);
      console.warn('Using default settings. Backend may be offline:', getErrorMessage(err));
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

  const updateSettings = async (newSettings: Partial<Settings>): Promise<Settings> => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/settings`, newSettings);
      setSettings(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  };

  const uploadFile = async (file: File, endpoint: string): Promise<Settings> => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/settings/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSettings(response.data);
      return response.data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  };

  const uploadLogo = (file: File) => uploadFile(file, 'upload-logo');
  const uploadFavicon = (file: File) => uploadFile(file, 'upload-favicon');
  const uploadOgImage = (file: File) => uploadFile(file, 'upload-og-image');

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings, updateSettings, uploadLogo, uploadFavicon, uploadOgImage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
