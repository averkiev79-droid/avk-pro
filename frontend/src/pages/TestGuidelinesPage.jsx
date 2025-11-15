import React from 'react';
import ImageUploadGuidelines from '../components/ImageUploadGuidelines';

const TestGuidelinesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тест рекомендаций по загрузке изображений
          </h1>
          <p className="text-gray-600">
            Примеры компонента с рекомендациями для разных типов контента
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">1. Для товаров</h2>
          <ImageUploadGuidelines variant="product" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">2. Для портфолио</h2>
          <ImageUploadGuidelines variant="portfolio" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">3. Для логотипов</h2>
          <ImageUploadGuidelines variant="logo" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">4. Для статей</h2>
          <ImageUploadGuidelines variant="article" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">5. Общие рекомендации</h2>
          <ImageUploadGuidelines variant="general" />
        </div>
      </div>
    </div>
  );
};

export default TestGuidelinesPage;
