import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { companyInfo } from '../mock';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Калькулятор', path: '/calculator' },
    { name: 'Заказать', path: '/order' },
    { name: 'Портфолио', path: '/portfolio' },
    { name: 'О компании', path: '/about' },
    { name: 'Контакты', path: '/contacts' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-chocolate text-white py-2">
        <div className="container">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 hover:text-sage transition-colors">
                <Phone size={16} />
                <span>{companyInfo.phone}</span>
              </a>
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 hover:text-sage transition-colors hidden md:flex">
                <Mail size={16} />
                <span>{companyInfo.email}</span>
              </a>
            </div>
            <div className="text-sm">{companyInfo.workHours}</div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={companyInfo.logo} alt="АВК" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'text-sage font-medium border-b-2 border-sage'
                    : 'text-gray-700 hover:text-sage'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-sage hover:bg-chocolate text-white transition-colors">
              <Link to="/order">Сделать заказ</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-chocolate"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider py-2 transition-colors ${
                    isActive(item.path)
                      ? 'text-sage font-medium'
                      : 'text-gray-700 hover:text-sage'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-sage hover:bg-chocolate text-white w-full transition-colors">
                <Link to="/order" onClick={() => setIsMenuOpen(false)}>Сделать заказ</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;