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
    { name: 'Портфолио', path: '/portfolio' },
    { name: 'О компании', path: '/about' },
    { name: 'Контакты', path: '/contacts' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Main header */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={companyInfo.logo} alt="A.V.K. SPORT" className="h-12 w-auto" />
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none">A.V.K.</div>
              <div className="text-sm font-semibold text-gray-900 tracking-widest uppercase">SPORT</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(item.path)
                    ? 'text-gray-900 after:absolute after:bottom-[-24px] after:left-0 after:right-0 after:h-[2px] after:bg-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart & CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative text-gray-900 hover:text-gray-600 transition-colors">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                2
              </span>
            </Link>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-5 rounded-md transition-colors font-medium">
              <Link to="/order">Заказать</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-900">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                2
              </span>
            </Link>
            <button
              className="text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 py-6">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 text-sm font-medium transition-colors rounded-md ${
                    isActive(item.path)
                      ? 'text-gray-900 bg-gray-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white w-full mt-4 py-6">
                <Link to="/order" onClick={() => setIsMenuOpen(false)}>Заказать</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;