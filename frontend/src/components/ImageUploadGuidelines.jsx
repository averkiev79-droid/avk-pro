import React from 'react';
import { Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Компонент с рекомендациями по загрузке изображений
 * Использование: <ImageUploadGuidelines variant="product" />
 */
const ImageUploadGuidelines = ({ variant = 'general' }) => {
  const guidelines = {
    general: {
      title: 'Рекомендации по загрузке изображений',
      recommendations: [
        { text: 'Разрешение: минимум 800×800px, рекомендуется 1200×1200px', icon: CheckCircle },
        { text: 'Формат: JPG, PNG, WEBP', icon: CheckCircle },
        { text: 'Размер файла: до 5-10 МБ', icon: CheckCircle },
        { text: 'Соотношение сторон: 1:1 (квадрат) или 4:3', icon: CheckCircle },
      ],
      avoid: [
        { text: 'Не используйте изображения с водяными знаками', icon: XCircle },
        { text: 'Избегайте размытых или низкокачественных фото', icon: XCircle },
      ],
    },
    product: {
      title: 'Рекомендации для фото товаров',
      recommendations: [
        { text: 'Разрешение: минимум 1200×1200px, оптимально 2000×2000px', icon: CheckCircle },
        { text: 'Формат: JPG или PNG (если нужна прозрачность)', icon: CheckCircle },
        { text: 'Соотношение: 1:1 (квадратное) для карточек товаров', icon: CheckCircle },
        { text: 'Фон: однотонный белый или нейтральный', icon: CheckCircle },
        { text: 'Освещение: равномерное, без резких теней', icon: CheckCircle },
        { text: 'Размер файла: 500KB - 2MB (оптимизируйте перед загрузкой)', icon: CheckCircle },
      ],
      tips: [
        { text: 'Покажите товар с разных ракурсов (3-5 фото)', icon: AlertTriangle },
        { text: 'Добавьте фото с деталями и текстурами', icon: AlertTriangle },
        { text: 'Если это форма - покажите на модели', icon: AlertTriangle },
      ],
      avoid: [
        { text: 'Не обрезайте товар слишком близко к краям', icon: XCircle },
        { text: 'Избегайте бликов и засветов', icon: XCircle },
        { text: 'Не используйте фильтры, искажающие цвета', icon: XCircle },
      ],
    },
    portfolio: {
      title: 'Рекомендации для портфолио',
      recommendations: [
        { text: 'Разрешение: минимум 1920×1080px (Full HD)', icon: CheckCircle },
        { text: 'Формат: JPG, PNG или WEBP', icon: CheckCircle },
        { text: 'Соотношение: 16:9 или 4:3', icon: CheckCircle },
        { text: 'Качество: высокое, детализированное', icon: CheckCircle },
        { text: 'Размер: 1-5 МБ после оптимизации', icon: CheckCircle },
      ],
      tips: [
        { text: 'Показывайте готовую работу на моделях или в использовании', icon: AlertTriangle },
        { text: 'Добавляйте контекст: команда в форме, матч и т.д.', icon: AlertTriangle },
      ],
      avoid: [
        { text: 'Не загружайте фото низкого разрешения', icon: XCircle },
        { text: 'Избегайте слишком тёмных или переэкспонированных фото', icon: XCircle },
      ],
    },
    article: {
      title: 'Рекомендации для статей и блога',
      recommendations: [
        { text: 'Главное фото: 1200×630px (оптимально для соцсетей)', icon: CheckCircle },
        { text: 'Внутри статьи: минимум 800px по ширине', icon: CheckCircle },
        { text: 'Формат: JPG или WEBP', icon: CheckCircle },
        { text: 'Размер файла: до 500KB', icon: CheckCircle },
      ],
      tips: [
        { text: 'Используйте релевантные изображения по теме', icon: AlertTriangle },
        { text: 'Добавляйте alt-тексты для SEO', icon: AlertTriangle },
      ],
    },
    logo: {
      title: 'Рекомендации для логотипов',
      recommendations: [
        { text: 'Формат: PNG с прозрачностью или SVG', icon: CheckCircle },
        { text: 'Разрешение: минимум 500×500px', icon: CheckCircle },
        { text: 'Соотношение: квадратное или горизонтальное', icon: CheckCircle },
        { text: 'Фон: прозрачный (PNG)', icon: CheckCircle },
      ],
      avoid: [
        { text: 'Не используйте JPG для логотипов', icon: XCircle },
        { text: 'Избегайте растянутых или сжатых изображений', icon: XCircle },
      ],
    },
  };

  const config = guidelines[variant] || guidelines.general;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-3">{config.title}</h3>
          
          {/* Рекомендации */}
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-blue-800">✅ Рекомендуется:</p>
            <ul className="space-y-1.5">
              {config.recommendations.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Советы */}
          {config.tips && (
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-blue-800">💡 Советы:</p>
              <ul className="space-y-1.5">
                {config.tips.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Чего избегать */}
          {config.avoid && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-800">❌ Избегайте:</p>
              <ul className="space-y-1.5">
                {config.avoid.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Инструмент для оптимизации */}
          <div className="mt-4 pt-4 border-t border-blue-300">
            <p className="text-xs text-blue-700">
              <strong>💾 Оптимизация изображений:</strong> Используйте онлайн-инструменты 
              (TinyPNG, Squoosh, ImageOptim) для сжатия без потери качества перед загрузкой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadGuidelines;
