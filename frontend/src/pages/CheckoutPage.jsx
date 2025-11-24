import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, ShoppingCart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    teamName: '',
    deliveryAddress: '',
    notes: ''
  });

  useEffect(() => {
    // Загрузка корзины из localStorage с задержкой для надежности
    const loadCart = async () => {
      // Небольшая задержка для гарантии, что localStorage доступен
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        console.log('CheckoutPage: Loading cart from localStorage');
        const savedCart = localStorage.getItem('cart');
        console.log('CheckoutPage: savedCart:', savedCart);
        
        if (savedCart) {
          const cart = JSON.parse(savedCart);
          console.log('CheckoutPage: parsed cart:', cart, 'length:', cart.length);
          
          if (cart.length === 0) {
            console.log('CheckoutPage: Cart is empty');
            setCartError(true);
            setIsLoading(false);
            return;
          }
          console.log('CheckoutPage: Setting cart items:', cart);
          setCartItems(cart);
        } else {
          console.log('CheckoutPage: No cart in localStorage');
          setCartError(true);
        }
      } catch (error) {
        console.error('CheckoutPage: Error loading cart:', error);
        setCartError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail) {
      toast.error('Заполните обязательные поля: имя, телефон и email');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail || '',
        shipping_address: formData.deliveryAddress || '',
        order_notes: `Команда: ${formData.teamName || 'Не указана'}. ${formData.notes || ''}`,
        items: cartItems.map(item => ({
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size_category: item.sizeCategoryName || item.sizeCategory,
          color: item.color
        })),
        total_amount: totalAmount
      };

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Очистить корзину
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        
        setIsSubmitted(true);
        toast.success('Заказ успешно оформлен!');
        
        // Через 3 секунды перенаправить на главную
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error('Ошибка при оформлении заказа');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Ошибка при отправке заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="checkout-page bg-white min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <CheckCircle className="mx-auto mb-6 text-green-600" size={80} />
          <h2 className="text-3xl font-bold mb-4">Заказ оформлен!</h2>
          <p className="text-gray-600 mb-6">
            Мы получили ваш заказ и свяжемся с вами в ближайшее время для подтверждения деталей.
          </p>
          <p className="text-sm text-gray-500">
            Перенаправление на главную страницу...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="checkout-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            <span className="italic font-serif text-gray-700">Оформление заказа</span>
          </h1>
          <p className="text-lg text-gray-600">Заполните данные для оформления заказа</p>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
            <p className="mt-4 text-gray-600">Загрузка данных заказа...</p>
          </Card>
        ) : cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
            <Button asChild>
              <a href="/catalog">Перейти в каталог</a>
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Форма */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Контактные данные</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Контактное лицо *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Телефон *</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="teamName">Название команды</Label>
                    <Input
                      id="teamName"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      placeholder="Хоккейный клуб"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Адрес доставки</Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Укажите адрес доставки"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Комментарий к заказу</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Дополнительная информация"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Итого */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b">
                      <img 
                        src={item.image || '/images/placeholder.svg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md bg-gray-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.sizeCategoryName} • {item.color}
                        </p>
                        <p className="text-sm">
                          {item.quantity} шт × {item.price} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт)</span>
                      <span className="font-medium">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Итого</span>
                        <span className="text-gray-900">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-900 p-4 mb-6 rounded-md">
                  <p className="text-sm text-gray-700">
                    ℹ️ Финальная стоимость будет уточнена менеджером после оформления заказа
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg"
                >
                  {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
                </Button>
              </Card>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
