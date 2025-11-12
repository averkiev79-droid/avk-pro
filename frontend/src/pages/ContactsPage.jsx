import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { companyInfo } from '../mock';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Заполните обязательные поля');
      return;
    }

    console.log('Contact form:', formData);
    toast.success('Сообщение отправлено!', {
      description: 'Мы свяжемся с вами в ближайшее время'
    });

    setFormData({
      name: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="contacts-page bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-gray-900">
            <span className="italic font-serif text-gray-700">Свяжитесь</span> с нами
          </h1>
          <p className="text-lg text-gray-600">Мы всегда готовы ответить на ваши вопросы</p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto py-20 px-4 mb-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Контактная информация */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Телефон</h3>
                  <a href={`tel:${companyInfo.phone}`} className="text-gray-900 hover:text-gray-600 transition-colors text-xl font-medium">
                    {companyInfo.phone}
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Позвоните нам в рабочее время</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-md border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
                  <Mail className="text-white" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Email</h3>
                  <a href={`mailto:${companyInfo.email}`} className="text-gray-900 hover:text-gray-600 transition-colors text-xl font-medium break-all">
                    {companyInfo.email}
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Напишите нам письмо</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-md border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Адрес</h3>
                  <p className="text-gray-900 text-xl font-medium mb-2">{companyInfo.address}</p>
                  <p className="text-sm text-gray-600">Приезжайте к нам в офис</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-md border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Режим работы</h3>
                  <p className="text-gray-900 text-xl font-medium">{companyInfo.workHours}</p>
                </div>
              </div>
            </div>

            {/* Карта */}
            <div className="overflow-hidden rounded-md border border-gray-200">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A5f8e3c3c8c8e8c8e8c8e8c8e8c8e8c8e&amp;source=constructor"
                width="100%"
                height="400"
                frameBorder="0"
                className="w-full"
                title="Карта"
              ></iframe>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div>
            <div className="bg-white p-8 sm:p-10 border border-gray-200 rounded-md sticky top-24">
              <h2 className="text-3xl font-bold mb-8 tracking-tight">Напишите <span className="italic font-serif">нам</span></h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-900">Сообщение</Label>
                  <Textarea
                    id="message"
                    placeholder="Расскажите о вашем запросе..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-base rounded-md transition-colors font-medium"
                >
                  <Send className="mr-2" size={18} strokeWidth={1.5} />
                  Отправить сообщение
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;