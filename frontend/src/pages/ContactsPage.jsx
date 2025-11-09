import { useState } from 'react';
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
      <section className="bg-sport-red text-white py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-light mb-4">Контакты</h1>
          <p className="text-base sm:text-lg opacity-90">Свяжитесь с нами удобным для вас способом</p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Контактная информация */}
          <div className="space-y-6">
            <Card className="p-6 border-none bg-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sport-blue rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Телефон</h3>
                  <a href={`tel:${companyInfo.phone}`} className="text-sport-blue hover:text-dark transition-colors text-xl">
                    {companyInfo.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Позвоните нам в рабочее время</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none bg-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sport-blue rounded-full flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Email</h3>
                  <a href={`mailto:${companyInfo.email}`} className="text-sport-blue hover:text-dark transition-colors text-xl">
                    {companyInfo.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Напишите нам письмо</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none bg-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sport-blue rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Адрес</h3>
                  <p className="text-dark text-xl mb-1">{companyInfo.address}</p>
                  <p className="text-sm text-gray-500">Приезжайте к нам в офис</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none bg-white shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sport-blue rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-light mb-1">Режим работы</h3>
                  <p className="text-dark text-xl">{companyInfo.workHours}</p>
                </div>
              </div>
            </Card>

            {/* Карта */}
            <Card className="p-0 overflow-hidden border-none">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A5f8e3c3c8c8e8c8e8c8e8c8e8c8e8c8e&amp;source=constructor"
                width="100%"
                height="400"
                frameBorder="0"
                className="w-full"
                title="Карта"
              ></iframe>
            </Card>
          </div>

          {/* Форма обратной связи */}
          <div>
            <Card className="p-8 border-none bg-white sticky top-24">
              <h2 className="text-3xl font-light mb-6">Напишите нам</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение (опционально)</Label>
                  <Textarea
                    id="message"
                    placeholder="Расскажите о вашем запросе..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-sport-blue hover:bg-sport-red text-white py-6 text-lg transition-colors"
                >
                  <Send className="mr-2" size={20} />
                  Отправить сообщение
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;