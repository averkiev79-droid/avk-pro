import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, User, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useBreadcrumbs } from '../context/BreadcrumbsContext';

const ArticlePage = () => {
  const { slug } = useParams();
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumbs();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchArticle();
    
    // Cleanup breadcrumb on unmount
    return () => {
      clearBreadcrumb(`/blog/${slug}`);
    };
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/articles/slug/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        // Set breadcrumb with article title
        setBreadcrumb(`/blog/${slug}`, data.title);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Статья не найдена</h2>
          <Link to="/blog" className="text-blue-600 hover:underline">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Главная</Link>
            <ChevronRight size={16} />
            <Link to="/blog" className="hover:text-gray-900">Блог</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Badge className="mb-4 bg-gray-100 text-gray-700 hover:bg-gray-100">
          {article.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(article.created_at).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:my-6 prose-li:text-gray-700
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Back to Blog */}
      <div className="container max-w-4xl mx-auto px-4 py-12 border-t border-gray-200">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Вернуться к блогу
        </Link>
      </div>
    </div>
  );
};

export default ArticlePage;
