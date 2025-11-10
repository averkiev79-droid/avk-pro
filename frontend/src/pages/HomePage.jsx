import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Zap, Palette, Users, Star } from 'lucide-react';
import { products, advantages, reviews } from '../mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const HomePage = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                Профессиональная <span className="italic font-serif">хоккейная</span> экипировка
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Производим форму для детских и взрослых команд. 
                Индивидуальный дизайн, быстрые сроки, отличное качество.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-4 mb-8 rounded-md max-w-xl mx-auto lg:mx-0">
                <p className="text-sm text-gray-700">
                  Минимальная партия заказа - <span className="font-semibold">от 10 штук</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-7 rounded-md transition-colors font-medium text-base">
                  <Link to="/order">Заказать форму</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 py-7 rounded-md transition-colors font-medium text-base">
                  <Link to="/catalog">Смотреть каталог</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://via.placeholder.com/800x800/1a1a1a/ffffff?text=HOCKEY+TEAM" 
                alt="Хоккейная команда"
                className="rounded-md w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-md shadow-lg border border-gray-200">
                <div className="text-5xl font-bold text-gray-900 mb-1">14+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-medium">лет на рынке</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight">Почему <span className="italic font-serif">выбирают</span> нас</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                    <Icon className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{advantage.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Популярная <span className="italic font-serif">продукция</span></h2>
            <Button asChild variant="ghost" className="text-gray-900 hover:text-gray-600 font-medium transition-all">
              <Link to="/catalog" className="flex items-center gap-2">
                Весь каталог <ArrowRight size={18} strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="overflow-hidden transition-all duration-300 group cursor-pointer">
                  <div className="aspect-square overflow-hidden bg-gray-100 mb-4 rounded-md">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">от {product.basePrice} ₽</span>
                      <span className="text-sm font-medium text-gray-900 group-hover:underline">Подробнее →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight">Отзывы <span className="italic font-serif">наших</span> клиентов</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-md border border-gray-200">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="fill-gray-900 text-gray-900" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  <p className="text-sm text-gray-500 mt-1">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-sport-blue to-blue-700 text-white">
        <div className="container text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Готовы оформить заказ?</h2>
          <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">Свяжитесь с нами для расчета стоимости и обсуждения деталей</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-sport-red hover:bg-sport-orange text-white transition-all duration-300 font-medium shadow-md hover:shadow-lg">
              <Link to="/calculator">Рассчитать стоимость</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sport-blue transition-all duration-300 font-medium">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;