import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';

/**
 * Тестовая страница для загрузки изображений
 * Доступна по адресу: /test-upload
 */
const TestUploadPage = () => {
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleUploadComplete = (url) => {
    console.log('✅ Файл загружен:', url);
    setUploadedUrls([...uploadedUrls, url]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Загрузка изображений
          </h1>
          <p className="text-gray-600">
            Используйте этот инструмент для загрузки изображений на сервер
          </p>
        </div>

        {/* Компонент загрузки */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Загрузить изображение</h2>
          <ImageUploader onUploadComplete={handleUploadComplete} maxSize={10} />
        </div>

        {/* История загрузок */}
        {uploadedUrls.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Загруженные файлы ({uploadedUrls.length})
            </h2>
            <div className="space-y-4">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Изображение #{index + 1}
                    </p>
                    <p className="text-xs text-gray-500 break-all">{url}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Копировать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Инструкция */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Как использовать в коде:</h3>
          <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`import ImageUploader from './components/ImageUploader';

// В вашем компоненте:
<ImageUploader 
  onUploadComplete={(url) => {
    console.log('URL:', url);
    // Используйте URL для сохранения в базу данных
  }}
  maxSize={5}  // Максимум 5MB
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestUploadPage;
