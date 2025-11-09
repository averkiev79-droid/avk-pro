import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  // Пример данных корзины (позже будет из состояния приложения или контекста)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Хоккейное джерси Pro',
      price: 3500,
      quantity: 10,
      image: 'https://via.placeholder.com/150x150/2C5282/ffffff?text=JERSEY'
    },
    {
      id: 2,
      name: 'Хоккейные гамаши',
      price: 800,
      quantity: 15,
      image: 'https://via.placeholder.com/150x150/2C5282/ffffff?text=SOCKS'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 10) {
      toast.error('Минимальное количество для заказа - 10 штук');
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('Товар удален из корзины');
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page bg-light min-h-screen">
      {/* Header */}
      <section className="bg-sport-blue text-white py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Корзина</h1>
          <p className="text-base sm:text-lg opacity-90">Оформите заказ или продолжите покупки</p>
        </div>
      </section>

      <div className="container py-12 px-4 sm:px-6">
        {cartItems.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200 bg-white">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
            <Button asChild className="bg-sport-blue hover:bg-sport-red text-white transition-all duration-300">
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
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-dark">{item.name}</h3>
                      <p className="text-sport-blue font-bold text-lg mb-4">{item.price} ₽ / шт</p>
                      
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
                          <span className="text-xl font-bold text-dark">
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
                      <span className="text-sport-blue">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-sport-blue p-4 mb-6 rounded">
                  <p className="text-sm text-gray-700">
                    ℹ️ Финальная стоимость будет рассчитана после согласования деталей заказа
                  </p>
                </div>

                <Button 
                  asChild
                  className="w-full bg-sport-red hover:bg-sport-orange text-white py-6 text-lg transition-all duration-300 mb-3 shadow-md hover:shadow-lg"
                >
                  <Link to="/order" className="flex items-center justify-center gap-2">
                    Оформить заказ <ArrowRight size={20} />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="w-full border-2 border-sport-blue text-sport-blue hover:bg-sport-blue hover:text-white transition-all duration-300"
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
