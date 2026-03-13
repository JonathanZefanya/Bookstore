import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, uploadLogo, uploadFavicon, uploadOgImage, error, loading } =
    useSettings();
  const [formData, setFormData] = useState({
    siteName: settings?.siteName || '',
    themeColor: settings?.themeColor || '#000000',
    footerText: settings?.footerText || '',
    metaTitle: settings?.metaTitle || '',
    metaDescription: settings?.metaDescription || '',
    metaKeywords: settings?.metaKeywords || '',
    ogTitle: settings?.ogTitle || '',
    ogDescription: settings?.ogDescription || '',
    canonicalUrl: settings?.canonicalUrl || '',
  });

  const [uploadStatus, setUploadStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadFunction: (file: File) => Promise<any>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('Uploading...');
      await uploadFunction(file);
      setUploadStatus('File uploaded successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      setUploadStatus('Upload failed. Please check file type and size.');
    }
  };

  if (loading) {
    return <div className="settings-page"><p>Loading settings...</p></div>;
  }

  return (
    <div className="settings-page">
      <h1>Website Branding & SEO Settings</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}

      <div className="settings-container">
        {/* Branding Section */}
        <section className="settings-section">
          <h2>Website Branding</h2>

          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
              placeholder="Enter your website name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="themeColor">Theme Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                id="themeColor"
                name="themeColor"
                value={formData.themeColor}
                onChange={handleInputChange}
              />
              <span className="color-value">{formData.themeColor}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="footerText">Footer Text</label>
            <textarea
              id="footerText"
              name="footerText"
              value={formData.footerText}
              onChange={handleInputChange}
              placeholder="Enter footer text"
              rows={3}
            />
          </div>

          {/* Logo Upload */}
          <div className="form-group">
            <label htmlFor="logoUpload">Upload Logo</label>
            <div className="file-upload">
              <input
                type="file"
                id="logoUpload"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileUpload(e, uploadLogo)}
              />
              <p className="upload-hint">PNG, JPG, WebP (Max 2 MB)</p>
            </div>
            {settings?.siteLogo && (
              <div className="preview">
                <img src={`${import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8080/uploads/'}${settings.siteLogo}`} 
                     alt="Logo" 
                     style={{ maxWidth: '200px', margin: '10px 0' }} 
                />
              </div>
            )}
          </div>

          {/* Favicon Upload */}
          <div className="form-group">
            <label htmlFor="faviconUpload">Upload Favicon</label>
            <div className="file-upload">
              <input
                type="file"
                id="faviconUpload"
                accept="image/x-icon, image/png"
                onChange={(e) => handleFileUpload(e, uploadFavicon)}
              />
              <p className="upload-hint">ICO, PNG (Max 2 MB)</p>
            </div>
            {settings?.siteFavicon && (
              <div className="preview">
                <img src={`${import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8080/uploads/'}${settings.siteFavicon}`} 
                     alt="Favicon" 
                     style={{ maxWidth: '64px', margin: '10px 0' }} 
                />
              </div>
            )}
          </div>
        </section>

        {/* SEO Section */}
        <section className="settings-section">
          <h2>SEO Settings</h2>

          <div className="form-group">
            <label htmlFor="metaTitle">Meta Title</label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="Meta title for search engines"
              maxLength={60}
            />
            <small>{formData.metaTitle.length}/60 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="metaDescription">Meta Description</label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              placeholder="Meta description for search engines"
              rows={2}
              maxLength={160}
            />
            <small>{formData.metaDescription.length}/160 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="metaKeywords">Meta Keywords</label>
            <textarea
              id="metaKeywords"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleInputChange}
              placeholder="Comma-separated keywords"
              rows={2}
            />
          </div>

          {/* OpenGraph Section */}
          <h3>OpenGraph (Social Sharing)</h3>

          <div className="form-group">
            <label htmlFor="ogTitle">OG Title</label>
            <input
              type="text"
              id="ogTitle"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleInputChange}
              placeholder="Title for social media sharing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ogDescription">OG Description</label>
            <textarea
              id="ogDescription"
              name="ogDescription"
              value={formData.ogDescription}
              onChange={handleInputChange}
              placeholder="Description for social media sharing"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ogImageUpload">Upload OG Image</label>
            <div className="file-upload">
              <input
                type="file"
                id="ogImageUpload"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileUpload(e, uploadOgImage)}
              />
              <p className="upload-hint">PNG, JPG, WebP (Max 2 MB)</p>
            </div>
            {settings?.ogImage && (
              <div className="preview">
                <img src={`${import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8080/uploads/'}${settings.ogImage}`} 
                     alt="OG Image" 
                     style={{ maxWidth: '300px', margin: '10px 0' }} 
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="canonicalUrl">Canonical URL</label>
            <input
              type="url"
              id="canonicalUrl"
              name="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
