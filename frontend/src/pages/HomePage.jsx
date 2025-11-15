import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Factory, Zap, Palette, Users, Star } from 'lucide-react';
import { products, advantages, reviews } from '../mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useParallax } from '../hooks/useParallax';
import FAQ from '../components/FAQ';

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
        loading="lazy"
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
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [hockeyClubs, setHockeyClubs] = React.useState([]);
  const [heroImage, setHeroImage] = React.useState("/images/hockey-hero.jpg");
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${backendUrl}/api/products?is_active=true`);
        const productsData = await productsResponse.json();
        setFeaturedProducts(productsData.slice(0, 4));

        // Fetch hockey clubs
        const clubsResponse = await fetch(`${backendUrl}/api/hockey-clubs`);
        const clubsData = await clubsResponse.json();
        setHockeyClubs(clubsData);

        // Fetch site settings for hero image
        const settingsResponse = await fetch(`${backendUrl}/api/site-settings`);
        const settingsData = await settingsResponse.json();
        const heroSetting = settingsData.find(s => s.key === 'hero_image');
        // Only use API image if it's a local path (starts with /), otherwise keep local default
        if (heroSetting && heroSetting.value && heroSetting.value.startsWith('/')) {
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
      {/* Hero Section - Full Width with Background */}
      <section className="relative bg-gray-900 min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Hockey background"
            className="w-full h-full object-cover"
            onLoad={() => console.log('✅ Hero background loaded')}
            onError={(e) => {
              console.error('❌ Hero background failed');
              e.target.style.display = 'none';
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Overlay Content */}
        <div className="container max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">14+ лет на рынке</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white leading-tight">
              Профессиональная{' '}
              <span className="italic font-serif text-blue-400">хоккейная</span>{' '}
              экипировка
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Производим форму для детских и взрослых команд. 
              Индивидуальный дизайн, быстрые сроки, отличное качество.
            </p>

            {/* Info Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-5 mb-10 max-w-xl">
              <p className="text-white text-base">
                💪 Минимальная партия заказа - <span className="font-bold">от 10 штук</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/order">
                <button className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto text-lg">
                  Заказать форму
                </button>
              </Link>
              <Link to="/catalog">
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-lg font-semibold transition-all w-full sm:w-auto text-lg">
                  Смотреть каталог
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Hockey Clubs Carousel Section */}
      {hockeyClubs.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-gray-100 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 mb-8 sm:mb-12">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 tracking-tight">
                Работаем с <span className="italic font-serif">известными</span> клубами
              </h2>
              <p className="text-sm sm:text-base text-center text-gray-600 max-w-2xl mx-auto">
                Доверие профессиональных команд — наша лучшая рекомендация
              </p>
            </AnimatedSection>
          </div>
          
          <div className="relative overflow-hidden carousel-container">
            <div className="flex animate-scroll-carousel" style={{ minWidth: 'max-content' }}>
              {/* First set of clubs */}
              <div className="flex items-center gap-6 px-3 flex-shrink-0">
                {hockeyClubs.map((club) => (
                  <div key={club.id} className="w-48 h-48 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 group touch-manipulation">
                    {club.logo_url ? (
                      <img 
                        src={club.logo_url} 
                        alt={club.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out pointer-events-none" 
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
              
              {/* Duplicate set for seamless loop - only on desktop */}
              <div className="hidden md:flex items-center gap-6 px-3 flex-shrink-0">
                {hockeyClubs.map((club) => (
                  <div key={`${club.id}-duplicate`} className="w-48 h-48 bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 group">
                    {club.logo_url ? (
                      <img 
                        src={club.logo_url} 
                        alt={club.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out pointer-events-none" 
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
                        src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        speed={0.2}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">от {product.base_price} ₽</span>
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

      {/* SEO Text Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto px-4">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Производство хоккейной формы на заказ в Санкт-Петербурге</h2>
              <div className="grid md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Профессиональная хоккейная экипировка</h3>
                  <p className="mb-4">
                    <strong>A.V.K. SPORT</strong> - ваш надежный партнер в производстве хоккейной формы любой сложности. 
                    Мы специализируемся на пошиве качественной спортивной экипировки для хоккейных команд, клубов и 
                    болельщиков. Более 14 лет успешной работы на рынке Санкт-Петербурга и Ленинградской области.
                  </p>
                  <p>
                    Наше производство оснащено современным оборудованием для сублимационной печати, вышивки и 
                    термотрансфера. Мы работаем с командами всех уровней - от детских хоккейных школ до 
                    профессиональных клубов.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Широкий ассортимент продукции</h3>
                  <p className="mb-4">
                    В нашем каталоге представлена полная линейка хоккейной экипировки: джерси (свитеры), 
                    гамаши (рейтузы), тренировочные костюмы, куртки, бомберы, жилетки и аксессуары. 
                    Минимальная партия заказа - от 10 штук, что делает нас доступными для команд любого размера.
                  </p>
                  <p>
                    Используем только качественные износостойкие ткани, устойчивые к интенсивным тренировкам 
                    и частым стиркам. Все изделия проходят контроль качества перед отправкой клиенту. 
                    Гарантируем соответствие размеров и яркость печати на протяжении всего срока эксплуатации.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Почему выбирают A.V.K. SPORT?</h3>
                <ul className="grid md:grid-cols-3 gap-4 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Быстрые сроки:</strong> изготовление от 14 дней</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Любой дизайн:</strong> воплотим вашу идею в реальность</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Качественные материалы:</strong> дышащие ткани, прочные швы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Собственное производство:</strong> контроль на всех этапах</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Гибкие цены:</strong> скидки для постоянных клиентов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 font-bold">✓</span>
                    <span><strong>Бесплатный дизайн:</strong> разработка макета в подарок</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🏒 Для кого мы шьем форму?</h3>
                <p className="text-gray-700">
                  Детские хоккейные команды (рост 110-140 см) • Подростковые команды (рост 146-170 см) • 
                  Взрослые любительские клубы • Профессиональные хоккейные команды • Родительские клубы • 
                  Фан-клубы и группы поддержки • Хоккейные школы и академии
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

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