import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminArticlesPage = () => {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'tips',
    tone: 'professional'
  });
  const [generatedArticle, setGeneratedArticle] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      toast.error('Введите тему статьи');
      return;
    }

    setGenerating(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const fetchFn = window.__originalFetch || fetch;
      const response = await fetchFn(`${backendUrl}/api/articles/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setGeneratedArticle(result.data);
        toast.success('Статья сгенерирована!');
      } else {
        toast.error('Ошибка генерации: ' + result.detail);
      }
    } catch (error) {
      console.error('Error generating article:', error);
      toast.error('Ошибка при генерации статьи');
    } finally {
      setGenerating(false);
    }
  };

  // Transliteration function for creating SEO-friendly slugs
  const transliterate = (text) => {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    
    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (!generatedArticle) return;

    setSaving(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Create SEO-friendly transliterated slug
      const slug = transliterate(generatedArticle.title);

      const articleData = {
        ...generatedArticle,
        slug,
        category: formData.category,
        author: 'A.V.K. SPORT',
        is_published: true
      };

      const fetchFn = window.__originalFetch || fetch;
      const response = await fetchFn(`${backendUrl}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Статья сохранена!');
        setGeneratedArticle(null);
        setFormData({ topic: '', category: 'tips', tone: 'professional' });
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Ошибка при сохранении статьи');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-articles-page bg-gray-50 min-h-screen py-20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Генератор статей с AI
          </h1>
          <p className="text-gray-600">Создавайте SEO-оптимизированные статьи для блога</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Параметры генерации</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="topic">Тема статьи *</Label>
                <Input
                  id="topic"
                  placeholder="Например: Как выбрать хоккейную форму для ребенка"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Категория</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tips">Советы и гайды</option>
                  <option value="news">Новости хоккея</option>
                  <option value="care">Уход за экипировкой</option>
                </select>
              </div>

              <div>
                <Label htmlFor="tone">Стиль написания</Label>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="professional">Профессиональный</option>
                  <option value="casual">Разговорный</option>
                  <option value="technical">Технический</option>
                </select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !formData.topic.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерирую...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Сгенерировать статью
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                💡 AI создаст статью объемом 500-800 слов с SEO-оптимизацией, заголовками и практическими советами
              </p>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Предпросмотр</h2>
            
            {!generatedArticle ? (
              <div className="text-center py-20 text-gray-400">
                <Sparkles size={48} className="mx-auto mb-4" />
                <p>Сгенерированная статья появится здесь</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Заголовок</p>
                  <h3 className="text-2xl font-bold text-gray-900">{generatedArticle.title}</h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Краткое описание</p>
                  <p className="text-gray-700">{generatedArticle.excerpt}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">SEO Title</p>
                  <p className="text-gray-700 text-sm">{generatedArticle.seo_title}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">SEO Description</p>
                  <p className="text-gray-700 text-sm">{generatedArticle.seo_description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Ключевые слова</p>
                  <p className="text-gray-700 text-sm">{generatedArticle.seo_keywords}</p>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500 mb-3">Контент (превью)</p>
                  <div 
                    className="prose prose-sm max-w-none line-clamp-6"
                    dangerouslySetInnerHTML={{ __html: generatedArticle.content }}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохраняю...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Опубликовать статью
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminArticlesPage;
