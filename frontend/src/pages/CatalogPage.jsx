import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            Каталог <span className="italic font-serif text-gray-700">продукции</span>
          </h1>
          <p className="text-lg text-gray-600">Хоккейная экипировка для команд любого уровня</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto py-16 px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-12">
          {/* Sidebar - Categories */}
          <aside>
            <h3 className="text-sm font-semibold mb-6 uppercase tracking-wider text-gray-900">Категории</h3>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-left px-4 py-3 rounded-md transition-all text-sm font-medium ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600 text-sm">
                Найдено товаров: <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-16 text-center bg-gray-50 rounded-md">
                <p className="text-gray-500 text-lg">Товары не найдены</p>
                <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <div className="transition-all duration-300 group cursor-pointer h-full">
                      <div className="aspect-square overflow-hidden bg-gray-100 mb-4 rounded-md">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <Badge className="mb-3 bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-medium text-xs">
                          {categories.find(c => c.id === product.category)?.name}
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                              <span className="text-gray-900 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">от</p>
                            <p className="text-xl font-semibold text-gray-900">{product.basePrice} ₽</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:underline">
                            Подробнее →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
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