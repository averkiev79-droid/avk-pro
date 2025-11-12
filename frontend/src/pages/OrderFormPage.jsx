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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    teamName: '',
    productType: '',
    quantity: '',
    description: '',
    logo: null
  });

  const [logoFileName, setLogoFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Файл слишком большой', {
          description: 'Максимальный размер файла 5 МБ'
        });
        return;
      }
      setFormData({...formData, logo: file});
      setLogoFileName(file.name);
      toast.success('Логотип загружен', {
        description: file.name
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.productType || !formData.quantity) {
      toast.error('Заполните обязательные поля', {
        description: 'Имя, телефон, тип товара и количество обязательны'
      });
      return;
    }

    // Mock submission
    console.log('Order form data:', formData);
    setIsSubmitted(true);
    toast.success('Заявка отправлена!', {
      description: 'Мы свяжемся с вами в ближайшее время'
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        teamName: '',
        productType: '',
        quantity: '',
        description: '',
        logo: null
      });
      setLogoFileName('');
      setIsSubmitted(false);
    }, 3000);
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
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="teamName" className="text-sm font-medium text-gray-900">Название команды</Label>
                    <Input
                      id="teamName"
                      placeholder="Хоккейный клуб СПб"
                      value={formData.teamName}
                      onChange={(e) => setFormData({...formData, teamName: e.target.value})}
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
                    <Label htmlFor="description" className="text-sm font-medium text-gray-900">Описание заказа (опционально)</Label>
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
                    <Label htmlFor="logo" className="text-sm font-medium text-gray-900">Загрузить логотип (опционально)</Label>
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