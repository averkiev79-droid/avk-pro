import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { products, advantages, reviews } from '../mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const HomePagePremium = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="home-page-premium">
      {/* Full Screen Hero */}
      <section className="relative h-screen flex items-center justify-center bg-dark text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://via.placeholder.com/1920x1080/1A1A2E/D4AF37?text=ELITE+HOCKEY+EQUIPMENT)',
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 tracking-wide">
            Профессиональная
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl italic-accent text-gold mb-8">
            хоккейная экипировка
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Производим форму для детских и взрослых команд с 2010 года.
            Индивидуальный дизайн, безупречное качество.
          </p>
          
          <Link to="/catalog">
            <Button 
              size="lg" 
              className="bg-gold hover:bg-copper text-dark font-light tracking-wider uppercase px-12 py-6 text-sm transition-all duration-500"
            >
              Исследовать коллекцию
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-gold" size={32} />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
                История <span className="italic-accent text-gold">мастерства</span> и <span className="italic-accent text-gold">традиций</span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed font-light text-lg">
                <p>
                  С 2010 года мы создаем хоккейную экипировку, которая объединяет традиционное 
                  мастерство и современные технологии. Каждое изделие - результат многолетнего 
                  опыта и внимания к деталям.
                </p>
                <p>
                  Наша философия проста: качество превыше всего. Мы работаем только с 
                  проверенными материалами и используем передовые методы производства, 
                  чтобы каждая команда чувствовала себя победителем.
                </p>
              </div>
              <div className="mt-10">
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    className="border-2 border-dark text-dark hover:bg-dark hover:text-white font-light tracking-wider uppercase transition-all duration-300"
                  >
                    Узнать больше
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-200 rounded-sm overflow-hidden">
                <img 
                  src="https://via.placeholder.com/800x1000/1A1A2E/D4AF37?text=CRAFTSMANSHIP"
                  alt="Мастерство"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gold text-dark p-8 shadow-2xl">
                <div className="text-5xl font-light mb-2">14+</div>
                <div className="text-sm uppercase tracking-widest font-light">лет опыта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-dark text-white">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Наша <span className="italic-accent text-gold">коллекция</span>
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Тщательно отобранные изделия для профессиональных команд
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <Card className="overflow-hidden bg-transparent border-none relative aspect-[3/4]">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h3 className="text-2xl font-light mb-2 text-white group-hover:text-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm font-light mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold text-xl font-light">от {product.basePrice} ₽</span>
                      <ArrowRight className="text-gold group-hover:translate-x-2 transition-transform duration-300" size={20} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/catalog">
              <Button 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold hover:text-dark font-light tracking-wider uppercase px-12 py-6 transition-all duration-300"
              >
                Смотреть всю коллекцию
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Наши <span className="italic-accent text-gold">ценности</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-1 h-16 bg-gold mx-auto mb-6" />
                <h3 className="text-2xl font-light mb-4">{advantage.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Слово наших <span className="italic-accent text-gold">клиентов</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-8 border-none shadow-sm bg-white">
                <div className="text-6xl text-gold mb-4 font-serif">"</div>
                <p className="text-gray-600 italic mb-6 font-light leading-relaxed">
                  {review.text}
                </p>
                <div className="border-t pt-4">
                  <p className="font-medium text-dark">{review.author}</p>
                  <p className="text-sm text-gray-500 font-light">{review.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-dark text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://via.placeholder.com/1920x600/1A1A2E/D4AF37?text=CONTACT+US)',
          }}
        />
        
        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Готовы начать <span className="italic-accent text-gold">сотрудничество?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
              Свяжитесь с нами для индивидуальной консультации
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="bg-gold hover:bg-copper text-dark font-light tracking-wider uppercase px-12 py-6 transition-all duration-300"
                >
                  Сделать заказ
                </Button>
              </Link>
              <Link to="/contacts">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-dark font-light tracking-wider uppercase px-12 py-6 transition-all duration-300"
                >
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePagePremium;
