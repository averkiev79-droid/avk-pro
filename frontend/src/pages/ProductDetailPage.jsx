import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { products, categories } from '../mock';
import { 
  ChevronRight, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart,
  Share2,
  Check,
  Star,
  Truck,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  
  const [quantity, setQuantity] = useState(10);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Синий');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Товар не найден</h2>
        <Button asChild>
          <Link to="/catalog">Вернуться в каталог</Link>
        </Button>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category);
  
  // Моковые данные для демонстрации
  const images = [
    product.image,
    'https://via.placeholder.com/800x800/2C5282/ffffff?text=View+2',
    'https://via.placeholder.com/800x800/2C5282/ffffff?text=View+3',
    'https://via.placeholder.com/800x800/2C5282/ffffff?text=View+4'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Синий', 'Красный', 'Черный', 'Белый', 'Зеленый'];

  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const reviews = [
    {
      id: 1,
      author: 'Александр П.',
      rating: 5,
      date: '15.01.2024',
      text: 'Отличное качество! Заказывали для команды, все очень довольны. Цвета яркие, ткань дышащая.',
      verified: true
    },
    {
      id: 2,
      author: 'Мария С.',
      rating: 5,
      date: '08.01.2024',
      text: 'Второй раз заказываем у этой компании. Всё на высшем уровне - от консультации до доставки.',
      verified: true
    }
  ];

  const handleAddToCart = () => {
    if (quantity < 10) {
      toast.error('Минимальное количество для заказа - 10 штук');
      return;
    }
    toast.success(`${product.name} добавлен в корзину`, {
      description: `Количество: ${quantity} шт, размер: ${selectedSize}, цвет: ${selectedColor}`
    });
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity < 10) {
      toast.error('Минимальное количество для заказа - 10 штук');
      return;
    }
    setQuantity(newQuantity);
  };

  return (
    <div className="product-detail-page bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-gray-200">
        <div className="container px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link to="/" className="hover:text-sport-blue transition-colors">Главная</Link>
            <ChevronRight size={16} />
            <Link to="/catalog" className="hover:text-sport-blue transition-colors">Каталог</Link>
            <ChevronRight size={16} />
            <span className="text-gray-400">{category?.name}</span>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-lg">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-sport-blue shadow-md scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Features Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Truck className="text-sport-blue mb-2" size={24} />
                <span className="text-xs font-medium text-gray-700">Быстрая доставка</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Shield className="text-sport-blue mb-2" size={24} />
                <span className="text-xs font-medium text-gray-700">Гарантия качества</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Clock className="text-sport-blue mb-2" size={24} />
                <span className="text-xs font-medium text-gray-700">От 14 дней</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge className="bg-slate-100 text-gray-700 border border-gray-200 mb-3">
                {category?.name}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-dark mb-3">{product.name}</h1>
              <p className="text-gray-600 text-base leading-relaxed mb-4">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-sport-orange text-sport-orange" size={18} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(2 отзыва)</span>
              </div>
            </div>

            {/* Price */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-slate-50 to-white border-2 border-gray-200 shadow-md">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-sport-blue">{product.basePrice} ₽</span>
                <span className="text-gray-500 pb-1">/ шт</span>
              </div>
              <p className="text-sm text-gray-600">
                Итого: <span className="font-bold text-lg text-dark">{(product.basePrice * quantity).toLocaleString('ru-RU')} ₽</span>
              </p>
            </Card>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Размер: <span className="text-sport-blue font-bold">{selectedSize}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-lg border-2 transition-all duration-300 font-medium ${
                      selectedSize === size
                        ? 'bg-sport-blue text-white border-sport-blue shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-sport-blue'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Цвет: <span className="text-sport-blue font-bold">{selectedColor}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 rounded-lg border-2 transition-all duration-300 font-medium ${
                      selectedColor === color
                        ? 'bg-sport-blue text-white border-sport-blue shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-sport-blue'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Количество (минимум 10 штук)
              </label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => updateQuantity(quantity - 1)}
                  className="border-2 border-gray-300 hover:bg-gray-100 px-4"
                >
                  <Minus size={20} />
                </Button>
                <Input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => updateQuantity(parseInt(e.target.value) || 10)}
                  className="w-24 text-center text-lg font-bold border-2 border-gray-300"
                  min="10"
                />
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => updateQuantity(quantity + 1)}
                  className="border-2 border-gray-300 hover:bg-gray-100 px-4"
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-sport-red hover:bg-sport-orange text-white py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="mr-2" size={22} />
                Добавить в корзину
              </Button>
              <Button 
                variant="outline" 
                className="px-6 border-2 border-gray-300 hover:bg-slate-50"
              >
                <Heart size={22} />
              </Button>
              <Button 
                variant="outline" 
                className="px-6 border-2 border-gray-300 hover:bg-slate-50"
              >
                <Share2 size={22} />
              </Button>
            </div>

            {/* Features List */}
            <Card className="p-5 bg-slate-50 border border-gray-200">
              <h3 className="font-bold text-dark mb-3">Основные характеристики:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="text-sport-blue mt-0.5 flex-shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8 overflow-x-auto">
              {['description', 'specs', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-sport-blue border-b-2 border-sport-blue'
                      : 'text-gray-600 hover:text-sport-blue'
                  }`}
                >
                  {tab === 'description' && 'Описание'}
                  {tab === 'specs' && 'Характеристики'}
                  {tab === 'reviews' && `Отзывы (${reviews.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div className="text-gray-700 leading-relaxed">
                <h3 className="text-2xl font-bold text-dark mb-4">Подробное описание</h3>
                <p className="mb-4">
                  {product.name} - это профессиональная экипировка, изготовленная из высококачественных материалов. 
                  Идеально подходит для тренировок и соревнований любого уровня.
                </p>
                <p className="mb-4">
                  Наша технология сублимационной печати гарантирует яркость и долговечность рисунка. 
                  Дышащая ткань обеспечивает комфорт во время интенсивных тренировок.
                </p>
                <p>
                  Возможна печать вашего логотипа и номеров. Минимальная партия заказа - от 10 штук.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-bold text-dark mb-4">Технические характеристики</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Материал:</td>
                      <td className="py-3 text-gray-600">100% полиэстер</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Технология печати:</td>
                      <td className="py-3 text-gray-600">Сублимация</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Доступные размеры:</td>
                      <td className="py-3 text-gray-600">XS - XXL</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Срок изготовления:</td>
                      <td className="py-3 text-gray-600">От 14 дней</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Минимальный заказ:</td>
                      <td className="py-3 text-gray-600">10 штук</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-dark">Отзывы покупателей</h3>
                  <Button className="bg-sport-blue hover:bg-sport-red text-white transition-all duration-300">
                    Оставить отзыв
                  </Button>
                </div>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <Card key={review.id} className="p-6 border border-gray-200 bg-slate-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-dark">{review.author}</span>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-700 text-xs border-green-200">
                                <Check size={12} className="mr-1" />
                                Проверено
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="fill-sport-orange text-sport-orange" size={16} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-dark mb-8">Похожие товары</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relProduct => (
                <Link key={relProduct.id} to={`/product/${relProduct.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-white h-full">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={relProduct.image} 
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold mb-2 text-dark line-clamp-2">{relProduct.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relProduct.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-sport-blue">от {relProduct.basePrice} ₽</span>
                        <Button size="sm" className="bg-sport-red hover:bg-sport-orange text-white transition-all duration-300">
                          Смотреть
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
