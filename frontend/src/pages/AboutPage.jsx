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

  return (
    <div className="about-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-sport-red text-white py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">О компании</h1>
          <p className="text-base sm:text-lg opacity-90">Профессиональное производство хоккейной экипировки</p>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        {/* О компании */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://via.placeholder.com/800x600/2d3748/ffffff?text=PRODUCTION+FACILITY"
                alt="Производство"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-light mb-6">Компания {companyInfo.name}</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Компания <strong className="text-sport-blue">{companyInfo.name}</strong> более 14 лет занимается производством хоккейной формы и экипировки. Мы специализируемся на изготовлении качественной продукции для детских и взрослых хоккейных команд.
                </p>
                <p>
                  Наше производство оснащено современным оборудованием, что позволяет нам выполнять заказы любой сложности. Мы используем только качественные материалы и проверенные технологии печати.
                </p>
                <p>
                  Мы работаем с командами всех уровней - от детских ДЮСШ до любительских команд и фан-клубов. Каждый заказ выполняется с максимальным вниманием к деталям.
                </p>
                <div className="bg-blue-50 border-l-4 border-sport-blue p-4 rounded mt-6">
                  <p className="text-sm font-medium text-gray-700">
                    ℹ️ {companyInfo.minOrder}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Статистика */}
        <section className="mb-16 bg-white rounded-lg shadow-sm p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-sport-blue mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Преимущества */}
        <section>
          <h2 className="text-4xl font-light text-center mb-12">Наши преимущества</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon === 'Factory' ? Factory : 
                          advantage.icon === 'Zap' ? Zap :
                          advantage.icon === 'Palette' ? Palette : Users;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow border-none bg-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-blue rounded-full mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-light mb-2">{advantage.title}</h3>
                  <p className="text-gray-600 text-sm">{advantage.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Наш подход */}
        <section className="mt-16">
          <h2 className="text-4xl font-light text-center mb-12">Наш подход</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-none bg-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-red rounded-full mb-4">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-light mb-3">Качество</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Используем только проверенные материалы и современные технологии печати для долговечности изделий.
              </p>
            </Card>
            <Card className="p-6 border-none bg-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-red rounded-full mb-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-light mb-3">Индивидуальность</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Каждый заказ уникален. Разрабатываем дизайн с учетом всех пожеланий клиента.
              </p>
            </Card>
            <Card className="p-6 border-none bg-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-red rounded-full mb-4">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-light mb-3">Скорость</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Собственное производство позволяет выполнять заказы в кратчайшие сроки.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;