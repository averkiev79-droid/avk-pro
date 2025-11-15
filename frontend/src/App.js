import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CalculatorPage from './pages/CalculatorPage';
import OrderFormPage from './pages/OrderFormPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import CartPage from './pages/CartPage';
import LegalPage from './pages/LegalPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import AdminArticlesPage from './pages/AdminArticlesPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminLayout from './pages/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MakeAdminPage from './pages/MakeAdminPage';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
          
          {/* AI Articles Generator (standalone) */}
          <Route path="/ai-articles" element={<AdminArticlesPage />} />
          
          {/* Admin Orders Page */}
          <Route path="/admin-orders" element={<AdminOrdersPage />} />
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <Breadcrumbs />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/calculator" element={<CalculatorPage />} />
                  <Route path="/order" element={<OrderFormPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<ArticlePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/privacy" element={<LegalPage />} />
                  <Route path="/terms" element={<LegalPage />} />
                  <Route path="/requisites" element={<LegalPage />} />
                  <Route path="/cookies" element={<LegalPage />} />
                  <Route path="/legal/:pageType" element={<LegalPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <CookieBanner />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 2000,
            style: {
              background: '#fff',
              color: '#1A202C',
              border: '1px solid #E2E8F0',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#2C5282',
                secondary: '#fff',
              },
            },
            error: {
              duration: 2000,
              iconTheme: {
                primary: '#9B2C2C',
                secondary: '#fff',
              },
            },
          }}
        />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;