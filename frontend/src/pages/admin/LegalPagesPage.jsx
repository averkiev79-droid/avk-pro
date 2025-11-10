import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const LegalPagesPage = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [pages, setPages] = useState({
    privacy: { title: '', content: '' },
    terms: { title: '', content: '' },
    requisites: { title: '', content: '' },
    cookies: { title: '', content: '' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPages();
  }, []);

  const fetchAllPages = async () => {
    setLoading(true);
    try {
      const types = ['privacy', 'terms', 'requisites', 'cookies'];
      const promises = types.map(type =>
        axios.get(`${BACKEND_URL}/api/legal-pages/${type}`)
      );
      const responses = await Promise.all(promises);
      
      const pagesData = {};
      responses.forEach((response, index) => {
        pagesData[types[index]] = {
          title: response.data.title || '',
          content: response.data.content || ''
        };
      });
      
      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Ошибка загрузки страниц');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pageType) => {
    try {
      await axios.post(`${BACKEND_URL}/api/legal-pages/${pageType}`, pages[pageType]);
      toast.success('Страница сохранена');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Ошибка сохранения');
    }
  };

  const updatePage = (pageType, field, value) => {
    setPages(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'privacy', label: 'Политика конфиденциальности', icon: '🔒' },
    { id: 'terms', label: 'Пользовательское соглашение', icon: '📜' },
    { id: 'requisites', label: 'Реквизиты', icon: '🏢' },
    { id: 'cookies', label: 'Информация о куках', icon: '🍪' }
  ];

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Юридическая информация</h1>
        <p className="text-gray-600">Управление юридическими документами и страницами</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-sport-blue border-b-2 border-sport-blue'
                    : 'text-gray-600 hover:text-sport-blue'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="p-6 border border-gray-200">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Заголовок страницы</Label>
            <Input
              id="title"
              value={pages[activeTab].title}
              onChange={(e) => updatePage(activeTab, 'title', e.target.value)}
              placeholder="Введите заголовок"
              className="text-lg font-medium"
            />
          </div>

          <div>
            <Label htmlFor="content">Содержание</Label>
            <Textarea
              id="content"
              value={pages[activeTab].content}
              onChange={(e) => updatePage(activeTab, 'content', e.target.value)}
              rows={20}
              placeholder="Введите текст страницы (поддерживается Markdown)"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Используйте пустую строку для разделения абзацев
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleSave(activeTab)}
              className="bg-sport-blue hover:bg-sport-red text-white"
            >
              <Save size={18} className="mr-2" />
              Сохранить изменения
            </Button>
            
            <a
              href={`/${activeTab}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" className="border-gray-300">
                <FileText size={18} className="mr-2" />
                Предпросмотр
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* Default Templates Info */}
      {!pages[activeTab].content && (
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold mb-2">💡 Подсказка</h3>
          <p className="text-sm text-gray-700">
            Страница пуста. Добавьте содержание выше и сохраните изменения.
          </p>
        </Card>
      )}
    </div>
  );
};

export default LegalPagesPage;
