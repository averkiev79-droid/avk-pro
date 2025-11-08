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
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-24 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Профессиональная<br />
                <span className="text-sport-blue">хоккейная экипировка</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Производим форму для детских и взрослых команд, родителей и болельщиков. 
                Индивидуальный дизайн, быстрые сроки, отличное качество.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-sport-red hover:bg-sport-orange text-white transition-colors font-medium">
                  <Link to="/order">Сделать заказ</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-blue hover:text-white transition-colors font-medium">
                  <Link to="/catalog">Смотреть каталог</Link>
                </Button>
              </div>
            </div>
            <div className="slide-in-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1670509162391-1c16e6d0bb83" 
                  alt="Хоккейная команда"
                  className="rounded-lg shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border-t-4 border-sport-blue">
                  <div className="text-4xl font-bold text-sport-blue mb-1">14+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider font-medium">лет на рынке</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-all border-none bg-gradient-to-b from-blue-50 to-white hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-blue rounded-full mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-dark">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm">{advantage.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Популярные товары</h2>
            <Button asChild variant="ghost" className="text-sport-blue hover:text-sport-red font-medium">
              <Link to="/catalog" className="flex items-center gap-2">
                Весь каталог <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all group cursor-pointer border-none hover:scale-105">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-sport-blue">от {product.basePrice} ₽</span>
                    <Button size="sm" className="bg-sport-red hover:bg-sport-orange text-white transition-colors font-medium">
                      Заказать
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Отзывы наших клиентов</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-none bg-light hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="fill-sport-orange text-sport-orange" size={18} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{review.text}"</p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-bold text-dark">{review.author}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-sport-blue to-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Готовы оформить заказ?</h2>
          <p className="text-lg mb-8 opacity-90">Свяжитесь с нами для расчета стоимости и обсуждения деталей</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-sport-red hover:bg-sport-orange text-white transition-colors font-medium">
              <Link to="/calculator">Рассчитать стоимость</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sport-blue transition-colors font-medium">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;