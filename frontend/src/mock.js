// Mock данные для сайта ЛВК

export const products = [
  {
    id: 1,
    name: 'Хоккейное джерси Pro',
    category: 'jersey',
    description: 'Профессиональное хоккейное джерси с индивидуальным дизайном и логотипом команды. Изготовлено из высококачественной дышащей ткани с влагоотведением. Сублимационная печать обеспечивает яркость цветов на протяжении всего срока эксплуатации. Прочные усиленные швы выдерживают интенсивные тренировки и матчи. Доступны все размеры от детских до взрослых.',
    basePrice: 3500,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%232563eb"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EHOCKEY JERSEY%3C/text%3E%3C/svg%3E',
    alt: 'Хоккейное джерси Pro - профессиональная хоккейная форма на заказ СПб',
    features: ['Дышащая ткань с влагоотведением', 'Прочные усиленные швы', 'Яркая сублимационная печать', 'Индивидуальный дизайн и логотип']
  },
  {
    id: 2,
    name: 'Хоккейные гамаши',
    category: 'socks',
    description: 'Высокие гамаши с логотипом команды',
    basePrice: 800,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%231e40af"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EHOCKEY SOCKS%3C/text%3E%3C/svg%3E',
    alt: 'Хоккейные гамаши - пошив на заказ с логотипом команды',
    features: ['Эластичный материал', 'Яркие цвета', 'Долговечность']
  },
  {
    id: 3,
    name: 'Тренировочная форма',
    category: 'training',
    description: 'Комплект для тренировок в зале',
    basePrice: 2800,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23ea580c"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3ETRAINING GEAR%3C/text%3E%3C/svg%3E',
    alt: 'Тренировочная форма для хоккея - спортивная одежда на заказ',
    features: ['Комфортная посадка', 'Влагоотведение', 'Фирменный стиль']
  },
  {
    id: 4,
    name: 'Чехлы для шорт',
    category: 'accessories',
    description: 'Защитные чехлы для хоккейных шорт',
    basePrice: 1200,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3ESHORTS COVERS%3C/text%3E%3C/svg%3E',
    alt: 'Чехлы для хоккейных шорт - защитная экипировка',
    features: ['Прочный материал', 'Удобная конструкция']
  },
  {
    id: 5,
    name: 'Бомбер команды',
    category: 'outerwear',
    description: 'Стильный бомбер с символикой команды',
    basePrice: 4500,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23dc2626"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3ETEAM BOMBER%3C/text%3E%3C/svg%3E',
    alt: 'Бомбер команды - куртка с вышивкой логотипа для хоккеистов',
    features: ['Теплый и легкий', 'Современный дизайн', 'Вышивка логотипа']
  },
  {
    id: 6,
    name: 'Куртка-парка',
    category: 'outerwear',
    description: 'Зимняя парка для болельщиков и команды',
    basePrice: 6500,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%231f2937"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EWINTER PARKA%3C/text%3E%3C/svg%3E',
    alt: 'Зимняя парка для хоккейной команды - теплая куртка с логотипом',
    features: ['Утеплитель', 'Водоотталкивающая ткань', 'Капюшон']
  },
  {
    id: 7,
    name: 'Жилетка команды',
    category: 'outerwear',
    description: 'Утепленная жилетка с логотипом',
    basePrice: 3200,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%231d4ed8"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3ETEAM VEST%3C/text%3E%3C/svg%3E',
    alt: 'Жилетка команды - спортивная безрукавка с фирменным стилем',
    features: ['Легкая', 'Практичная', 'Удобные карманы']
  },
  {
    id: 8,
    name: 'Джерси для болельщиков',
    category: 'jersey',
    description: 'Реплика игрового джерси для фанатов',
    basePrice: 2500,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23b91c1c"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EFAN JERSEY%3C/text%3E%3C/svg%3E',
    alt: 'Джерси для болельщиков - фанатская хоккейная форма',
    features: ['Точная копия', 'Комфортная ткань', 'Доступная цена']
  }
];

export const categories = [
  { id: 'all', name: 'Все товары', icon: 'Grid' },
  { id: 'jersey', name: 'Хоккейные джерси', icon: 'Shirt' },
  { id: 'socks', name: 'Гамаши', icon: 'Gauge' },
  { id: 'training', name: 'Форма для зала', icon: 'Dumbbell' },
  { id: 'accessories', name: 'Аксессуары', icon: 'Package' },
  { id: 'outerwear', name: 'Верхняя одежда', icon: 'Wind' }
];

