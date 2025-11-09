import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Save, Upload } from 'lucide-react';
import { companyInfo } from '../../mock';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Основные настройки
    siteName: companyInfo.fullName,
    siteDescription: companyInfo.description,
    contactEmail: companyInfo.email,
    contactPhone: companyInfo.phone,
    address: companyInfo.address,
    workHours: companyInfo.workHours,
    logo: companyInfo.logo,
    
    // Настройки уведомлений
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    
    // Настройки магазина
    minOrderAmount: 1000,
    freeShippingThreshold: 5000,
    taxRate: 20,
    currency: '₽',
    
    // Интеграции
    analyticsId: '',
    socialMedia: {
      vk: '',
      telegram: '',
      instagram: ''
    }
  });

  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'Общие настройки' },
    { id: 'notifications', name: 'Уведомления' },
    { id: 'shop', name: 'Магазин' },
    { id: 'integrations', name: 'Интеграции' }
  ];

  const handleSave = () => {
    // Здесь будет сохранение настроек в базу данных
    console.log('Saving settings:', settings);
    toast.success('Настройки сохранены');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Название сайта</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email для связи</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Телефон</Label>
            <Input
              id="contactPhone"
              value={settings.contactPhone}
              onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workHours">Режим работы</Label>
            <Input
              id="workHours"
              value={settings.workHours}
              onChange={(e) => setSettings({...settings, workHours: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="siteDescription">Описание сайта</Label>
          <Textarea
            id="siteDescription"
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
          />
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="address">Адрес</Label>
          <Input
            id="address"
            value={settings.address}
            onChange={(e) => setSettings({...settings, address: e.target.value})}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Логотип</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
            <img src={settings.logo} alt="Логотип" className="max-w-full max-h-full" />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="logo">URL логотипа</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                value={settings.logo}
                onChange={(e) => setSettings({...settings, logo: e.target.value})}
                placeholder="https://..."
              />
              <Button variant="outline">
                <Upload size={16} className="mr-2" />
                Загрузить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Настройки уведомлений</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Уведомления по Email</div>
              <div className="text-sm text-gray-600">Получать общие уведомления</div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Уведомления о заказах</div>
              <div className="text-sm text-gray-600">Получать уведомления о новых заказах</div>
            </div>
            <Switch
              checked={settings.orderNotifications}
              onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Маркетинговые письма</div>
              <div className="text-sm text-gray-600">Получать рекламные письма</div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderShopSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Настройки магазина</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minOrderAmount">Минимальная сумма заказа (₽)</Label>
            <Input
              id="minOrderAmount"
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({...settings, minOrderAmount: parseInt(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="freeShippingThreshold">Бесплатная доставка от (₽)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({...settings, freeShippingThreshold: parseInt(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxRate">Налог (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({...settings, taxRate: parseInt(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Валюта</Label>
            <Input
              id="currency"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Аналитика</h3>
        <div className="space-y-2">
          <Label htmlFor="analyticsId">Google Analytics ID</Label>
          <Input
            id="analyticsId"
            value={settings.analyticsId}
            onChange={(e) => setSettings({...settings, analyticsId: e.target.value})}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Социальные сети</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vk">VKontakte</Label>
            <Input
              id="vk"
              value={settings.socialMedia.vk}
              onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, vk: e.target.value}})}
              placeholder="https://vk.com/..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              value={settings.socialMedia.telegram}
              onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, telegram: e.target.value}})}
              placeholder="https://t.me/..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={settings.socialMedia.instagram}
              onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, instagram: e.target.value}})}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'shop': return renderShopSettings();
      case 'integrations': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600">Управление основными настройками системы</p>
      </div>

      <Card>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-sport-blue border-b-2 border-sport-blue pb-4'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
          
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <Button onClick={handleSave} className="bg-sport-blue hover:bg-sport-red">
              <Save size={16} className="mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;