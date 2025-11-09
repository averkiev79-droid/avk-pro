import { Card } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const DashboardPage = () => {
  // Mock data
  const stats = [
    { title: 'Всего заказов', value: '127', change: '+12%', icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Продукция', value: '8', change: '+2', icon: Package, color: 'bg-green-500' },
    { title: 'Выручка', value: '₽456,780', change: '+18%', icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Клиенты', value: '89', change: '+7', icon: Users, color: 'bg-orange-500' },
  ];

  const salesData = [
    { month: 'Янв', sales: 65000 },
    { month: 'Фев', sales: 78000 },
    { month: 'Мар', sales: 52000 },
    { month: 'Апр', sales: 91000 },
    { month: 'Май', sales: 68000 },
    { month: 'Июн', sales: 85000 },
  ];

  const categoryData = [
    { name: 'Джерси', value: 45, color: '#2563eb' },
    { name: 'Верхняя одежда', value: 30, color: '#dc2626' },
    { name: 'Аксессуары', value: 15, color: '#ea580c' },
    { name: 'Тренировочная форма', value: 10, color: '#16a34a' },
  ];

  const recentOrders = [
    { id: '#001', customer: 'Юниор СПб', product: 'Хоккейное джерси Pro', amount: '₽17,500', status: 'processing' },
    { id: '#002', customer: 'Ветераны Невы', product: 'Бомбер команды', amount: '₽22,500', status: 'completed' },
    { id: '#003', customer: 'Фан-клуб Зенит', product: 'Куртка-парка', amount: '₽32,500', status: 'pending' },
    { id: '#004', customer: 'Детская школа', product: 'Тренировочная форма', amount: '₽14,000', status: 'completed' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'processing': return 'В работе';
      case 'pending': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-600">Обзор деятельности A.V.K. SPORT</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} за месяц</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Продажи по месяцам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₽${value.toLocaleString()}`, 'Продажи']} />
              <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по категориям</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="flex-1">{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Последние заказы</h3>
          <button className="text-blue-600 text-sm hover:underline">Посмотреть все</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Заказ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Клиент</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Товар</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Сумма</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-600">{order.product}</td>
                  <td className="py-3 px-4 font-semibold">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;