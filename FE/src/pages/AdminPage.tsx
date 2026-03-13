import React, { useState, useEffect } from 'react';
import { useSettings, type Settings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';
import SEOHead from '../components/SEOHead';
import './AdminPage.css';

type TabId = 'branding' | 'seo' | 'books';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:8086/uploads/';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

/* ─── Types ─── */
interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  cover: string;
  price: number;
  publishYear: number;
  description: string;
  isbn: string;
  content: string;
}

interface BookForm {
  title: string;
  author: string;
  isbn: string;
  price: string;
  publishYear: string;
  description: string;
  content: string;
  cover: string;
}

const emptyBookForm: BookForm = {
  title: '', author: '', isbn: '', price: '', publishYear: '',
  description: '', content: '', cover: '',
};

/* ─── File Upload Button ─── */
const FileUploadBtn: React.FC<{
  id: string;
  label: string;
  accept: string;
  hint: string;
  previewUrl?: string;
  loading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, accept, hint, previewUrl, loading, onChange }) => (
  <div className="upload-group">
    <label className="upload-label">{label}</label>
    <label htmlFor={id} className={`upload-zone ${loading ? 'uploading' : ''}`}>
      {previewUrl ? (
        <img src={previewUrl} alt={label} className="upload-preview-img" />
      ) : (
        <div className="upload-placeholder">
          <span className="upload-icon">📁</span>
          <span className="upload-text">{loading ? 'Uploading...' : 'Click to upload'}</span>
          <span className="upload-hint">{hint}</span>
        </div>
      )}
      {previewUrl && <div className="upload-overlay">
        <span>Change File</span>
      </div>}
    </label>
    <input
      type="file"
      id={id}
      accept={accept}
      onChange={onChange}
      className="upload-hidden"
      disabled={loading}
    />
  </div>
);

