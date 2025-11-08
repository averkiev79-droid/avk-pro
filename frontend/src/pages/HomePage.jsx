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
      <section className="relative bg-gradient-to-br from-cream via-soft-gray to-taupe py-24 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl lg:text-6xl font-light mb-6 leading-tight">
                Профессиональная<br />
                <span className="text-sage">хоккейная экипировка</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Производим форму для детских и взрослых команд, родителей и болельщиков. 
                Индивидуальный дизайн, быстрые сроки, отличное качество.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-sage hover:bg-chocolate text-white transition-colors">
                  <Link to="/order">Сделать заказ</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-chocolate text-chocolate hover:bg-chocolate hover:text-white transition-colors">
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
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
                  <div className="text-4xl font-light text-sage mb-1">14+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">лет на рынке</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="text-4xl font-light text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow border-none bg-soft-gray">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sage rounded-full mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-light mb-2">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm">{advantage.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-soft-gray">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-light">Популярные товары</h2>
            <Button asChild variant="ghost" className="text-sage hover:text-chocolate">
              <Link to="/catalog" className="flex items-center gap-2">
                Весь каталог <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer border-none">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-light mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-light text-sage">от {product.basePrice} ₽</span>
                    <Button size="sm" className="bg-sage hover:bg-chocolate text-white transition-colors">
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
          <h2 className="text-4xl font-light text-center mb-12">Отзывы наших клиентов</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-none bg-soft-gray">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="fill-sage text-sage" size={18} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-sm leading-relaxed">"{review.text}"</p>
                <div className="border-t border-gray-300 pt-4">
                  <p className="font-medium text-chocolate">{review.author}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-chocolate text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-light mb-4">Готовы оформить заказ?</h2>
          <p className="text-lg mb-8 opacity-90">Свяжитесь с нами для расчета стоимости и обсуждения деталей</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-sage hover:bg-white hover:text-chocolate text-white transition-colors">
              <Link to="/calculator">Рассчитать стоимость</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-chocolate transition-colors">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;