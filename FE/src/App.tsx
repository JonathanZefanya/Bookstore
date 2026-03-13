import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SettingsProvider } from './contexts/SettingsContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import BookDetailPage from './pages/BookDetailPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <ToastProvider>
          <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/books/:slug" element={<BookDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </SettingsProvider>
    </HelmetProvider>
  )
}

export default App
