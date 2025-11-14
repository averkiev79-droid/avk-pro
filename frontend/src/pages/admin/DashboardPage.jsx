import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, FileText, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    articles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all statistics in parallel
      const [productsRes, usersRes, articlesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/articles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const products = productsRes.ok ? await productsRes.json() : [];
      const users = usersRes.ok ? await usersRes.json() : [];
      const articles = articlesRes.ok ? await articlesRes.json() : [];

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        users: Array.isArray(users) ? users.length : 0,
        orders: 0, // TODO: implement orders API
        articles: Array.isArray(articles) ? articles.length : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      title: 'Товары',
      description: 'Управление каталогом товаров',
      icon: Package,
      path: '/admin/products',
      color: 'bg-blue-500',
      count: stats.products
    },
    {
      title: 'Пользователи',
      description: 'Управление пользователями и ролями',
      icon: Users,
      path: '/admin/users',
      color: 'bg-green-500',
      count: stats.users
    },
    {
      title: 'Заказы',
      description: 'Просмотр и обработка заказов',
      icon: ShoppingBag,
      path: '/admin/orders',
      color: 'bg-purple-500',
      count: stats.orders
    },
    {
      title: 'Статьи',
      description: 'Управление блогом и статьями',
      icon: FileText,
      path: '/admin/articles',
      color: 'bg-orange-500',
      count: stats.articles
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Добро пожаловать, {user?.full_name || 'Администратор'}!
        </h1>
        <p className="text-gray-600">
          Панель управления магазином A.V.K. SPORT
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.products}</h3>
          <p className="text-sm text-gray-600">Товаров в каталоге</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.users}</h3>
          <p className="text-sm text-gray-600">Зарегистрированных пользователей</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.orders}</h3>
          <p className="text-sm text-gray-600">Всего заказов</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.articles}</h3>
          <p className="text-sm text-gray-600">Опубликованных статей</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Быстрый доступ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{link.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{link.count}</span>
                <span className="text-sm text-blue-600 group-hover:underline">Перейти →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
