import { portfolio } from '../mock';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Users } from 'lucide-react';

const PortfolioPage = () => {
  return (
    <div className="portfolio-page bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-chocolate text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-light mb-4">Наше портфолио</h1>
          <p className="text-lg opacity-90">Примеры выполненных заказов для команд разного уровня</p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {portfolio.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow group border-none bg-white">
              <div className="aspect-video overflow-hidden bg-soft-gray">
                <img
                  src={project.image}
                  alt={project.teamName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-sage text-white">{project.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>{project.year}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-light mb-3 text-chocolate">{project.teamName}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} className="text-sage" />
                    Выполненные работы:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
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