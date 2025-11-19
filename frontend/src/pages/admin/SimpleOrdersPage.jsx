import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Phone, Mail, MapPin, Calendar, LogOut } from 'lucide-react';

const SimpleOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      navigate('/admin/login');
      return;
    }

    // Fetch orders
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заказов');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-sm text-gray-600">A.V.K. SPORT - Управление заказами</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span>Выход</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего заказов</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Новые заказы</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Package className="text-green-600" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общая сумма</p>
                <p className="text-3xl font-bold text-blue-600">
                  {orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()} ₽
                </p>
              </div>
              <Package className="text-blue-600" size={40} />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Список заказов</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>Заказов пока нет</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Заказ #{order.id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? 'Новый' :
                         order.status === 'completed' ? 'Выполнен' : order.status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {order.total_amount.toLocaleString()} ₽
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <User size={18} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">Клиент</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={18} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer_phone}</p>
                        <p className="text-xs text-gray-500">Телефон</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={18} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer_email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.shipping_address || 'Не указан'}
                        </p>
                        <p className="text-xs text-gray-500">Адрес доставки</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Товары:</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.product_name} ({item.size_category}) × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {order.order_notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Комментарий:</span> {order.order_notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleOrdersPage;
