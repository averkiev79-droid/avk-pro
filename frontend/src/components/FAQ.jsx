import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Какой минимальный заказ?',
      answer: 'Минимальная партия заказа составляет 10 штук. Это оптимальное количество для качественного производства с индивидуальным дизайном.'
    },
    {
      question: 'Какие сроки изготовления хоккейной формы?',
      answer: 'Стандартные сроки изготовления - от 14 до 21 рабочего дня с момента утверждения макета. Срочные заказы возможны за дополнительную плату - от 7-10 дней.'
    },
    {
      question: 'Можно ли заказать свой уникальный дизайн?',
      answer: 'Да, мы специализируемся на индивидуальном дизайне. Наши дизайнеры бесплатно разработают макет по вашим пожеланиям. Вы можете предоставить свои эскизы или описать идею, а мы воплотим её в жизнь.'
    },
    {
      question: 'Какие способы нанесения логотипа вы используете?',
      answer: 'Мы предлагаем несколько видов нанесения: сублимационная печать (лучшее качество и долговечность), вышивка (премиум-вариант для логотипов), термотрансфер (экономичный вариант). Выбор зависит от ваших требований и бюджета.'
    },
    {
      question: 'Из каких материалов шьется форма?',
      answer: 'Мы используем только качественные спортивные ткани: дышащий полиэстер с влагоотведением, износостойкий эластан для гамашей, утепленные материалы для курток. Все ткани сертифицированы и безопасны.'
    },
    {
      question: 'Предоставляете ли вы таблицу размеров?',
      answer: 'Да, у нас есть подробные таблицы размеров для детей (110-140 см), подростков (146-170 см) и взрослых. Мы поможем подобрать правильные размеры для всей команды и при необходимости проведем замеры.'
    },
    {
      question: 'Можно ли сделать пробный образец перед основным заказом?',
      answer: 'Да, мы можем изготовить пробный образец в одном размере. Стоимость образца вычитается из суммы основного заказа при его размещении.'
    },
    {
      question: 'Какова стоимость доставки?',
      answer: 'Доставка по Санкт-Петербургу - бесплатно при заказе от 50 000 рублей. Доставка в другие регионы России осуществляется транспортными компаниями, стоимость рассчитывается индивидуально.'
    },
    {
      question: 'Есть ли гарантия на изделия?',
      answer: 'Мы предоставляем гарантию на качество пошива и материалов. При обнаружении производственного брака в течение 30 дней мы бесплатно заменим изделие или устраним дефект.'
    },
    {
      question: 'Можно ли оплатить заказ в рассрочку?',
      answer: 'Да, для постоянных клиентов и крупных заказов возможна рассрочка платежа. Обычно это предоплата 50% и оставшаяся сумма после изготовления перед отправкой.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Часто задаваемые <span className="italic font-serif text-gray-700">вопросы</span>
          </h2>
          <p className="text-lg text-gray-600">Ответы на популярные вопросы о производстве хоккейной формы</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  strokeWidth={2}
                  className={`text-gray-900 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">Не нашли ответ на свой вопрос?</p>
          <a
            href="/contacts"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-md transition-colors font-medium"
          >
            Свяжитесь с нами
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
