import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { companyInfo } from '../mock';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto border-t border-gold/20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={companyInfo.logo} alt="A.V.K. SPORT" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Профессиональное производство хоккейной формы и экипировки для команд любого уровня
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-sm font-light mb-6 text-gold uppercase tracking-widest">Навигация</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/catalog" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">Каталог</Link>
              <Link to="/calculator" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">Калькулятор</Link>
              <Link to="/order" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">Заказать</Link>
              <Link to="/portfolio" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">Портфолио</Link>
              <Link to="/about" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">О компании</Link>
              <Link to="/contacts" className="text-gray-400 hover:text-gold text-sm transition-colors font-light">Контакты</Link>
            </nav>
          </div>

          {/* Категории товаров */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-sport-blue">Продукция</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li>Хоккейные джерси</li>
              <li>Гамаши</li>
              <li>Форма для зала</li>
              <li>Чехлы для шорт</li>
              <li>Бомберы и куртки</li>
              <li>Жилетки</li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-sport-blue">Контакты</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href={`tel:${companyInfo.phone}`} className="flex items-start gap-2 hover:text-sport-blue transition-colors">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span>{companyInfo.phone}</span>
              </a>
              <a href={`mailto:${companyInfo.email}`} className="flex items-start gap-2 hover:text-sport-blue transition-colors">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span>{companyInfo.email}</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="mt-1 flex-shrink-0" />
                <span>{companyInfo.workHours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2024 A.V.K. SPORT. Все права защищены.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/privacy" className="hover:text-sport-blue transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:text-sport-blue transition-colors">
                Пользовательское соглашение
              </Link>
              <Link to="/requisites" className="hover:text-sport-blue transition-colors">
                Реквизиты
              </Link>
              <Link to="/cookies" className="hover:text-sport-blue transition-colors">
                Информация о куках
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;