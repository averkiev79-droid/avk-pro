import { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const roleLabels = {
    admin: 'Администратор',
    employee: 'Контент-менеджер',
    customer: 'Клиент'
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    employee: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800'
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/role?role=${newRole}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update role');
      }

      toast.success('Роль успешно обновлена');
      
      // Update local state
      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Ошибка обновления роли');
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${userEmail}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete user');
      }

      toast.success('Пользователь удален');
      
      // Remove from local state
      setUsers(users.filter(user => user.user_id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Ошибка удаления пользователя');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Пользователи</h1>
        <p className="text-gray-600">Управление пользователями и их ролями</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users size={24} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Всего пользователей</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Администраторы</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Контент-менеджеры</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'employee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.phone || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      className={`text-sm px-3 py-1 rounded-full font-medium ${roleColors[user.role]} border-0 focus:ring-2 focus:ring-gray-900`}
                    >
                      <option value="customer">{roleLabels.customer}</option>
                      <option value="employee">{roleLabels.employee}</option>
                      <option value="admin">{roleLabels.admin}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.user_id, user.email)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Удалить пользователя"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Пользователи не найдены
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
