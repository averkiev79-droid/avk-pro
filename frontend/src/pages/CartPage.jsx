import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const CartPage = () => {
  // Загрузка корзины из localStorage
  const getInitialCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('CartPage: Loading cart from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('CartPage: Error loading cart:', error);
    }
    // Возвращаем пустую корзину
    console.log('CartPage: No cart in localStorage, returning empty array');
    return [];
  };

  const [cartItems, setCartItems] = useState(getInitialCart);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка корзины после монтирования компонента (для надежности)
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        console.log('CartPage: useEffect checking localStorage:', savedCart);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          console.log('CartPage: useEffect parsed cart:', parsed);
          setCartItems(parsed);
        }
      } catch (error) {
        console.error('CartPage: useEffect error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
    
    // Слушаем события обновления корзины
    const handleCartUpdate = () => {
      console.log('CartPage: cartUpdated event received');
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (!isLoading) {
      console.log('CartPage: Saving cart to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // Dispatch custom event to update header cart count
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isLoading]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 10) {
      toast.error('Минимальное количество - 10 штук', {
        duration: 2000,
      });
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast.success(`${itemToRemove?.name} удален из корзины`, {
      duration: 2000,
    });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            <span className="italic font-serif text-gray-700">Корзина</span>
          </h1>
          <p className="text-lg text-gray-600">Оформите заказ или продолжите покупки</p>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        {cartItems.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200 bg-white">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 rounded-md font-medium">
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4 sm:p-6 border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <img 
                      src={item.image || '/images/placeholder.svg'} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{item.name}</h3>
                      <p className="text-gray-900 font-bold text-lg mb-4">{item.price} ₽ / шт</p>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="border-gray-300 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </Button>
                          <Input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 10)}
                            className="w-20 text-center border-gray-300"
                            min="10"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="border-gray-300 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <span className="text-xl font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Итого */}
            <div className="lg:col-span-1">
              <Card className="p-6 border border-gray-200 bg-white sticky top-24 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Итого</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт)</span>
                    <span className="font-medium">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Сумма</span>
                      <span className="text-gray-900">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-900 p-4 mb-6 rounded-md">
                  <p className="text-sm text-gray-700">
                    ℹ️ Финальная стоимость будет рассчитана после согласования деталей заказа
                  </p>
                </div>

                <Button 
                  asChild
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg transition-all duration-300 mb-3 rounded-md font-medium"
                >
                  <Link to="/checkout" className="flex items-center justify-center gap-2">
                    Оформить заказ <ArrowRight size={20} />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-md font-medium"
                >
                  <Link to="/catalog">Продолжить покупки</Link>
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
