import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Upload, Send, CheckCircle } from 'lucide-react';

const OrderFormPage = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    teamName: '',
    address: '',
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productType: '',
    sizeCategory: 'adult',
    quantity: '10',
    price: 0
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productTypes = [
    { id: 'jersey', name: 'Хоккейное джерси', basePrice: 3500 },
    { id: 'socks', name: 'Хоккейные гамаши', basePrice: 800 },
    { id: 'training', name: 'Тренировочная форма', basePrice: 2800 },
    { id: 'accessories', name: 'Чехлы для шорт', basePrice: 1200 },
    { id: 'outerwear', name: 'Верхняя одежда', basePrice: 4500 }
  ];

  const sizeCategories = [
    { id: 'kids', name: 'Дети 110-140' },
    { id: 'teens', name: 'Подростки 146-170' },
    { id: 'adult', name: 'Взрослые' }
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addItem = () => {
    if (!currentItem.productType) {
      toast.error('Выберите тип товара');
      return;
    }

    const quantity = parseInt(currentItem.quantity);
    if (quantity < 10) {
      toast.error('Минимальное количество - 10 штук');
      return;
    }

    const product = productTypes.find(p => p.id === currentItem.productType);
    const newItem = {
      id: Date.now(),
      product_name: product.name,
      quantity: quantity,
      size_category: sizeCategories.find(s => s.id === currentItem.sizeCategory)?.name,
      price: product.basePrice * quantity
    };

    setItems([...items, newItem]);
    setCurrentItem({
      productType: '',
      sizeCategory: 'adult',
      quantity: '10',
      price: 0
    });
    toast.success('Товар добавлен');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Товар удален');
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error('Заполните обязательные поля', {
        description: 'Имя, телефон и email обязательны'
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Добавьте хотя бы один товар');
      return;
    }

    if (!customerInfo.address) {
      toast.error('Укажите адрес доставки');
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        shipping_address: customerInfo.address,
        order_notes: customerInfo.notes ? `Команда: ${customerInfo.teamName}. ${customerInfo.notes}` : `Команда: ${customerInfo.teamName}`,
        items: items.map(item => ({
          product_name: item.product_name,
          quantity: item.quantity,
          size_category: item.size_category,
          price: item.price / item.quantity
        })),
        total_amount: calculateTotal()
      };

      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        toast.success('Заказ оформлен!', {
          description: 'Проверьте email для подтверждения'
        });

        // Reset form after 5 seconds
        setTimeout(() => {
          setCustomerInfo({
            name: '',
            phone: '',
            email: '',
            teamName: '',
            address: '',
            notes: ''
          });
          setItems([]);
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(result.message || 'Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Ошибка отправки заказа', {
        description: error.message || 'Попробуйте снова'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            Оформление <span className="italic font-serif text-gray-700">заказа</span>
          </h1>
          <p className="text-lg text-gray-600">Заполните форму, и мы свяжемся с вами для уточнения деталей</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="p-12 text-center bg-white border border-gray-200 rounded-md">
              <CheckCircle className="text-green-500 mx-auto mb-6" size={64} strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">Спасибо за заявку!</h2>
              <p className="text-gray-600 mb-2 text-lg">Ваша заявка принята в работу.</p>
              <p className="text-gray-600">Наш менеджер свяжется с вами в течение 1 рабочего дня.</p>
            </div>
          ) : (
            <div className="p-8 bg-white border border-gray-200 rounded-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Контактная информация */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200 text-gray-900">Контактная информация</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-900">Ваше имя *</Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        required
                        className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        required
                        className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                      className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="teamName" className="text-sm font-medium text-gray-900">Название команды</Label>
                    <Input
                      id="teamName"
                      placeholder="Хоккейный клуб СПб"
                      value={customerInfo.teamName}
                      onChange={(e) => setCustomerInfo({...customerInfo, teamName: e.target.value})}
                      className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-900">Адрес доставки *</Label>
                    <Input
                      id="address"
                      placeholder="г. Санкт-Петербург, ул. Ленина, д. 1"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      required
                      className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {/* Детали заказа */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200 text-gray-900">Детали заказа</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productType" className="text-sm font-medium text-gray-900">Что хотите заказать? *</Label>
                      <Select 
                        value={formData.productType} 
                        onValueChange={(value) => setFormData({...formData, productType: value})}
                      >
                        <SelectTrigger className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900">
                          <SelectValue placeholder="Выберите товар" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jersey">Хоккейные джерси</SelectItem>
                          <SelectItem value="socks">Гамаши</SelectItem>
                          <SelectItem value="training">Тренировочная форма</SelectItem>
                          <SelectItem value="accessories">Чехлы для шорт</SelectItem>
                          <SelectItem value="bomber">Бомбер</SelectItem>
                          <SelectItem value="parka">Парка</SelectItem>
                          <SelectItem value="vest">Жилетка</SelectItem>
                          <SelectItem value="custom">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-gray-900">Количество *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                        className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-900">Описание заказа</Label>
                    <Textarea
                      id="description"
                      placeholder="Укажите пожелания к дизайну, цвета, размеры и другие детали..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {/* Загрузка логотипа */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200 text-gray-900">Логотип команды</h3>
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-sm font-medium text-gray-900">Загрузить логотип</Label>
                    <div className="flex items-center gap-4">
                      <label 
                        htmlFor="logo" 
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer rounded-md transition-colors font-medium"
                      >
                        <Upload size={18} strokeWidth={1.5} />
                        <span className="text-sm">Выбрать файл</span>
                      </label>
                      {logoFileName && (
                        <span className="text-sm text-gray-600 font-medium">{logoFileName}</span>
                      )}
                    </div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*,.pdf,.ai,.eps"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF, AI, EPS. Максимальный размер: 5 МБ</p>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-7 text-base rounded-md transition-colors font-medium"
                  >
                    <Send className="mr-2" size={20} strokeWidth={1.5} />
                    Отправить заявку
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;