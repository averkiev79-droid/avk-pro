import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Zap, Palette, Users, Star } from 'lucide-react';
import { products, advantages, reviews } from '../mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useParallax } from '../hooks/useParallax';

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`scroll-animate ${isVisible ? 'visible fade-in-up' : ''} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const ParallaxImage = ({ src, alt, className = '', speed = 0.3 }) => {
  const [ref, offset] = useParallax(speed);
  
  return (
    <div ref={ref} className="overflow-hidden rounded-md">
      <img 
        src={src}
        alt={alt}
        className={className}
        style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
};

const HomePage = () => {
  const featuredProducts = products.slice(0, 4);
  const [hockeyClubs, setHockeyClubs] = React.useState([]);
  const [heroImage, setHeroImage] = React.useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1a1a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='800' fill='url(%23grad)'/%3E%3Ccircle cx='400' cy='400' r='150' fill='none' stroke='white' stroke-width='3' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='white' text-anchor='middle' dy='.3em' font-family='Arial' font-weight='bold'%3EA.V.K.%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='24' fill='white' text-anchor='middle' dy='.3em' font-family='Arial'%3ESPORT%3C/text%3E%3C/svg%3E");
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hockey clubs
        const clubsResponse = await fetch(`${backendUrl}/api/hockey-clubs`);
        const clubsData = await clubsResponse.json();
        setHockeyClubs(clubsData);

        // Fetch site settings for hero image
        const settingsResponse = await fetch(`${backendUrl}/api/site-settings`);
        const settingsData = await settingsResponse.json();
        const heroSetting = settingsData.find(s => s.key === 'hero_image');
        if (heroSetting && heroSetting.value) {
          setHeroImage(heroSetting.value);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [backendUrl]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection className="text-center lg:text-left">
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
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="relative">
              <div className="relative">
                <ParallaxImage
                  src={heroImage} 
                  alt="Хоккейная команда"
                  className="w-full h-auto rounded-md"
                  speed={0.3}
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="text-5xl font-bold text-gray-900 mb-1">14+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider font-medium">лет на рынке</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Hockey Clubs Carousel Section */}
      {hockeyClubs.length > 0 && (
        <section className="py-20 bg-white border-y border-gray-100 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 mb-12">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-tight">
                Работаем с <span className="italic font-serif">известными</span> клубами
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto">
                Доверие профессиональных команд — наша лучшая рекомендация
              </p>
            </AnimatedSection>
          </div>
          
          <div className="relative">
            <div className="flex animate-scroll">
              {/* First set of clubs */}
              <div className="flex items-center gap-6 px-3 flex-shrink-0">
                {hockeyClubs.map((club) => (
                  <div key={club.id} className="w-48 h-48 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    {club.logo_url ? (
                      <img 
                        src={club.logo_url} 
                        alt={club.name} 
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out" 
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{club.name}</div>
                        <div className="text-sm text-gray-600">{club.subtitle}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-6 px-3 flex-shrink-0">
                {hockeyClubs.map((club) => (
                  <div key={`${club.id}-duplicate`} className="w-48 h-48 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    {club.logo_url ? (
                      <img 
                        src={club.logo_url} 
                        alt={club.name} 
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out" 
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{club.name}</div>
                        <div className="text-sm text-gray-600">{club.subtitle}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Advantages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight">Почему <span className="italic font-serif">выбирают</span> нас</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <AnimatedSection key={index} delay={index * 0.1} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                    <Icon className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{advantage.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Популярная <span className="italic font-serif">продукция</span></h2>
              <Button asChild variant="ghost" className="text-gray-900 hover:text-gray-600 font-medium transition-all">
                <Link to="/catalog" className="flex items-center gap-2">
                  Весь каталог <ArrowRight size={18} strokeWidth={1.5} />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <Link to={`/product/${product.id}`}>
                  <div className="transition-all duration-300 group cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-gray-100 mb-4 rounded-md">
                      <ParallaxImage
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        speed={0.2}
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Yandex Style Carousel */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 mb-12">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 tracking-tight">
              Отзывы <span className="italic font-serif">наших</span> клиентов
            </h2>
            <p className="text-center text-gray-600">Реальные отзывы с Яндекс.Карт</p>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          {/* First row - moving left to right */}
          <div className="relative">
            <div className="flex animate-scroll">
              <div className="flex items-center gap-4 px-2 flex-shrink-0">
                {reviews.slice(0, 5).map((review) => (
                  <div 
                    key={review.id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    style={{ 
                      minWidth: review.text.length < 50 ? '280px' : review.text.length < 100 ? '350px' : '420px',
                      maxWidth: '420px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Яндекс</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                        <p className="text-xs text-gray-500">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-4 px-2 flex-shrink-0">
                {reviews.slice(0, 5).map((review) => (
                  <div 
                    key={`${review.id}-dup1`}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    style={{ 
                      minWidth: review.text.length < 50 ? '280px' : review.text.length < 100 ? '350px' : '420px',
                      maxWidth: '420px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Яндекс</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                        <p className="text-xs text-gray-500">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second row - moving right to left */}
          <div className="relative">
            <div className="flex animate-scroll-reverse">
              <div className="flex items-center gap-4 px-2 flex-shrink-0">
                {reviews.slice(5, 10).map((review) => (
                  <div 
                    key={review.id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    style={{ 
                      minWidth: review.text.length < 50 ? '280px' : review.text.length < 100 ? '350px' : '420px',
                      maxWidth: '420px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Яндекс</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                        <p className="text-xs text-gray-500">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-4 px-2 flex-shrink-0">
                {reviews.slice(5, 10).map((review) => (
                  <div 
                    key={`${review.id}-dup2`}
                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    style={{ 
                      minWidth: review.text.length < 50 ? '280px' : review.text.length < 100 ? '350px' : '420px',
                      maxWidth: '420px'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="fill-yellow-400 text-yellow-400" size={14} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">Яндекс</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                        <p className="text-xs text-gray-500">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-white">
              Готовы <span className="italic font-serif text-gray-300">оформить</span> заказ?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">Свяжитесь с нами для расчета стоимости и обсуждения деталей</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-7 rounded-md transition-colors font-medium text-base shadow-lg">
                <Link to="/calculator">Рассчитать стоимость</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-7 rounded-md transition-colors font-medium text-base">
                <Link to="/contacts">Связаться с нами</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;