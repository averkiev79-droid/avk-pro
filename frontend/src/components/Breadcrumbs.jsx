import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbs } from '../context/BreadcrumbsContext';

const Breadcrumbs = () => {
  const location = useLocation();
  const { customBreadcrumbs } = useBreadcrumbs();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNames = {
    catalog: 'Каталог',
    calculator: 'Калькулятор',
    portfolio: 'Портфолио',
    about: 'О компании',
    contacts: 'Контакты',
    order: 'Заказать форму',
    cart: 'Корзина',
    checkout: 'Оформление заказа',
    blog: 'Блог',
    product: 'Товар',
    legal: 'Юридическая информация'
  };

  // Don't show breadcrumbs on homepage
  if (pathnames.length === 0) return null;

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3">
      <div className="container max-w-7xl mx-auto px-4">
        <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              itemProp="item"
            >
              <Home size={16} strokeWidth={1.5} />
              <span className="ml-1" itemProp="name">Главная</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            // Check custom breadcrumbs first, then dictionary, then value
            const name = customBreadcrumbs[to] || breadcrumbNames[value] || value;

            return (
              <li
                key={to}
                className="flex items-center gap-2"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <ChevronRight size={16} className="text-gray-400" strokeWidth={1.5} />
                {isLast ? (
                  <span className="text-gray-900 font-medium" itemProp="name">
                    {name}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{name}</span>
                  </Link>
                )}
                <meta itemProp="position" content={index + 2} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
