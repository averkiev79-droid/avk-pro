import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Upload, Image, Copy, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ImageUploadGuidelines from '../../components/ImageUploadGuidelines';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const MediaPage = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState('');

  // Load existing files on mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/uploads`);
      const files = response.data.map(file => ({
        url: `${BACKEND_URL}${file.url}`,
        filename: file.filename,
        uploadedAt: file.uploadedAt,
        size: file.size
      }));
      setUploadedFiles(files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      toast.error('Ошибка при загрузке списка файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return {
          url: `${BACKEND_URL}${response.data.url}`,
          filename: response.data.filename,
          uploadedAt: new Date().toISOString(),
        };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles([...results, ...uploadedFiles]);
      toast.success(`${files.length} файл(ов) загружено успешно`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL скопирован в буфер обмена');
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление медиа</h1>
        <p className="text-gray-600">Загрузка и управление изображениями сайта</p>
      </div>

      <ImageUploadGuidelines variant="general" />

      {/* Upload Area */}
      <Card className="p-8 mb-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <div className="text-center">
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Загрузить изображения</h3>
          <p className="text-gray-600 mb-6">Перетащите файлы сюда или нажмите для выбора</p>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            id="file-upload-input"
            style={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
          />
          
          <label 
            htmlFor="file-upload-input"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: '#111827',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              pointerEvents: uploading ? 'none' : 'auto',
              opacity: uploading ? 0.5 : 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
          >
            {uploading ? 'Загрузка...' : 'Выбрать файлы'}
          </label>
          
          <p className="text-sm text-gray-500 mt-4">
            Поддерживаемые форматы: JPG, PNG, GIF, WebP (макс. 10MB)
          </p>
        </div>
      </Card>

      {/* Uploaded Files Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Загруженные файлы ({uploadedFiles.length})</h2>
        
        {uploadedFiles.length === 0 ? (
          <div className="p-12 text-center border border-gray-200 rounded-md bg-gray-50">
            <Image className="mx-auto mb-4 text-gray-400" size={64} strokeWidth={1.5} />
            <p className="text-gray-500">Нет загруженных файлов</p>
            <p className="text-sm text-gray-400 mt-2">Загрузите изображения с помощью формы выше</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="overflow-hidden border border-gray-200 rounded-md group bg-white">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate mb-3">
                    {file.filename}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(file.url)}
                      className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-900"
                    >
                      {copiedUrl === file.url ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-1" />
                          URL
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
