import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Shield,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import ProductsPage from './admin/ProductsPage';
import OrdersPage from './admin/OrdersPage';
import PortfolioPage from './admin/PortfolioPage';
import UsersPage from './admin/UsersPage';
import SettingsPage from './admin/SettingsPage';
import DashboardPage from './admin/DashboardPage';
import MediaPage from './admin/MediaPage';
import ReviewsManagementPage from './admin/ReviewsManagementPage';
import SiteSettingsPage from './admin/SiteSettingsPage';
import LegalPagesPage from './admin/LegalPagesPage';
import HockeyClubsPage from './admin/HockeyClubsPage';
import { companyInfo } from '../mock';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth

  const navigation = [
    { name: 'Дашборд', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Продукция', href: '/admin/products', icon: Package },
    { name: 'Заказы', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Портфолио', href: '/admin/portfolio', icon: FolderOpen },
    { name: 'Хоккейные клубы', href: '/admin/hockey-clubs', icon: Shield },
    { name: 'Отзывы', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Медиа', href: '/admin/media', icon: ImageIcon },
    { name: 'Настройки сайта', href: '/admin/site-settings', icon: Settings },
    { name: 'Юридическая инфо', href: '/admin/legal', icon: FileText },
    { name: 'Пользователи', href: '/admin/users', icon: Users },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src={companyInfo.logo} alt="A.V.K. SPORT" className="h-8 w-auto" />
            <span className="font-bold text-gray-900">Админка</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sport-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Добро пожаловать в админ-панель</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="hockey-clubs" element={<HockeyClubsPage />} />
            <Route path="reviews" element={<ReviewsManagementPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="site-settings" element={<SiteSettingsPage />} />
            <Route path="legal" element={<LegalPagesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;