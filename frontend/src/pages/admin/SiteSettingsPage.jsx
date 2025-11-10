import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Upload, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState({
    hero_image: '',
    about_image: '',
    about_secondary_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/site-settings`);
      const settingsObj = {};
      response.data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      setSettings(prevSettings => ({...prevSettings, ...settingsObj}));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;

    setUploading(key);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Backend returns relative path like "/uploads/filename.jpg"
      // We need to construct full URL for display
      const relativePath = uploadResponse.data.url;
      const fileUrl = relativePath.startsWith('http') ? relativePath : `${BACKEND_URL}${relativePath}`;
      
      await axios.post(`${BACKEND_URL}/api/site-settings`, {
        key,
        value: fileUrl
      });

      setSettings(prev => ({...prev, [key]: fileUrl}));
      toast.success('Изображение загружено');
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Ошибка загрузки');
    } finally {
      setUploading('');
    }
  };

  const handleUrlChange = async (key, url) => {
    try {
      await axios.post(`${BACKEND_URL}/api/site-settings`, { key, value: url });
      setSettings(prev => ({...prev, [key]: url}));
      toast.success('URL обновлен');
    } catch (error) {
      console.error('Error updating URL:', error);
      toast.error('Ошибка обновления');
    }
  };

  const settingsConfig = [
    {
      key: 'hero_image',
      label: 'Изображение Hero секции (Главная страница)',
      description: 'Основное изображение на главной странице'
    },
    {
      key: 'about_image',
      label: 'Основное изображение (О компании)',
      description: 'Изображение производства на странице "О компании"'
    },
    {
      key: 'about_secondary_image',
      label: 'Дополнительное изображение (О компании)',
      description: 'Второе изображение на странице "О компании"'
    }
  ];

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Настройки сайта</h1>
        <p className="text-gray-600">Управление изображениями на страницах сайта</p>
      </div>

      <div className="space-y-6">
        {settingsConfig.map(config => (
          <Card key={config.key} className="p-6 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">{config.label}</h3>
                <p className="text-sm text-gray-600 mb-4">{config.description}</p>

                <div className="space-y-4">
                  <div>
                    <Label>URL изображения</Label>
                    <div className="flex gap-2">
                      <Input
                        value={settings[config.key] || ''}
                        onChange={(e) => setSettings(prev => ({...prev, [config.key]: e.target.value}))}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleUrlChange(config.key, settings[config.key])}
                        className="bg-sport-blue hover:bg-sport-red text-white"
                      >
                        <Save size={18} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Или загрузить новое изображение</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(config.key, e.target.files[0])}
                      id={`file-${config.key}`}
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
                      htmlFor={`file-${config.key}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        color: '#111827',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: uploading === config.key ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        opacity: uploading === config.key ? 0.5 : 1,
                        pointerEvents: uploading === config.key ? 'none' : 'auto'
                      }}
                      onMouseEnter={(e) => {
                        if (uploading !== config.key) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.borderColor = '#9ca3af';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (uploading !== config.key) {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }
                      }}
                    >
                      <Upload size={18} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                      {uploading === config.key ? 'Загрузка...' : 'Выбрать файл'}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Предпросмотр</Label>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  {settings[config.key] ? (
                    <img
                      src={settings[config.key]}
                      alt={config.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-gray-400" size={48} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SiteSettingsPage;