/* ─── Admin Page ─── */
const AdminPage: React.FC = () => {
  const { settings, updateSettings, uploadLogo, uploadFavicon, uploadOgImage, loading: settingsLoading } = useSettings();
  const { showToast } = useToast();

  const [tab, setTab] = useState<TabId>('branding');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  // Branding + SEO form
  const [form, setForm] = useState<Partial<Settings>>({});

  // Books state
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<BookForm>(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [bookSaving, setBookSaving] = useState(false);
  const [bookFormVisible, setBookFormVisible] = useState(false);

  // Init form from settings
  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || '',
        themeColor: settings.themeColor || '#4f46e5',
        footerText: settings.footerText || '',
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        ogTitle: settings.ogTitle || '',
        ogDescription: settings.ogDescription || '',
        canonicalUrl: settings.canonicalUrl || '',
      });
    }
  }, [settings]);

  // Fetch books
  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      setBooksError(null);
      const res = await fetch(`${API_BASE_URL}/books`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setBooks(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load books';
      setBooksError(msg);
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'books') fetchBooks();
  }, [tab]);

  // Input handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSettings = async () => {
    if (!form.siteName?.trim()) {
      showToast('Site name is required.', 'error');
      return;
    }
    try {
      setSaving(true);
      await updateSettings(form);
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadFn: (file: File) => Promise<Settings>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size must be less than 2 MB', 'error');
      e.target.value = '';
      return;
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/x-icon'];
    if (!allowed.includes(file.type)) {
      showToast('Invalid file type. Allowed: PNG, JPG, WebP, ICO', 'error');
      e.target.value = '';
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [key]: true }));
      await uploadFn(file);
      showToast('File uploaded successfully!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(msg, 'error');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
      e.target.value = '';
    }
  };

  /* ─── Book CRUD ─── */
  const openCreateForm = () => {
    setEditingBookId(null);
    setBookForm(emptyBookForm);
    setBookFormVisible(true);
  };

  const openEditForm = (book: Book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      price: book.price?.toString() || '',
      publishYear: book.publishYear?.toString() || '',
      description: book.description || '',
      content: book.content || '',
      cover: book.cover || '',
    });
    setBookFormVisible(true);
  };

  const handleBookFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveBook = async () => {
    if (!bookForm.title.trim()) {
      showToast('Book title is required.', 'error');
      return;
    }
    try {
      setBookSaving(true);
      const payload = {
        title: bookForm.title,
        author: bookForm.author,
        isbn: bookForm.isbn,
        price: bookForm.price ? parseFloat(bookForm.price) : null,
        publishYear: bookForm.publishYear ? parseInt(bookForm.publishYear) : null,
        description: bookForm.description,
        content: bookForm.content,
        cover: bookForm.cover,
      };

      const url = editingBookId ? `${API_BASE_URL}/books/${editingBookId}` : `${API_BASE_URL}/books`;
      const method = editingBookId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Server error: ${res.status}` }));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }

      showToast(editingBookId ? 'Book updated!' : 'Book created!', 'success');
      setBookFormVisible(false);
      fetchBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save book';
      showToast(msg, 'error');
    } finally {
      setBookSaving(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Server error: ${res.status}` }));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }
      showToast('Book deleted.', 'success');
      fetchBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete book';
      showToast(msg, 'error');
    }
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'books', label: 'Books', icon: '📚' },
  ];

  return (
    <>
      <SEOHead title="Admin Dashboard" pageUrl="/admin" />

      <div className="admin-page">
        <div className="container">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage your bookstore settings and content</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`admin-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
                id={`tab-${t.id}`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="admin-content">
            {/* ─── BRANDING TAB ─── */}
            {tab === 'branding' && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h2>Website Branding</h2>
                  <p>Configure your site identity and appearance</p>
                </div>

                <div className="settings-grid">
                  <div className="settings-col">
                    <div className="field-group">
                      <label htmlFor="siteName">Site Name *</label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={form.siteName || ''}
                        onChange={handleFormChange}
                        placeholder="Enter website name"
                        className="field-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="themeColor">Theme Color</label>
                      <div className="color-row">
                        <input
                          type="color"
                          id="themeColor"
                          name="themeColor"
                          value={form.themeColor || '#4f46e5'}
                          onChange={handleFormChange}
                          className="color-picker"
                        />
                        <input
                          type="text"
                          value={form.themeColor || '#4f46e5'}
                          onChange={e => setForm(prev => ({ ...prev, themeColor: e.target.value }))}
                          className="field-input color-text"
                          placeholder="#4f46e5"
                          maxLength={7}
                        />
                        <div
                          className="color-swatch"
                          style={{ background: form.themeColor || '#4f46e5' }}
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label htmlFor="footerText">Footer Text</label>
                      <textarea
                        id="footerText"
                        name="footerText"
                        value={form.footerText || ''}
                        onChange={handleFormChange}
                        placeholder="e.g. © 2025 Bookstore. All rights reserved."
                        className="field-input field-textarea"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="settings-col">
                    <FileUploadBtn
                      id="logo-upload"
                      label="Site Logo"
                      accept="image/png,image/jpeg,image/webp"
                      hint="PNG, JPG, WebP · Max 2 MB"
                      previewUrl={settings?.siteLogo ? `${UPLOADS_URL}${settings.siteLogo}` : undefined}
                      loading={uploading['logo']}
                      onChange={e => handleFileUpload(e, uploadLogo, 'logo')}
                    />

                    <FileUploadBtn
                      id="favicon-upload"
                      label="Favicon"
                      accept="image/x-icon,image/png"
                      hint="ICO, PNG · Max 2 MB"
                      previewUrl={settings?.siteFavicon ? `${UPLOADS_URL}${settings.siteFavicon}` : undefined}
                      loading={uploading['favicon']}
                      onChange={e => handleFileUpload(e, uploadFavicon, 'favicon')}
                    />
                  </div>
                </div>

                <div className="panel-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                    disabled={saving || settingsLoading}
                    id="save-branding-btn"
                  >
                    {saving ? '⏳ Saving...' : '💾 Save Branding'}
                  </button>
                </div>
              </div>
            )}

            {/* ─── SEO TAB ─── */}
            {tab === 'seo' && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h2>SEO Settings</h2>
                  <p>Control how your site appears in search engines and social media</p>
                </div>

                <div className="seo-grid">
                  <div className="seo-section">
                    <h3 className="seo-section-title">🔎 Search Engine</h3>

                    <div className="field-group">
                      <label htmlFor="metaTitle">Meta Title</label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={form.metaTitle || ''}
                        onChange={handleFormChange}
                        placeholder="Page title for search engines"
                        className="field-input"
                        maxLength={60}
                      />
                      <small className="field-hint">{(form.metaTitle || '').length}/60 chars</small>
                    </div>

                    <div className="field-group">
                      <label htmlFor="metaDescription">Meta Description</label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={form.metaDescription || ''}
                        onChange={handleFormChange}
                        placeholder="Brief description for search results"
                        className="field-input field-textarea"
                        rows={3}
                        maxLength={160}
                      />
                      <small className="field-hint">{(form.metaDescription || '').length}/160 chars</small>
                    </div>

                    <div className="field-group">
                      <label htmlFor="metaKeywords">Meta Keywords</label>
                      <textarea
                        id="metaKeywords"
                        name="metaKeywords"
                        value={form.metaKeywords || ''}
                        onChange={handleFormChange}
                        placeholder="books, fiction, technology, programming"
                        className="field-input field-textarea"
                        rows={2}
                      />
                      <small className="field-hint">Comma-separated keywords</small>
                    </div>

                    <div className="field-group">
                      <label htmlFor="canonicalUrl">Canonical URL</label>
                      <input
                        type="url"
                        id="canonicalUrl"
                        name="canonicalUrl"
                        value={form.canonicalUrl || ''}
                        onChange={handleFormChange}
                        placeholder="https://yoursite.com"
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="seo-section">
                    <h3 className="seo-section-title">📣 OpenGraph (Social)</h3>

                    <div className="field-group">
                      <label htmlFor="ogTitle">OG Title</label>
                      <input
                        type="text"
                        id="ogTitle"
                        name="ogTitle"
                        value={form.ogTitle || ''}
                        onChange={handleFormChange}
                        placeholder="Title for social sharing"
                        className="field-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="ogDescription">OG Description</label>
                      <textarea
                        id="ogDescription"
                        name="ogDescription"
                        value={form.ogDescription || ''}
                        onChange={handleFormChange}
                        placeholder="Description for social sharing"
                        className="field-input field-textarea"
                        rows={3}
                      />
                    </div>

                    <FileUploadBtn
                      id="og-image-upload"
                      label="OG Image"
                      accept="image/png,image/jpeg,image/webp"
                      hint="PNG, JPG, WebP · 1200×630 recommended · Max 2 MB"
                      previewUrl={settings?.ogImage ? `${UPLOADS_URL}${settings.ogImage}` : undefined}
                      loading={uploading['ogImage']}
                      onChange={e => handleFileUpload(e, uploadOgImage, 'ogImage')}
                    />
                  </div>
                </div>

                <div className="panel-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                    disabled={saving || settingsLoading}
                    id="save-seo-btn"
                  >
                    {saving ? '⏳ Saving...' : '💾 Save SEO Settings'}
                  </button>
                </div>
              </div>
            )}

            {/* ─── BOOKS TAB ─── */}
            {tab === 'books' && (
              <div className="settings-panel">
                <div className="panel-header books-panel-header">
                  <div>
                    <h2>Books Management</h2>
                    <p>Add, edit, or remove books from your catalog</p>
                  </div>
                  <button className="btn btn-primary" onClick={openCreateForm} id="add-book-btn">
                    + Add Book
                  </button>
                </div>

                {/* Book Form */}
                {bookFormVisible && (
                  <div className="book-form-panel">
                    <h3 className="book-form-title">{editingBookId ? '✏️ Edit Book' : '➕ New Book'}</h3>
                    <div className="book-form-grid">
                      <div className="field-group">
                        <label htmlFor="bf-title">Title *</label>
                        <input type="text" id="bf-title" name="title" value={bookForm.title} onChange={handleBookFormChange} className="field-input" placeholder="Book title" />
                      </div>
                      <div className="field-group">
                        <label htmlFor="bf-author">Author</label>
                        <input type="text" id="bf-author" name="author" value={bookForm.author} onChange={handleBookFormChange} className="field-input" placeholder="Author name" />
                      </div>
                      <div className="field-group">
                        <label htmlFor="bf-isbn">ISBN</label>
                        <input type="text" id="bf-isbn" name="isbn" value={bookForm.isbn} onChange={handleBookFormChange} className="field-input" placeholder="978-0-00-000000-0" />
                      </div>
                      <div className="field-group">
                        <label htmlFor="bf-price">Price ($)</label>
                        <input type="number" id="bf-price" name="price" value={bookForm.price} onChange={handleBookFormChange} className="field-input" placeholder="29.99" min="0" step="0.01" />
                      </div>
                      <div className="field-group">
                        <label htmlFor="bf-year">Publish Year</label>
                        <input type="number" id="bf-year" name="publishYear" value={bookForm.publishYear} onChange={handleBookFormChange} className="field-input" placeholder="2024" min="1000" max="2099" />
                      </div>
                      <div className="field-group">
                        <label htmlFor="bf-cover">Cover Filename</label>
                        <input type="text" id="bf-cover" name="cover" value={bookForm.cover} onChange={handleBookFormChange} className="field-input" placeholder="filename.jpg (from uploads)" />
                      </div>
                      <div className="field-group field-full">
                        <label htmlFor="bf-desc">Description</label>
                        <textarea id="bf-desc" name="description" value={bookForm.description} onChange={handleBookFormChange} className="field-input field-textarea" rows={3} placeholder="Book description..." />
                      </div>
                      <div className="field-group field-full">
                        <label htmlFor="bf-content">Content / Preview (HTML allowed)</label>
                        <textarea id="bf-content" name="content" value={bookForm.content} onChange={handleBookFormChange} className="field-input field-textarea" rows={5} placeholder="Optional content preview..." />
                      </div>
                    </div>
                    <div className="book-form-actions">
                      <button className="btn btn-secondary" onClick={() => setBookFormVisible(false)} disabled={bookSaving}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSaveBook} disabled={bookSaving} id="save-book-btn">
                        {bookSaving ? '⏳ Saving...' : editingBookId ? '💾 Update Book' : '✅ Create Book'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Books List */}
                {booksLoading && <div className="books-list-loading">Loading books...</div>}
                {booksError && (
                  <div className="books-list-error">
                    <span>⚠️</span> {booksError}
                    <button className="btn btn-secondary btn-sm" onClick={fetchBooks} style={{ marginLeft: 12 }}>Retry</button>
                  </div>
                )}
                {!booksLoading && !booksError && books.length === 0 && (
                  <div className="books-list-empty">
                    <span>📭</span>
                    <p>No books yet. Click "Add Book" to create your first one.</p>
                  </div>
                )}
                {!booksLoading && books.length > 0 && (
                  <div className="books-admin-list">
                    {books.map(book => (
                      <div key={book.id} className="book-admin-row">
                        <div className="book-admin-cover">
                          {book.cover ? (
                            <img
                              src={`${UPLOADS_URL}${book.cover}`}
                              alt={book.title}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="book-admin-cover-placeholder">📖</div>
                          )}
                        </div>
                        <div className="book-admin-info">
                          <h4 className="book-admin-title">{book.title}</h4>
                          <p className="book-admin-author">{book.author}</p>
                          <p className="book-admin-meta">
                            {book.publishYear && <span>{book.publishYear}</span>}
                            {book.price && <span>${book.price}</span>}
                            <span className="book-slug-chip">/books/{book.slug}</span>
                          </p>
                        </div>
                        <div className="book-admin-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEditForm(book)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
