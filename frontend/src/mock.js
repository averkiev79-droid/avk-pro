// Mock данные для сайта ЛВК

export const products = [
  {
    id: 1,
    name: 'Хоккейное джерси Pro',
    category: 'jersey',
    description: 'Профессиональное хоккейное джерси с вашим логотипом',
    basePrice: 3500,
    image: 'https://images.unsplash.com/photo-1670509162391-1c16e6d0bb83',
    features: ['Дышащая ткань', 'Прочные швы', 'Сублимационная печать', 'Любой дизайн']
  },
  {
    id: 2,
    name: 'Хоккейные гамаши',
    category: 'socks',
    description: 'Высокие гамаши с логотипом команды',
    basePrice: 800,
    image: 'https://images.pexels.com/photos/793111/pexels-photo-793111.jpeg',
    features: ['Эластичный материал', 'Яркие цвета', 'Долговечность']
  },
  {
    id: 3,
    name: 'Тренировочная форма',
    category: 'training',
    description: 'Комплект для тренировок в зале',
    basePrice: 2800,
    image: 'https://images.unsplash.com/photo-1642643805244-21195333ac8c',
    features: ['Комфортная посадка', 'Влагоотведение', 'Фирменный стиль']
  },
  {
    id: 4,
    name: 'Чехлы для шорт',
    category: 'accessories',
    description: 'Защитные чехлы для хоккейных шорт',
    basePrice: 1200,
    image: 'https://images.pexels.com/photos/6468935/pexels-photo-6468935.jpeg',
    features: ['Прочный материал', 'Удобная конструкция']
  },
  {
    id: 5,
    name: 'Бомбер команды',
    category: 'outerwear',
    description: 'Стильный бомбер с символикой команды',
    basePrice: 4500,
    image: 'https://images.unsplash.com/photo-1669996160271-35f7abdc1563',
    features: ['Теплый и легкий', 'Современный дизайн', 'Вышивка логотипа']
  },
  {
    id: 6,
    name: 'Куртка-парка',
    category: 'outerwear',
    description: 'Зимняя парка для болельщиков и команды',
    basePrice: 6500,
    image: 'https://images.pexels.com/photos/8972131/pexels-photo-8972131.jpeg',
    features: ['Утеплитель', 'Водоотталкивающая ткань', 'Капюшон']
  },
  {
    id: 7,
    name: 'Жилетка команды',
    category: 'outerwear',
    description: 'Утепленная жилетка с логотипом',
    basePrice: 3200,
    image: 'https://images.unsplash.com/photo-1648312773792-3db3b560c793',
    features: ['Легкая', 'Практичная', 'Удобные карманы']
  },
  {
    id: 8,
    name: 'Джерси для болельщиков',
    category: 'jersey',
    description: 'Реплика игрового джерси для фанатов',
    basePrice: 2500,
    image: 'https://images.unsplash.com/photo-1754583340212-5bddfda09f7e',
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
    image: 'https://images.unsplash.com/photo-1642643805244-21195333ac8c',
    year: '2024'
  },
  {
    id: 2,
    teamName: 'Ветераны Невы',
    category: 'Взрослая команда',
    description: 'Игровая и тренировочная форма для любительской команды',
    items: ['Джерси домашнее', 'Джерси гостевое', 'Парки'],
    image: 'https://images.unsplash.com/photo-1670509162391-1c16e6d0bb83',
    year: '2024'
  },
  {
    id: 3,
    teamName: 'Фан-клуб Зенит',
    category: 'Болельщики',
    description: 'Фирменная одежда для фан-клуба',
    items: ['Бомберы', 'Жилетки', 'Шарфы'],
    image: 'https://images.unsplash.com/photo-1669996160271-35f7abdc1563',
    year: '2023'
  },
  {
    id: 4,
    teamName: 'Родительский клуб',
    category: 'Родители',
    description: 'Единая форма для родителей юных хоккеистов',
    items: ['Толстовки', 'Бейсболки', 'Шарфы'],
    image: 'https://images.pexels.com/photos/793111/pexels-photo-793111.jpeg',
    year: '2024'
  }
];

export const companyInfo = {
  name: 'ЛВК',
  fullName: 'ЛВК - Производство хоккейной экипировки',
  description: 'Профессиональное производство хоккейной формы, экипировки и фирменной одежды для команд любого уровня',
  address: 'Санкт-Петербург, пр. Ветеранов 140',
  phone: '+7 (812) 648-17-49',
  email: 'info@lvk-hockey.ru',
  logo: 'https://customer-assets.emergentagent.com/job_7033b264-2db2-4f8d-9e16-886c3928ac72/artifacts/rhyakgsx_logo.jpg',
  workHours: 'Пн-Пт: 10:00-19:00, Сб: 11:00-17:00'
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
    description: 'Работаем с заказами любого объема',
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
  }
];