import { useEffect } from 'react';
import { portfolio } from '../mock';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Users } from 'lucide-react';

const PortfolioPage = () => {
  // Auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="portfolio-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-gray-900">
            Портфолио <span className="italic font-serif text-gray-700">хоккейной формы</span>
          </h1>
          <p className="text-lg text-gray-600">Наши работы: джерси и экипировка для детских, подростковых и взрослых команд</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {portfolio.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-white rounded-md">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={project.image}
                  alt={project.teamName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-gray-900 text-white rounded-md px-3 py-1">{project.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={16} strokeWidth={1.5} />
                    <span>{project.year}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{project.teamName}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={16} strokeWidth={1.5} className="text-gray-900" />
                    Выполненные работы:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-gray-300 text-gray-700 rounded-md">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;