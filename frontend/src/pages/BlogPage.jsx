import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все статьи' },
    { id: 'tips', name: 'Советы и гайды' },
    { id: 'news', name: 'Новости хоккея' },
    { id: 'care', name: 'Уход за экипировкой' }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const categoryParam = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const response = await fetch(`${backendUrl}/api/articles${categoryParam}`);
      const data = await response.json();
      setArticles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="blog-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
                Блог <span className="italic font-serif text-gray-700">A.V.K. SPORT</span>
              </h1>
              <p className="text-lg text-gray-600">Полезные статьи о хоккейной экипировке и уходе за ней</p>
            </div>
            <a 
              href={`${process.env.REACT_APP_BACKEND_URL}/api/rss`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 whitespace-nowrap ml-4"
              title="RSS фид"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
              </svg>
              <span className="hidden sm:inline">RSS</span>
            </a>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto py-20 px-4">
        {/* Categories Filter */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-900'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
            <p className="mt-4 text-gray-600">Загрузка статей...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Статьи скоро появятся</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} to={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {article.featured_image && (
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <Badge className="mb-3 bg-gray-100 text-gray-700 hover:bg-gray-100">
                      {getCategoryName(article.category)}
                    </Badge>
                    <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
