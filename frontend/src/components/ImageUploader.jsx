import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

/**
 * Компонент для загрузки изображений
 * 
 * Использование:
 * <ImageUploader 
 *   onUploadComplete={(url) => console.log('Загружено:', url)}
 *   multiple={false}
 * />
 */
const ImageUploader = ({ onUploadComplete, multiple = false, maxSize = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка размера (в MB)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимум ${maxSize}MB`);
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Можно загружать только изображения');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const fetchFn = window.__originalFetch || fetch;
      const response = await fetchFn(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      const fullUrl = `${backendUrl}${data.url}`;
      
      setUploadedUrl(fullUrl);
      
      if (onUploadComplete) {
        onUploadComplete(fullUrl);
      }
    } catch (err) {
      setError(err.message || 'Не удалось загрузить файл');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError('');
  };

  return (
    <div className="w-full">
      {/* Область загрузки */}
      {!preview && (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP (макс. {maxSize}MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
          />
        </label>
      )}

      {/* Превью загруженного изображения */}
      {preview && (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          
          {/* Индикатор загрузки */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p>Загрузка...</p>
              </div>
            </div>
          )}

          {/* Успешная загрузка */}
          {uploadedUrl && !uploading && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
              <Check className="w-5 h-5" />
            </div>
          )}

          {/* Кнопка очистки */}
          <button
            onClick={handleClear}
            className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* URL загруженного файла */}
      {uploadedUrl && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium mb-1">✅ Файл загружен!</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={uploadedUrl}
              readOnly
              className="flex-1 px-2 py-1 text-xs bg-white border border-green-300 rounded text-gray-700"
            />
            <button
              onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Копировать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
