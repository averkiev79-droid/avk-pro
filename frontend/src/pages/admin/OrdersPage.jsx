import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Eye, Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: '#001',
      customer: {
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        teamName: 'Юниор СПб'
      },
      items: [
        { name: 'Хоккейное джерси Pro', quantity: 5, price: 3500 },
        { name: 'Гамаши', quantity: 5, price: 800 }
      ],
      total: 21500,
      status: 'processing',
      date: '2024-11-08',
      description: 'Полный комплект для детской команды'
    },
    {
      id: '#002',
      customer: {
        name: 'Мария Сидорова',
        email: 'maria@example.com',
        phone: '+7 (999) 234-56-78',
        teamName: 'Ветераны Невы'
      },
      items: [
        { name: 'Бомбер команды', quantity: 10, price: 4500 }
      ],
      total: 45000,
      status: 'completed',
      date: '2024-11-07',
      description: 'Одинаковые бомберы для любительской команды'
    },
    {
      id: '#003',
      customer: {
        name: 'Алексей Козлов',
        email: 'alex@example.com',
        phone: '+7 (999) 345-67-89',
        teamName: 'Фан-клуб Зенит'
      },
      items: [
        { name: 'Куртка-парка', quantity: 15, price: 6500 },
        { name: 'Жилетка команды', quantity: 15, price: 3200 }
      ],
      total: 145500,
      status: 'pending',
      date: '2024-11-09',
      description: 'Зимняя коллекция для фан-клуба'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает' },
    { value: 'processing', label: 'В работе' },
    { value: 'completed', label: 'Выполнен' },
    { value: 'cancelled', label: 'Отменен' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return statusOptions.find(s => s.value === status)?.label || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
        <p className="text-gray-600">Просматривайте и обрабатывайте заказы клиентов</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Поиск по клиенту, номеру или команде..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Экспорт
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-700">Заказ</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Клиент</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Команда</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Сумма</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Статус</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Дата</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-blue-600">{order.id}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{order.customer.teamName}</td>
                  <td className="py-4 px-6 font-semibold">₽{order.total.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <Select 
                      value={order.status} 
                      onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                    >
                      <SelectTrigger className="w-auto">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.filter(s => s.value !== 'all').map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{order.date}</td>
                  <td className="py-4 px-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                          <Eye size={14} className="mr-1" />
                          Подробно
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Детали заказа {order.id}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Информация о клиенте</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Имя:</span> {selectedOrder.customer.name}</div>
                                  <div><span className="font-medium">Email:</span> {selectedOrder.customer.email}</div>
                                  <div><span className="font-medium">Телефон:</span> {selectedOrder.customer.phone}</div>
                                  <div><span className="font-medium">Команда:</span> {selectedOrder.customer.teamName}</div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3">Информация о заказе</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Номер:</span> {selectedOrder.id}</div>
                                  <div><span className="font-medium">Дата:</span> {selectedOrder.date}</div>
                                  <div><span className="font-medium">Статус:</span> 
                                    <Badge className={`ml-1 ${getStatusColor(selectedOrder.status)}`}>
                                      {getStatusText(selectedOrder.status)}
                                    </Badge>
                                  </div>
                                  <div><span className="font-medium">Общая сумма:</span> ₽{selectedOrder.total.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Товары в заказе</h4>
                              <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left py-3 px-4 font-medium">Товар</th>
                                      <th className="text-left py-3 px-4 font-medium">Кол-во</th>
                                      <th className="text-left py-3 px-4 font-medium">Цена</th>
                                      <th className="text-left py-3 px-4 font-medium">Сумма</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedOrder.items.map((item, index) => (
                                      <tr key={index} className="border-t">
                                        <td className="py-3 px-4">{item.name}</td>
                                        <td className="py-3 px-4">{item.quantity}</td>
                                        <td className="py-3 px-4">₽{item.price.toLocaleString()}</td>
                                        <td className="py-3 px-4 font-medium">₽{(item.quantity * item.price).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Описание заказа</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {selectedOrder.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Заказы не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;