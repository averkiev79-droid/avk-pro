import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, UserPlus, Mail, Phone, Calendar } from 'lucide-react';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      role: 'client',
      teamName: 'Юниор СПб',
      ordersCount: 3,
      totalSpent: 52000,
      lastOrder: '2024-11-08',
      status: 'active'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      email: 'maria@example.com',
      phone: '+7 (999) 234-56-78',
      role: 'client',
      teamName: 'Ветераны Невы',
      ordersCount: 1,
      totalSpent: 45000,
      lastOrder: '2024-11-07',
      status: 'active'
    },
    {
      id: 3,
      name: 'Алексей Козлов',
      email: 'alex@example.com',
      phone: '+7 (999) 345-67-89',
      role: 'client',
      teamName: 'Фан-клуб Зенит',
      ordersCount: 2,
      totalSpent: 180000,
      lastOrder: '2024-11-09',
      status: 'active'
    },
    {
      id: 4,
      name: 'Ольга Новикова',
      email: 'olga@example.com',
      phone: '+7 (999) 456-78-90',
      role: 'client',
      teamName: 'Детская школа',
      ordersCount: 5,
      totalSpent: 89000,
      lastOrder: '2024-10-15',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'Администратор',
      email: 'admin@avk-hockey.ru',
      phone: '+7 (812) 648-17-49',
      role: 'admin',
      teamName: '-',
      ordersCount: 0,
      totalSpent: 0,
      lastOrder: '-',
      status: 'active'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'client': return 'Клиент';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      default: return status;
    }
  };

  const stats = [
    { label: 'Всего пользователей', value: users.length, color: 'text-blue-600' },
    { label: 'Активные клиенты', value: users.filter(u => u.status === 'active' && u.role === 'client').length, color: 'text-green-600' },
    { label: 'Общая выручка', value: `₽${users.reduce((sum, user) => sum + user.totalSpent, 0).toLocaleString()}`, color: 'text-purple-600' },
    { label: 'Средний чек', value: `₽${Math.round(users.reduce((sum, user) => sum + user.totalSpent, 0) / users.filter(u => u.role === 'client').length).toLocaleString()}`, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
        <p className="text-gray-600">Просматривайте информацию о клиентах и администраторах</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Search and Actions */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Поиск по имени, email или команде..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button className="bg-sport-blue hover:bg-sport-red ml-4">
            <UserPlus size={16} className="mr-2" />
            Добавить пользователя
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-700">Пользователь</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Контакты</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Команда</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Роль</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Статус</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Заказы</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Выручка</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{user.teamName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="font-medium">{user.ordersCount} заказов</div>
                      {user.lastOrder !== '-' && (
                        <div className="text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {user.lastOrder}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold">
                      {user.totalSpent > 0 ? `₽${user.totalSpent.toLocaleString()}` : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Пользователи не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;