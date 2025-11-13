import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, User, Phone, Mail, MapPin, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/orders`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Ошибка загрузки заказов');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Статус обновлен');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-600 text-white',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      processing: 'В производстве',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="admin-orders-page bg-gray-50 min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Заказы</h1>
          <p className="text-gray-600">Управление заказами клиентов</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl text-gray-600">Заказов пока нет</p>
              </Card>
            ) : (
              orders.map((order) => (
                <Card 
                  key={order.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Заказ #{order.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(order.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={16} />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={16} />
                      <span>{order.customer_phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">
                      {order.items.length} товар(ов)
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {order.total_amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <Card className="p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Детали заказа</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Клиент</p>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Телефон</p>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <a href={`tel:${selectedOrder.customer_phone}`} className="font-medium text-blue-600 hover:underline">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <a href={`mailto:${selectedOrder.customer_email}`} className="font-medium text-blue-600 hover:underline">
                        {selectedOrder.customer_email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Адрес доставки</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-1" />
                      <span className="font-medium">{selectedOrder.shipping_address}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Товары:</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-600">
                          {item.size_category} • {item.quantity} шт. • {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {selectedOrder.total_amount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.order_notes && (
                  <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Комментарий:</p>
                    <p className="text-sm">{selectedOrder.order_notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-semibold mb-2">Изменить статус:</p>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    disabled={selectedOrder.status === 'confirmed'}
                    className="w-full"
                    variant="outline"
                  >
                    Подтвердить
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status === 'processing'}
                    className="w-full"
                    variant="outline"
                  >
                    В производство
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={selectedOrder.status === 'shipped'}
                    className="w-full"
                    variant="outline"
                  >
                    Отправлено
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={selectedOrder.status === 'delivered'}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Доставлено
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Выберите заказ для просмотра деталей</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
