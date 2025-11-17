import { useState, lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';

// Загружаем только главную страницу сразу
import HomePage from './pages/HomePage';

// Lazy loading для остальных страниц
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const OrderFormPage = lazy(() => import('./pages/OrderFormPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));

// Admin pages - lazy load
const AdminArticlesPage = lazy(() => import('./pages/AdminArticlesPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminLayout = lazy(() => import('./pages/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const HockeyClubsPage = lazy(() => import('./pages/admin/HockeyClubsPage'));
const PortfolioAdminPage = lazy(() => import('./pages/admin/PortfolioPage'));
const ReviewsManagementPage = lazy(() => import('./pages/admin/ReviewsManagementPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const LegalPagesPage = lazy(() => import('./pages/admin/LegalPagesPage'));
const MediaPage = lazy(() => import('./pages/admin/MediaPage'));
const SiteSettingsPage = lazy(() => import('./pages/admin/SiteSettingsPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const MakeAdminPage = lazy(() => import('./pages/MakeAdminPage'));
const TestUploadPage = lazy(() => import('./pages/TestUploadPage'));
const TestGuidelinesPage = lazy(() => import('./pages/TestGuidelinesPage'));

import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';

// Компонент загрузки
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    return localStorage.getItem('cookiesAccepted') !== 'true';
  });

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieBanner(false);
  };

  return (
    <div className="App flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <Breadcrumbs />}
      <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/order" element={<OrderFormPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/legal/:slug" element={<LegalPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<ArticlePage />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/make-admin" element={<MakeAdminPage />} />
                <Route path="/test-upload" element={<TestUploadPage />} />
                <Route path="/test-guidelines" element={<TestGuidelinesPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="articles" element={<AdminArticlesPage />} />
                  <Route path="hockey-clubs" element={<HockeyClubsPage />} />
                  <Route path="portfolio" element={<PortfolioAdminPage />} />
                  <Route path="reviews" element={<ReviewsManagementPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="legal" element={<LegalPagesPage />} />
                  <Route path="media" element={<MediaPage />} />
                  <Route path="site-settings" element={<SiteSettingsPage />} />
                </Route>
                
                {/* Legacy admin routes */}
                <Route path="/admin-articles" element={<AdminArticlesPage />} />
                <Route path="/admin-orders" element={<AdminOrdersPage />} />
              </Routes>
            </Suspense>
          </main>
          {!isAdminRoute && <Footer />}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 2000,
              iconTheme: {
                primary: '#2563eb',
                secondary: '#fff',
              },
              style: {
                background: '#fff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {showCookieBanner && !isAdminRoute && (
            <CookieBanner onAccept={handleAcceptCookies} />
          )}
        </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
