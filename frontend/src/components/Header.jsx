import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ShoppingCart } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      {/* Main header */}
      <div className="container py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={companyInfo.logo} alt="A.V.K. SPORT" className="h-12 w-auto" />
            <div className="hidden md:block">
              <div className="text-2xl font-bold text-dark tracking-tight">A.V.K.</div>
              <div className="text-sm font-bold text-sport-blue tracking-wider">SPORT</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm uppercase tracking-wider transition-colors font-medium ${
                  isActive(item.path)
                    ? 'text-sport-blue border-b-2 border-sport-blue'
                    : 'text-gray-700 hover:text-sport-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Cart */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-sport-blue transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-sport-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                2
              </span>
            </Link>
            <Button asChild className="bg-sport-red hover:bg-sport-orange text-white transition-all duration-300 font-medium shadow-sm">
              <Link to="/order">Сделать заказ</Link>
            </Button>
          </div>

          {/* Mobile cart & menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-sport-blue transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-sport-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                2
              </span>
            </Link>
            <button
              className="p-2 text-dark"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
                  className={`text-sm uppercase tracking-wider py-2 transition-colors font-medium ${
                    isActive(item.path)
                      ? 'text-sport-blue'
                      : 'text-gray-700 hover:text-sport-blue'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-sport-red hover:bg-sport-orange text-white w-full transition-colors">
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