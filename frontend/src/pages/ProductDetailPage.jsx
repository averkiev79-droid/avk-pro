import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { categories } from '../mock';
import { 
  ChevronLeft,
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
import { useBreadcrumbs } from '../context/BreadcrumbsContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { setBreadcrumb, clearBreadcrumb } = useBreadcrumbs();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(10);
  const [selectedSizeCategory, setSelectedSizeCategory] = useState('adult');
  const [selectedColor, setSelectedColor] = useState('Синий');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle swipe gestures on mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next image
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous image
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  // Fetch product on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProduct();
    fetchProducts();
    
    // Cleanup breadcrumb on unmount
    return () => {
      clearBreadcrumb(`/product/${id}`);
    };
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
      // Set breadcrumb with product name
      setBreadcrumb(`/product/${id}`, data.name);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/products?is_active=true`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

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
  
  // Use product images or fallback to placeholder
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  
  // Получить изображения в зависимости от выбранной категории размера
  const getSizeCategoryImages = () => {
    // Если есть изображения для конкретной категории размера
    if (product.size_category_images && product.size_category_images[selectedSizeCategory]?.length > 0) {
      return product.size_category_images[selectedSizeCategory].map(img => 
        img.startsWith('http') ? img : `${BACKEND_URL}${img}`
      );
    }
    // Fallback на общие изображения или для взрослых
    if (product.size_category_images && product.size_category_images['adults']?.length > 0) {
      return product.size_category_images['adults'].map(img => 
        img.startsWith('http') ? img : `${BACKEND_URL}${img}`
      );
    }
    // Fallback на images
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.startsWith('http') ? img : `${BACKEND_URL}${img}`);
    }
    return ['/images/placeholder.svg'];
  };
  
  const images = getSizeCategoryImages();

  const sizeCategories = [
    { id: 'kids', name: 'Дети 110-140' },
    { id: 'teens', name: 'Подростки 146-170' },
    { id: 'adults', name: 'Взрослые' }
  ];
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
    
    const sizeCategoryName = sizeCategories.find(s => s.id === selectedSizeCategory)?.name;
    
    // Получить существующую корзину из localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Создать уникальный ID для товара с учетом параметров
    const cartItemId = `${product.id}_${selectedSizeCategory}_${selectedColor}`;
    
    // Проверить, есть ли уже такой товар в корзине
    const existingItemIndex = existingCart.findIndex(item => 
      item.id === cartItemId
    );
    
    if (existingItemIndex !== -1) {
      // Если товар уже есть, увеличить количество
      existingCart[existingItemIndex].quantity += quantity;
      toast.success(`Количество обновлено в корзине`, {
        description: `${product.name}: ${existingCart[existingItemIndex].quantity} шт`
      });
    } else {
      // Добавить новый товар в корзину
      const imageUrl = product.images && product.images.length > 0 && typeof product.images[0] === 'string'
        ? (product.images[0].startsWith('http') 
            ? product.images[0] 
            : `${process.env.REACT_APP_BACKEND_URL}${product.images[0]}`)
        : null;
      
      const cartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: product.base_price,
        quantity: quantity,
        sizeCategory: selectedSizeCategory,
        sizeCategoryName: sizeCategoryName,
        color: selectedColor,
        image: imageUrl
      };
      
      existingCart.push(cartItem);
      
      toast.success(`${product.name} добавлен в корзину`, {
        description: `Количество: ${quantity} шт, категория: ${sizeCategoryName}, цвет: ${selectedColor}`
      });
    }
    
    // Сохранить обновленную корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch event to update header cart count
    window.dispatchEvent(new Event('cartUpdated'));
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
      <div className="container px-4 sm:px-6 py-6 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div 
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-lg relative group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover"
              />
              
              {/* Desktop Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {/* Mobile Swipe Indicator */}
              <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === index ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-sport-blue shadow-md scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
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
                <span className="text-4xl font-bold text-gray-900">{product.base_price} ₽</span>
                <span className="text-gray-500 pb-1">/ шт</span>
              </div>
              <p className="text-sm text-gray-600">
                Итого: <span className="font-bold text-lg text-gray-900">{(product.base_price * quantity).toLocaleString('ru-RU')} ₽</span>
              </p>
            </Card>

            {/* Size Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Категория размеров: <span className="text-sport-blue font-bold">
                  {sizeCategories.find(s => s.id === selectedSizeCategory)?.name}
                </span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {sizeCategories.map(sizeCategory => (
                  <button
                    key={sizeCategory.id}
                    onClick={() => setSelectedSizeCategory(sizeCategory.id)}
                    className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-lg border-2 transition-all duration-300 font-medium text-sm sm:text-base ${
                      selectedSizeCategory === sizeCategory.id
                        ? 'bg-sport-blue text-white border-sport-blue shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-sport-blue'
                    }`}
                  >
                    {sizeCategory.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Варианты дизайна:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.variants.slice(0, 4).map((variant, index) => (
                    <button
                      key={variant.id || index}
                      onClick={() => {
                        setSelectedColor(variant.name);
                        // Change to the corresponding image if available
                        if (images[index]) {
                          setSelectedImage(index);
                        }
                      }}
                      className={`relative rounded-lg border-2 transition-all duration-300 overflow-hidden group hover:shadow-lg ${
                        selectedColor === variant.name
                          ? 'border-sport-blue ring-2 ring-sport-blue ring-offset-2 shadow-lg'
                          : 'border-gray-300 hover:border-sport-blue'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="aspect-square relative bg-gray-100">
                        <img 
                          src={variant.preview_image && typeof variant.preview_image === 'string' && variant.preview_image.startsWith('http') 
                            ? variant.preview_image 
                            : `${BACKEND_URL}${variant.preview_image}`} 
                          alt={variant.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = images[0] || '/images/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      {/* Variant name */}
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium text-gray-700 text-center truncate">
                          {variant.name}
                        </p>
                      </div>
                      
                      {/* Selected indicator */}
                      {selectedColor === variant.name && (
                        <div className="absolute top-2 right-2 bg-sport-blue text-white rounded-full p-1.5 shadow-lg">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Количество (минимум 10 штук)
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => updateQuantity(quantity - 1)}
                  className="border-2 border-gray-300 hover:bg-gray-100 px-3 sm:px-4 h-12 w-12 sm:h-auto sm:w-auto"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </Button>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 min-w-[50px] sm:min-w-[60px] text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => updateQuantity(quantity + 1)}
                  className="border-2 border-gray-300 hover:bg-gray-100 px-3 sm:px-4 h-12 w-12 sm:h-auto sm:w-auto"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 mb-6">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-sport-red hover:bg-sport-orange text-white py-5 sm:py-6 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="mr-1 sm:mr-2" size={20} />
                <span className="hidden xs:inline">Добавить в корзину</span>
                <span className="xs:hidden">В корзину</span>
              </Button>
              <Button 
                variant="outline" 
                className="px-4 sm:px-6 border-2 border-gray-300 hover:bg-slate-50"
              >
                <Heart size={20} />
              </Button>
              <Button 
                variant="outline" 
                className="px-4 sm:px-6 border-2 border-gray-300 hover:bg-slate-50"
              >
                <Share2 size={20} />
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
                {product.detailed_description ? (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.detailed_description }}
                  />
                ) : (
                  <>
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
                  </>
                )}
                
                {/* Main Features */}
                {product.main_features && product.main_features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-dark mb-3">Основные характеристики:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {product.main_features.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-bold text-dark mb-4">Технические характеристики</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="w-full border-collapse">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 font-medium text-gray-700 w-1/3">{key}:</td>
                          <td className="py-3 text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
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
                        <td className="py-3 font-medium text-gray-700">Доступные категории:</td>
                        <td className="py-3 text-gray-600">Дети 110-140, Подростки 146-170, Взрослые</td>
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
                )}
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
                        src={relProduct.images && relProduct.images.length > 0 && typeof relProduct.images[0] === 'string'
                          ? (relProduct.images[0].startsWith('http') ? relProduct.images[0] : `${BACKEND_URL}${relProduct.images[0]}`)
                          : '/images/placeholder.svg'}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold mb-2 text-gray-900 line-clamp-2">{relProduct.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relProduct.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">от {relProduct.base_price} ₽</span>
                        <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300">
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
