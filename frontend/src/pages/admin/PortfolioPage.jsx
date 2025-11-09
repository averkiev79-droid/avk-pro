import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { portfolio as mockPortfolio } from '../../mock';
import { toast } from 'sonner';

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    category: '',
    description: '',
    items: [],
    image: '',
    year: new Date().getFullYear().toString()
  });

  const filteredPortfolio = portfolio.filter(project =>
    project.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProject) {
      setPortfolio(portfolio.map(p => 
        p.id === editingProject.id 
          ? { ...formData, id: editingProject.id, items: formData.items.filter(item => item.trim()) }
          : p
      ));
      toast.success('Проект обновлен');
    } else {
      const newProject = {
        ...formData,
        id: Math.max(...portfolio.map(p => p.id)) + 1,
        items: formData.items.filter(item => item.trim())
      };
      setPortfolio([...portfolio, newProject]);
      toast.success('Проект добавлен');
    }
    
    resetForm();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      teamName: project.teamName,
      category: project.category,
      description: project.description,
      items: [...project.items, '', '', ''], // Добавляем пустые поля для редактирования
      image: project.image,
      year: project.year
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (projectId) => {
    setPortfolio(portfolio.filter(p => p.id !== projectId));
    toast.success('Проект удален');
  };

  const resetForm = () => {
    setFormData({
      teamName: '',
      category: '',
      description: '',
      items: ['', '', ''],
      image: '',
      year: new Date().getFullYear().toString()
    });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const updateItem = (index, value) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({...formData, items: newItems});
  };

  const addItem = () => {
    setFormData({...formData, items: [...formData.items, '']});
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({...formData, items: newItems});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление портфолио</h1>
          <p className="text-gray-600">Добавляйте и редактируйте выполненные проекты</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-sport-blue hover:bg-sport-red">
              <Plus size={16} className="mr-2" />
              Добавить проект
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Редактировать проект' : 'Добавить новый проект'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Название команды</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="нпр. 'Детская команда'"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание проекта</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Выполненные работы</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder={`Работа ${index + 1}`}
                    />
                    {formData.items.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} className="mr-1" />
                  Добавить работу
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">URL изображения</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Год выполнения</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-sport-blue hover:bg-sport-red">
                  {editingProject ? 'Обновить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Поиск проектов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPortfolio.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img 
                src={project.image} 
                alt={project.teamName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">{project.category}</Badge>
                <span className="text-sm text-gray-500">{project.year}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{project.teamName}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Выполненные работы:</h4>
                <div className="flex flex-wrap gap-1">
                  {project.items.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                  <Edit size={14} className="mr-1" />
                  Изменить
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)} className="text-red-600 hover:bg-red-50">
                  <Trash2 size={14} className="mr-1" />
                  Удалить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredPortfolio.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Проекты не найдены</p>
        </Card>
      )}
    </div>
  );
};

export default PortfolioPage;