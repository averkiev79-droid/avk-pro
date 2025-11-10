import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const LegalPage = () => {
  const { pageType } = useParams();
  const [page, setPage] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [pageType]);

  const fetchPage = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/legal-pages/${pageType}`);
      setPage(response.data);
    } catch (error) {
      console.error('Error fetching legal page:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultContent = {
    privacy: {
      title: 'Политика конфиденциальности',
      content: 'Содержание политики конфиденциальности будет добавлено администратором.'
    },
    terms: {
      title: 'Пользовательское соглашение',
      content: 'Содержание пользовательского соглашения будет добавлено администратором.'
    },
    requisites: {
      title: 'Реквизиты компании',
      content: 'Реквизиты компании будут добавлены администратором.'
    },
    cookies: {
      title: 'Информация о куках',
      content: 'Информация об использовании куков будет добавлена администратором.'
    }
  };

  const displayPage = page.title ? page : defaultContent[pageType] || page;

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="legal-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-sport-blue text-white py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">{displayPage.title}</h1>
        </div>
      </section>

      {/* Content */}
      <div className="container py-12 px-4 sm:px-6">
        <Card className="p-8 border border-gray-200 max-w-4xl mx-auto">
          <div className="prose max-w-none">
            {displayPage.content ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {displayPage.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Содержимое страницы не заполнено</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LegalPage;
