import { useEffect } from 'react';
import { companyInfo, advantages } from '../mock';
import { Card } from '../components/ui/card';
import { Factory, Zap, Palette, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '14+', label: 'лет на рынке' },
    { value: '500+', label: 'довольных клиентов' },
    { value: '2000+', label: 'выполненных заказов' },
    { value: '14 дней', label: 'средний срок' }
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="about-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            О <span className="italic font-serif text-gray-700">компании</span>
          </h1>
          <p className="text-lg text-gray-600">Профессиональное производство хоккейной экипировки</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto py-20 px-4">
        {/* О компании */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://via.placeholder.com/800x800/1a1a1a/ffffff?text=PRODUCTION+FACILITY"
                alt="Производство"
                className="rounded-md w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Компания <span className="italic font-serif">{companyInfo.name}</span></h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                <p>
                  Компания <span className="font-semibold text-gray-900">{companyInfo.name}</span> более 14 лет занимается производством хоккейной формы и экипировки. Мы специализируемся на изготовлении качественной продукции для детских и взрослых хоккейных команд.
                </p>
                <p>
                  Наше производство оснащено современным оборудованием, что позволяет нам выполнять заказы любой сложности. Мы используем только качественные материалы и проверенные технологии печати.
                </p>
                <p>
                  Мы работаем с командами всех уровней - от детских ДЮСШ до любительских команд и фан-клубов. Каждый заказ выполняется с максимальным вниманием к деталям.
                </p>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-6">
                  <p className="text-sm text-gray-700">
                    {companyInfo.minOrder}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Статистика */}
        <section className="mb-20 bg-gray-50 rounded-md p-12 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Преимущества */}
        <section className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-tight">Наши <span className="italic font-serif">преимущества</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
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
        </section>

        {/* Наш подход */}
        <section className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-tight">Наш <span className="italic font-serif">подход</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                <Award className="text-white" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Качество</h3>
              <p className="text-gray-600 leading-relaxed">
                Используем только проверенные материалы и современные технологии печати для долговечности изделий.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                <TrendingUp className="text-white" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Индивидуальность</h3>
              <p className="text-gray-600 leading-relaxed">
                Каждый заказ уникален. Разрабатываем дизайн с учетом всех пожеланий клиента.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
                <Zap className="text-white" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Скорость</h3>
              <p className="text-gray-600 leading-relaxed">
                Собственное производство позволяет выполнять заказы в кратчайшие сроки.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;