import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Алексей Морозов',
      role: 'Тренер ХК "Юниор СПб"',
      rating: 5,
      text: 'Заказывали полный комплект формы для детской команды - 25 джерси и гамашей. Качество превзошло ожидания! Дети в восторге от яркого дизайна, родители довольны прочностью. После 6 месяцев интенсивных тренировок и игр форма выглядит как новая. Сроки соблюдены, цена адекватная. Однозначно рекомендую!',
      image: 'АМ'
    },
    {
      id: 2,
      name: 'Дмитрий Волков',
      role: 'Капитан команды "Ветераны Невы"',
      rating: 5,
      text: 'Сотрудничаем с A.V.K. SPORT уже 3 года. За это время заказывали игровую форму, тренировочные костюмы и куртки для всей команды. Особенно нравится, что можем воплотить любые идеи дизайна. Менеджеры всегда на связи, помогают с выбором материалов. Доставка всегда вовремя. Спасибо за профессионализм!',
      image: 'ДВ'
    },
    {
      id: 3,
      name: 'Ирина Соколова',
      role: 'Президент родительского клуба',
      rating: 5,
      text: 'Заказывали единую форму для родителей нашей хоккейной школы - 40 толстовок с логотипом. Очень довольны результатом! Качество печати отличное, цвета яркие и насыщенные. Все родители в восторге. Отдельное спасибо за индивидуальный подход и бесплатную разработку дизайна. Будем обращаться еще!',
      image: 'ИС'
    },
    {
      id: 4,
      name: 'Сергей Петров',
      role: 'Директор ХК "Стрельна"',
      rating: 5,
      text: 'Работаем с A.V.K. SPORT с момента основания клуба. Заказывали форму для трех возрастных групп - более 80 комплектов. Ребята справились на ура! Качество на высоте, сроки четкие, цены справедливые. Особенно ценим, что можем заказать дополнительные комплекты в любой момент. Надежный партнер для любого клуба!',
      image: 'СП'
    },
    {
      id: 5,
      name: 'Андрей Козлов',
      role: 'Руководитель фан-клуба "Зенит"',
      rating: 5,
      text: 'Заказывали фирменную одежду для нашей группы поддержки - бомберы, шарфы, жилетки. Более 50 человек. Все довольны качеством и дизайном! Печать четкая, материалы приятные к телу. Менеджеры помогли с выбором и разработали крутой макет. Получили заказ точно в срок перед началом сезона. Рекомендуем всем!',
      image: 'АК'
    },
    {
      id: 6,
      name: 'Михаил Лебедев',
      role: 'Тренер команды "Красные Тигры"',
      rating: 5,
      text: 'Первый раз заказывали форму на стороне, до этого всегда шили сами. Результат порадовал! Качество материалов отличное, швы прочные, дизайн воплотили точь-в-точь как мы хотели. Сублимация яркая, не бледнеет после стирок. Сроки выполнения быстрые. Теперь только к вам будем обращаться. Спасибо большое!',
      image: 'МЛ'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Отзывы наших <span className="italic font-serif text-gray-700">клиентов</span>
          </h2>
          <p className="text-lg text-gray-600">Более 200 команд по всей России доверяют нам производство своей формы</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote size={32} className="text-gray-300" strokeWidth={1.5} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" strokeWidth={1.5} />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-6 flex-grow text-sm">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Хотите оставить отзыв о нашей работе?</p>
          <a
            href="/contacts"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-md transition-colors font-medium"
          >
            Написать отзыв
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
