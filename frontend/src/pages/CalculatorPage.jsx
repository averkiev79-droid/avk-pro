import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Calculator, Download } from 'lucide-react';

const CalculatorPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    hasLogo: 'no',
    logoType: '',
    size: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const productPrices = {
    'jersey': { base: 3500, name: 'Хоккейное джерси' },
    'socks': { base: 800, name: 'Гамаши' },
    'training': { base: 2800, name: 'Тренировочная форма' },
    'accessories': { base: 1200, name: 'Чехлы для шорт' },
    'bomber': { base: 4500, name: 'Бомбер' },
    'parka': { base: 6500, name: 'Парка' },
    'vest': { base: 3200, name: 'Жилетка' }
  };

  const logoTypePrices = {
    'sublimation': 500,
    'embroidery': 800,
    'print': 300
  };

  const handleCalculate = () => {
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

    let basePrice = productPrices[formData.productType].base;
    let logoPrice = 0;

    if (formData.hasLogo === 'yes' && formData.logoType) {
      logoPrice = logoTypePrices[formData.logoType];
    }

    const unitPrice = basePrice + logoPrice;
    let totalPrice = unitPrice * qty;

    // Скидки за объем
    if (qty >= 20) {
      totalPrice *= 0.85; // 15% скидка
    } else if (qty >= 10) {
      totalPrice *= 0.9; // 10% скидка
    } else if (qty >= 5) {
      totalPrice *= 0.95; // 5% скидка
    }

    setCalculatedPrice({
      basePrice,
      logoPrice,
      unitPrice,
      quantity: qty,
      subtotal: unitPrice * qty,
      discount: (unitPrice * qty) - totalPrice,
      total: Math.round(totalPrice)
    });

    toast.success('Расчет выполнен!', {
      description: 'Стоимость вашего заказа рассчитана'
    });
  };

  const handleReset = () => {
    setFormData({
      productType: '',
      quantity: '',
      hasLogo: 'no',
      logoType: '',
      size: ''
    });
    setCalculatedPrice(null);
  };

  return (
    <div className="calculator-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Калькулятор <span className="italic font-serif">стоимости</span>
          </h1>
          <p className="text-lg text-gray-300">Рассчитайте предварительную стоимость вашего заказа</p>
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
                <p className="text-xs text-gray-500">Скидки: от 5 шт - 5%, от 10 шт - 10%, от 20 шт - 15%</p>
              </div>

              {/* Нужен логотип */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Нужен логотип команды?</Label>
                <Select 
                  value={formData.hasLogo} 
                  onValueChange={(value) => setFormData({...formData, hasLogo: value, logoType: ''})}
                >
                  <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Нет</SelectItem>
                    <SelectItem value="yes">Да</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Тип нанесения */}
              {formData.hasLogo === 'yes' && (
                <div className="space-y-2">
                  <Label htmlFor="logoType" className="text-sm font-medium text-gray-900">Тип нанесения логотипа</Label>
                  <Select 
                    value={formData.logoType} 
                    onValueChange={(value) => setFormData({...formData, logoType: value})}
                  >
                    <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sublimation">Сублимация (+500 ₽)</SelectItem>
                      <SelectItem value="embroidery">Вышивка (+800 ₽)</SelectItem>
                      <SelectItem value="print">Печать (+300 ₽)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Размер */}
              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium text-gray-900">Размер (опционально)</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData({...formData, size: value})}
                >
                  <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                    <SelectValue placeholder="Выберите размер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="xxl">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleCalculate} 
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-md py-6 transition-colors font-medium"
                >
                  Рассчитать
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-md py-6 transition-colors font-medium"
                >
                  Сбросить
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {calculatedPrice ? (
              <div className="bg-white p-8 border border-gray-200 rounded-md sticky top-24">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Результат расчета</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Базовая цена:</span>
                    <span className="font-semibold text-gray-900">{calculatedPrice.basePrice} ₽</span>
                  </div>

                  {calculatedPrice.logoPrice > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Нанесение логотипа:</span>
                      <span className="font-semibold text-gray-900">+{calculatedPrice.logoPrice} ₽</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Цена за единицу:</span>
                    <span className="font-semibold text-gray-900">{calculatedPrice.unitPrice} ₽</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Количество:</span>
                    <span className="font-semibold text-gray-900">{calculatedPrice.quantity} шт</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Промежуточная сумма:</span>
                    <span className="font-semibold text-gray-900">{calculatedPrice.subtotal} ₽</span>
                  </div>

                  {calculatedPrice.discount > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-green-600">Скидка:</span>
                      <span className="font-semibold text-green-600">-{Math.round(calculatedPrice.discount)} ₽</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-6 bg-gray-50 px-6 rounded-md mt-6">
                    <span className="text-lg font-semibold text-gray-900">Итоговая стоимость:</span>
                    <span className="text-3xl font-bold text-gray-900">{calculatedPrice.total} ₽</span>
                  </div>

                  <div className="pt-6 space-y-4">
                    <p className="text-sm text-gray-500">
                      * Это предварительный расчет. Точная стоимость определяется после обсуждения деталей заказа.
                    </p>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-md transition-colors font-medium">
                      Оформить заказ
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-12 border border-gray-200 rounded-md text-center h-full flex flex-col items-center justify-center">
                <Calculator className="text-gray-400 mb-4" size={64} strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Заполните форму</h3>
                <p className="text-gray-500">Укажите параметры заказа для расчета стоимости</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;