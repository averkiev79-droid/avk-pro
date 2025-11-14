import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get session_id from URL fragment (#session_id=xxx)
        const hash = window.location.hash.substring(1); // Remove #
        const params = new URLSearchParams(hash);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('No session ID received');
        }

        // Exchange session_id for user data and session_token
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/oauth/session?session_id=${sessionId}`,
          {
            method: 'POST',
            credentials: 'include' // Important for cookies
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'OAuth authentication failed');
        }

        const data = await response.json();

        if (data.success && data.user) {
          // Note: session_token is set as httpOnly cookie by backend
          // We just need to update the context with user data
          // For compatibility, we'll store a dummy token in localStorage
          localStorage.setItem('token', 'oauth_session');
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Update auth context
          login('oauth_session', data.user);

          // Redirect based on role
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          throw new Error('Invalid response from server');
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, login]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ошибка входа</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Перенаправление на страницу входа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Вход...</h2>
        <p className="text-gray-600">Пожалуйста, подождите</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
