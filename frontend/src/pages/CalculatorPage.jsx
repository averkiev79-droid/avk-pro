import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Calculator, Plus, Trash2 } from 'lucide-react';

const CalculatorPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    size: ''
  });

  const [items, setItems] = useState([]);

  const productPrices = {
    'jersey': { base: 3500, name: 'Хоккейное джерси' },
    'socks': { base: 800, name: 'Гамаши' },
    'training': { base: 2800, name: 'Тренировочная форма' },
    'accessories': { base: 1200, name: 'Чехлы для шорт' },
    'bomber': { base: 4500, name: 'Бомбер' },
    'parka': { base: 6500, name: 'Парка' },
    'vest': { base: 3200, name: 'Жилетка' }
  };

  const sizeCategories = {
    'kids': 'Дети 110-140',
    'teens': 'Подростки 146-170',
    'adults': 'Взрослые'
  };

  const handleAddItem = () => {
    if (!formData.productType || !formData.quantity) {
      toast.error('Заполните обязательные поля', {
        description: 'Выберите тип товара и укажите количество'
      });
      return;
    }

    const qty = parseInt(formData.quantity);
    if (qty < 1) {
      toast.error('Количество должно быть больше 0');
      return;
    }

    const product = productPrices[formData.productType];
    const newItem = {
      id: Date.now(),
      productType: formData.productType,
      productName: product.name,
      unitPrice: product.base,
      quantity: qty,
      size: formData.size,
      sizeName: formData.size ? sizeCategories[formData.size] : '',
      total: product.base * qty
    };

    setItems([...items, newItem]);
    
    // Reset form
    setFormData({
      productType: '',
      quantity: '',
      size: ''
    });

    toast.success('Товар добавлен!', {
      description: `${product.name} добавлен в калькулятор`
    });
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Товар удален');
  };

  const handleReset = () => {
    setFormData({
      productType: '',
      quantity: '',
      size: ''
    });
    setItems([]);
    toast.success('Калькулятор очищен');
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="calculator-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            Калькулятор стоимости <span className="italic font-serif text-gray-700">хоккейной формы</span>
          </h1>
          <p className="text-lg text-gray-600">Рассчитайте цену на джерси, гамаши и экипировку для вашей команды</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 border border-gray-200 rounded-md">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 tracking-tight">
              <Calculator className="text-gray-900" size={28} strokeWidth={1.5} />
              Параметры заказа
            </h2>

            <div className="space-y-6">
              {/* Тип товара */}
              <div className="space-y-2">
                <Label htmlFor="productType" className="text-sm font-medium text-gray-900">Тип товара *</Label>
                <Select 
                  value={formData.productType} 
                  onValueChange={(value) => setFormData({...formData, productType: value})}
                >
                  <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                    <SelectValue placeholder="Выберите товар" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(productPrices).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.name} - от {value.base} ₽</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Количество */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-900">Количество *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Введите количество"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              {/* Размер */}
              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium text-gray-900">Категория размеров</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData({...formData, size: value})}
                >
                  <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kids">Дети 110-140</SelectItem>
                    <SelectItem value="teens">Подростки 146-170</SelectItem>
                    <SelectItem value="adults">Взрослые</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleAddItem} 
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-md py-6 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={20} strokeWidth={2} />
                  Добавить товар
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md py-6 transition-colors font-medium"
                >
                  Очистить
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {items.length > 0 ? (
              <div className="bg-white p-8 border border-gray-200 rounded-md sticky top-24">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Список товаров</h2>
                
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Цена: {item.unitPrice} ₽ × {item.quantity} шт</p>
                          {item.sizeName && <p>Размер: {item.sizeName}</p>}
                          <p className="font-semibold text-gray-900">Сумма: {item.total} ₽</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center py-6 bg-gray-900 text-white px-6 rounded-md mb-6">
                  <span className="text-lg font-semibold">Итоговая стоимость:</span>
                  <span className="text-3xl font-bold">{getTotalPrice()} ₽</span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    * Это предварительный расчет. Точная стоимость определяется после обсуждения деталей заказа.
                  </p>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-md transition-colors font-medium">
                    Оформить заказ
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 border border-gray-200 rounded-md text-center h-full flex flex-col items-center justify-center">
                <Calculator className="text-gray-400 mb-4" size={64} strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Добавьте товары</h3>
                <p className="text-gray-500">Выберите товары и нажмите "Добавить товар"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;