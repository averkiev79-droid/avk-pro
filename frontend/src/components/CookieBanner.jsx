import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Show banner after 1 second
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Text */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 Мы используем cookies
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Этот сайт использует файлы cookie для улучшения вашего опыта. 
              Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
              <Link to="/legal/cookies" className="text-blue-600 hover:underline font-medium">
                политикой использования cookie
              </Link>
              {' '}и{' '}
              <Link to="/legal/privacy" className="text-blue-600 hover:underline font-medium">
                политикой конфиденциальности
              </Link>
              .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={acceptCookies}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Принять
            </button>
            <button
              onClick={declineCookies}
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Отклонить
            </button>
            <button
              onClick={declineCookies}
              className="text-gray-400 hover:text-gray-600 p-3 md:ml-2"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