export const portfolio = [
  {
    id: 1,
    teamName: 'Юниор СПб',
    category: 'Детская команда',
    description: 'Полный комплект формы для детской хоккейной команды',
    items: ['Джерси', 'Гамаши', 'Тренировочная форма'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%232563eb"/%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EЮниор СПб%3C/text%3E%3C/svg%3E',
    year: '2024'
  },
  {
    id: 2,
    teamName: 'Ветераны Невы',
    category: 'Взрослая команда',
    description: 'Игровая и тренировочная форма для любительской команды',
    items: ['Джерси домашнее', 'Джерси гостевое', 'Парки'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%231e40af"/%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EВетераны Невы%3C/text%3E%3C/svg%3E',
    year: '2024'
  },
  {
    id: 3,
    teamName: 'Фан-клуб Зенит',
    category: 'Болельщики',
    description: 'Фирменная одежда для фан-клуба',
    items: ['Бомберы', 'Жилетки', 'Шарфы'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23dc2626"/%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EФан-клуб Зенит%3C/text%3E%3C/svg%3E',
    year: '2023'
  },
  {
    id: 4,
    teamName: 'Родительский клуб',
    category: 'Родители',
    description: 'Единая форма для родителей юных хоккеистов',
    items: ['Толстовки', 'Бейсболки', 'Шарфы'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dy=".3em" font-family="Arial"%3EРодительский клуб%3C/text%3E%3C/svg%3E',
    year: '2024'
  }
];

export const companyInfo = {
  name: 'A.V.K. SPORT',
  fullName: 'A.V.K. SPORT - Производство хоккейной экипировки',
  description: 'Профессиональное производство хоккейной формы, экипировки и фирменной одежды для команд любого уровня',
  address: 'Санкт-Петербург, пр. Ветеранов 140 литГ',
  phone: '+7 (812) 648-17-49',
  email: 'info@avk-hockey.ru',
  logo: '/logo.png',
  workHours: 'Пн-Пт: 10:00-19:00, Сб: 11:00-17:00',
  minOrder: 'Минимальная партия заказа - от 10 штук'
};

export const advantages = [
  {
    title: 'Собственное производство',
    description: 'Контролируем качество на всех этапах',
    icon: 'Factory'
  },
  {
    title: 'Быстрые сроки',
    description: 'Изготовление заказа от 14 дней',
    icon: 'Zap'
  },
  {
    title: 'Любой дизайн',
    description: 'Реализуем самые смелые идеи',
    icon: 'Palette'
  },
  {
    title: 'Опт и розница',
    description: 'Работаем с заказами от 10 штук',
    icon: 'Users'
  }
];

export const reviews = [
  {
    id: 1,
    author: 'Дмитрий Соколов',
    role: 'Тренер ДЮСШ',
    text: 'Заказывали форму для детской команды. Качество отличное, дети в восторге! Сроки соблюдены, цены адекватные.',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: 2,
    author: 'Анна Петрова',
    role: 'Представитель родительского комитета',
    text: 'Сделали бомберы для родителей нашей команды. Все очень довольны, качество на высоте!',
    rating: 5,
    date: '2024-02-03'
  },
  {
    id: 3,
    author: 'Игорь Васильев',
    role: 'Капитан любительской команды',
    text: 'Второй раз заказываем у ЛВК. Профессиональный подход, помогли с дизайном. Рекомендуем!',
    rating: 5,
    date: '2024-01-28'
  },
  {
    id: 4,
    author: 'Сергей Михайлов',
    role: 'Руководитель хоккейного клуба',
    text: 'Отличная работа!',
    rating: 5,
    date: '2024-03-10'
  },
  {
    id: 5,
    author: 'Екатерина Смирнова',
    role: 'Организатор турниров',
    text: 'Заказывали форму для турнира. Все участники были в восторге от качества и дизайна. Быстрая доставка, отличное обслуживание. Спасибо команде!',
    rating: 5,
    date: '2024-02-20'
  },
  {
    id: 6,
    author: 'Алексей Новиков',
    role: 'Игрок',
    text: 'Лучшая форма, которую я носил. Удобная и стильная.',
    rating: 5,
    date: '2024-03-05'
  },
  {
    id: 7,
    author: 'Ольга Волкова',
    role: 'Мама юного хоккеиста',
    text: 'Очень довольны! Форма отлично сидит, качество материалов превосходное. Сын в восторге.',
    rating: 5,
    date: '2024-01-22'
  },
  {
    id: 8,
    author: 'Павел Кузнецов',
    role: 'Тренер взрослой команды',
    text: 'Работаем с A.V.K. SPORT уже третий сезон. Всегда высокое качество, индивидуальный подход к каждому заказу, помощь с дизайном. Рекомендуем всем командам!',
    rating: 5,
    date: '2024-02-15'
  },
  {
    id: 9,
    author: 'Мария Лебедева',
    role: 'Администратор клуба',
    text: 'Профессионально и в срок!',
    rating: 5,
    date: '2024-03-01'
  },
  {
    id: 10,
    author: 'Виктор Романов',
    role: 'Капитан команды ветеранов',
    text: 'Заказали полный комплект формы для нашей ветеранской команды. Все идеально подошло, качество на высшем уровне.',
    rating: 5,
    date: '2024-01-30'
  }
];
