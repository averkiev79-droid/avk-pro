import { useState } from 'react';
import { products, categories } from '../mock';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    toast.success(`${product.name} добавлен в заявку`, {
      description: 'Перейдите на страницу заказа для оформления'
    });
  };

  return (
    <div className="catalog-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-sport-red text-white py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Каталог продукции</h1>
          <p className="text-base sm:text-lg opacity-90">Хоккейная экипировка для команд любого уровня</p>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base border-gray-300"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Categories */}
          <aside className="space-y-4">
            <h3 className="text-xl font-light mb-4">Категории</h3>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-left px-4 py-3 rounded-lg transition-all duration-300 text-sm border ${
                    selectedCategory === category.id
                      ? 'bg-sport-blue text-white border-sport-blue shadow-md'
                      : 'bg-white hover:bg-slate-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Найдено товаров: <span className="font-medium text-dark">{filteredProducts.length}</span>
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">Товары не найдены</p>
                <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-white">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <Badge className="mb-3 bg-slate-100 text-gray-700 border border-gray-200">
                        {categories.find(c => c.id === product.category)?.name}
                      </Badge>
                      <h3 className="text-lg font-bold mb-2 text-dark">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-sport-blue mt-1 font-bold">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">от</p>
                          <p className="text-xl font-bold text-sport-blue">{product.basePrice} ₽</p>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-sport-red hover:bg-sport-orange text-white transition-all duration-300 shadow-sm"
                        >
                          Заказать
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;