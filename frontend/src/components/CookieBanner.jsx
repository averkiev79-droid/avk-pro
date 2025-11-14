import React, { useState, useEffect } from 'react';
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
          {/* Icon + Text */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Cookie Icon */}
            <div className="flex-shrink-0 mt-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#1a365d" fillOpacity="0.1"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-.37 4.4-1.96 5.46-4.09.2-.41.66-.59 1.09-.44.39.13.65.48.65.89 0 .5.4.9.9.9.5 0 .9-.4.9-.9 0-.43.3-.81.73-.9.43-.08.87.13 1.09.54 1.01 1.86 2.74 3.16 4.77 3.52.03.28.05.56.05.84 0 4.41-3.59 8-8 8z" fill="#1a365d"/>
                <circle cx="8" cy="12" r="1.5" fill="#1a365d"/>
                <circle cx="12" cy="16" r="1" fill="#1a365d"/>
                <circle cx="15" cy="12" r="1" fill="#1a365d"/>
              </svg>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Мы используем файлы cookie
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Мы используем файлы cookie для улучшения работы сайта, анализа трафика и персонализации контента. 
                Продолжая использовать наш сайт, вы соглашаетесь с использованием файлов cookie.{' '}
                <Link to="/legal/cookies" className="text-blue-700 hover:underline font-medium">
                  Подробнее
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              Отключить
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors whitespace-nowrap"
            >
              Принять все
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
