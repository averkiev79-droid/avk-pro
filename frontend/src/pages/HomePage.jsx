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
      <section className="section-padding bg-white">
        <div className="container px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 bg-gradient-to-b from-slate-50 to-white hover:scale-105">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-sport-blue rounded-full mb-4 shadow-sm">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-dark">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{advantage.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-light">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Популярные товары</h2>
            <Button asChild variant="ghost" className="text-sport-blue hover:text-sport-red font-medium hover:bg-blue-50 transition-all">
              <Link to="/catalog" className="flex items-center gap-2">
                Весь каталог <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border border-gray-200 hover:scale-105">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold mb-2 text-dark">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-sport-blue">от {product.basePrice} ₽</span>
                      <Button size="sm" className="bg-sport-red hover:bg-sport-orange text-white transition-all duration-300 font-medium shadow-sm">
                        Смотреть
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-white">
        <div className="container px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Отзывы наших клиентов</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border border-gray-200 bg-slate-50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="fill-sport-orange text-sport-orange" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{review.text}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-dark text-sm">{review.author}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</p>
                </div>
              </Card>
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