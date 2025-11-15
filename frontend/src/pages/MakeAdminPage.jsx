import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MakeAdminPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  const handleMakeAdmin = async () => {
    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const fetchFn = window.__originalFetch || fetch;
      const response = await fetchFn(`${backendUrl}/api/auth/init-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email || '',
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Ошибка');
      }

      setMessage(data.message);
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Не удалось выполнить операцию');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Стать администратором
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Текущий пользователь: {user.email}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
              <p className="text-sm mt-2">Перенаправление в админ-панель...</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите ваш пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите ваш пароль"
              />
            </div>

            <button
              onClick={handleMakeAdmin}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Обработка...' : 'Сделать меня администратором'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Эта функция доступна только для первого администратора
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAdminPage;
