import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Trash2, Edit, Plus, Upload, Save, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const HockeyClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClub, setEditingClub] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    logo_url: '',
    order: 0
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hockey-clubs`);
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить клубы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, logo_url: data.url });
        toast({
          title: "Успех",
          description: "Логотип загружен",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить логотип",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hockey-clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Клуб добавлен",
        });
        fetchClubs();
        setIsCreating(false);
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить клуб",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (clubId) => {
    try {
      const response = await fetch(`${backendUrl}/api/hockey-clubs/${clubId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Клуб обновлен",
        });
        fetchClubs();
        setEditingClub(null);
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить клуб",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (clubId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот клуб?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/hockey-clubs/${clubId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Клуб удален",
        });
        fetchClubs();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить клуб",
        variant: "destructive",
      });
    }
  };

  const startEdit = (club) => {
    setEditingClub(club.id);
    setFormData({
      name: club.name,
      subtitle: club.subtitle,
      logo_url: club.logo_url || '',
      order: club.order
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      logo_url: '',
      order: 0
    });
  };

  const cancelEdit = () => {
    setEditingClub(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Хоккейные клубы</h1>
          <p className="text-gray-600 mt-2">Управление логотипами партнерских клубов</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Добавить клуб
          </Button>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="p-6 mb-8 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Новый клуб</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="СКА"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Подзаголовок *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Стрельна"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order">Порядок отображения</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="logo">Логотип</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {formData.logo_url && (
                  <img src={formData.logo_url} alt="Preview" className="w-20 h-20 object-contain border rounded" />
                )}
              </div>
              {uploading && <p className="text-sm text-gray-500 mt-2">Загрузка...</p>}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!formData.name || !formData.subtitle}>
                <Save size={16} className="mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Clubs List */}
      <div className="grid gap-4">
        {clubs.map((club) => (
          <Card key={club.id} className="p-6">
            {editingClub === club.id ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${club.id}`}>Название *</Label>
                    <Input
                      id={`name-${club.id}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`subtitle-${club.id}`}>Подзаголовок *</Label>
                    <Input
                      id={`subtitle-${club.id}`}
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`order-${club.id}`}>Порядок отображения</Label>
                  <Input
                    id={`order-${club.id}`}
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor={`logo-${club.id}`}>Логотип</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id={`logo-${club.id}`}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {formData.logo_url && (
                      <img src={formData.logo_url} alt="Preview" className="w-20 h-20 object-contain border rounded" />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(club.id)}>
                    <Save size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    <X size={16} className="mr-2" />
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {club.logo_url ? (
                    <img src={club.logo_url} alt={club.name} className="w-16 h-16 object-contain border rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 border rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Нет лого</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{club.name}</h3>
                    <p className="text-gray-600">{club.subtitle}</p>
                    <p className="text-sm text-gray-500">Порядок: {club.order}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(club)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(club.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {clubs.length === 0 && !isCreating && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Клубы не добавлены</p>
            <Button onClick={() => setIsCreating(true)} className="mt-4">
              <Plus size={16} className="mr-2" />
              Добавить первый клуб
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HockeyClubsPage;
