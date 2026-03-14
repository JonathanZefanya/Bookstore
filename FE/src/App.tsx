import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import BooksPage from './pages/public/BooksPage';
import BookDetailPage from './pages/public/BookDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// User Dashboard
import UserDashboard from './pages/dashboard/UserDashboard';
import MyOrders from './pages/dashboard/MyOrders';
import OrderDetail from './pages/dashboard/OrderDetail';
import MyProfile from './pages/dashboard/MyProfile';
import CartPage from './pages/dashboard/CartPage';
import CheckoutPage from './pages/dashboard/CheckoutPage';

// Staff Dashboard
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBooks from './pages/staff/StaffBooks';
import StaffBookForm from './pages/staff/StaffBookForm';
import StaffCategories from './pages/staff/StaffCategories';
import StaffPublishers from './pages/staff/StaffPublishers';
import StaffOrders from './pages/staff/StaffOrders';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleRoute: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:slug" element={<BookDetailPage />} />
      </Route>

      {/* Auth */}
      <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* User Dashboard */}
      <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>
      <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

      {/* Staff Dashboard */}
      <Route path="staff" element={<RoleRoute roles={['ADMIN','STAFF']}><StaffLayout /></RoleRoute>}>
        <Route index element={<StaffDashboard />} />
        <Route path="books" element={<StaffBooks />} />
        <Route path="books/new" element={<StaffBookForm />} />
        <Route path="books/:id/edit" element={<StaffBookForm />} />
        <Route path="categories" element={<StaffCategories />} />
        <Route path="publishers" element={<StaffPublishers />} />
        <Route path="orders" element={<StaffOrders />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="admin" element={<RoleRoute roles={['ADMIN']}><AdminLayout /></RoleRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="books" element={<StaffBooks />} />
        <Route path="books/new" element={<StaffBookForm />} />
        <Route path="books/:id/edit" element={<StaffBookForm />} />
        <Route path="categories" element={<StaffCategories />} />
        <Route path="publishers" element={<StaffPublishers />} />
        <Route path="orders" element={<StaffOrders />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '8px', fontFamily: 'Inter, sans-serif' },
              success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
            }}
          />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
