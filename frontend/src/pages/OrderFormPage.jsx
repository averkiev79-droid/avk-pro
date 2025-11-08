import { useState } from 'react';
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
      <section className="bg-sport-red text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-light mb-4">Оформление заказа</h1>
          <p className="text-lg opacity-90">Заполните форму, и мы свяжемся с вами для уточнения деталей</p>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <Card className="p-12 text-center border-none bg-white">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h2 className="text-3xl font-light mb-4 text-sport-blue">Спасибо за заявку!</h2>
              <p className="text-gray-600 mb-2">Ваша заявка принята в работу.</p>
              <p className="text-gray-600">Наш менеджер свяжется с вами в течение 1 рабочего дня.</p>
            </Card>
          ) : (
            <Card className="p-8 border-none bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Контактная информация */}
                <div>
                  <h3 className="text-xl font-light mb-4 pb-2 border-b border-gray-200">Контактная информация</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя *</Label>
                      <Input
                        id="name"
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="email">Email (опционально)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="teamName">Название команды (опционально)</Label>
                    <Input
                      id="teamName"
                      placeholder="Хоккейный клуб СПб"
                      value={formData.teamName}
                      onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Детали заказа */}
                <div>
                  <h3 className="text-xl font-light mb-4 pb-2 border-b border-gray-200">Детали заказа</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productType">Что хотите заказать? *</Label>
                      <Select 
                        value={formData.productType} 
                        onValueChange={(value) => setFormData({...formData, productType: value})}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="quantity">Количество *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="description">Описание заказа (опционально)</Label>
                    <Textarea
                      id="description"
                      placeholder="Укажите пожелания к дизайну, цвета, размеры и другие детали..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Загрузка логотипа */}
                <div>
                  <h3 className="text-xl font-light mb-4 pb-2 border-b border-gray-200">Логотип команды</h3>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Загрузить логотип (опционально)</Label>
                    <div className="flex items-center gap-4">
                      <label 
                        htmlFor="logo" 
                        className="flex items-center gap-2 px-4 py-2 bg-light hover:bg-taupe cursor-pointer rounded-lg transition-colors border border-gray-300"
                      >
                        <Upload size={18} className="text-dark" />
                        <span className="text-sm">Выбрать файл</span>
                      </label>
                      {logoFileName && (
                        <span className="text-sm text-gray-600">{logoFileName}</span>
                      )}
                    </div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*,.pdf,.ai,.eps"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, AI, EPS. Макс. 5 МБ</p>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-sport-blue hover:bg-sport-red text-white py-6 text-lg transition-colors"
                  >
                    <Send className="mr-2" size={20} />
                    Отправить заявку
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;