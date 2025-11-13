import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Edit, Trash2, Search, X, Upload, Image as ImageIcon } from 'lucide-react';
import { categories } from '../../mock';
import { toast } from 'sonner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    base_price: '',
    features: []
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty image URLs
    const validImages = imageUrls.filter(url => url.trim() !== '');
    
    const productData = {
      ...formData,
      base_price: parseFloat(formData.base_price),
      images: validImages
    };

    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`${backendUrl}/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to update product');
        toast.success('Товар обновлен');
      } else {
        // Create new product
        const response = await fetch(`${backendUrl}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to create product');
        toast.success('Товар добавлен');
      }
      
      // Refresh products list
      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ошибка сохранения товара');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      base_price: product.base_price.toString(),
      features: product.features || []
    });
    setImageUrls(product.images && product.images.length > 0 ? product.images : ['']);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      toast.success('Товар удален');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ошибка удаления товара');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', base_price: '', features: [] });
    setImageUrls(['']);
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление продукцией</h1>
          <p className="text-gray-600">Добавляйте, редактируйте и удаляйте товары</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-sport-blue hover:bg-sport-red">
              <Plus size={16} className="mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название товара</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Базовая цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Изображения товара</Label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={handleAddImageUrl}
                    className="h-8"
                  >
                    <Plus size={14} className="mr-1" />
                    Добавить фото
                  </Button>
                </div>
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder={`URL изображения ${index + 1}`}
                      />
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="flex-shrink-0 text-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Первое изображение будет использоваться как основное
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-sport-blue hover:bg-sport-red">
                  {editingProduct ? 'Обновить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Загрузка товаров...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        +{product.images.length - 1} фото
                      </Badge>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={48} />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{getCategoryName(product.category)}</Badge>
                  <span className="text-lg font-bold text-gray-900">₽{product.base_price}</span>
                </div>
                
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="bg-gray-900 text-white hover:bg-gray-800">
                    <Edit size={14} className="mr-1" />
                    Изменить
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50 border-red-200">
                    <Trash2 size={14} className="mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Товары не найдены</p>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;