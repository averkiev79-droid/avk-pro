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
import ImageUploadGuidelines from '../../components/ImageUploadGuidelines';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Массовые действия с товарами
  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Выберите товары');
      return;
    }

    const actionNames = {
      'delete': 'удалить',
      'active': 'перевести в наличие',
      'pre_order': 'перевести под заказ',
      'popular': 'сделать популярными',
      'unpublished': 'снять с публикации'
    };

    if (action === 'delete' && !window.confirm(`Вы уверены, что хотите ${actionNames[action]} ${selectedProducts.length} товаров?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${backendUrl}/api/products/bulk-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: selectedProducts,
          action: action
        })
      });

      if (!response.ok) throw new Error('Failed to perform bulk action');

      const data = await response.json();
      toast.success(data.message || `Действие выполнено`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error('Ошибка при выполнении действия');
    } finally {
      setIsDeleting(false);
    }
  };

  // Выбор/снятие выбора товара
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Выбрать/снять все
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine uploaded images and manual URLs
    const validUrls = imageUrls.filter(url => url.trim() !== '');
    const allImages = [...uploadedImages, ...validUrls];
    
    const productData = {
      ...formData,
      base_price: parseFloat(formData.base_price),
      images: allImages
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
    // Separate uploaded images (full URLs) from external URLs
    const images = product.images || [];
    const uploaded = images.filter(url => url.includes(backendUrl));
    const external = images.filter(url => !url.includes(backendUrl));
    setUploadedImages(uploaded);
    setImageUrls(external.length > 0 ? external : []);
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
    setImageUrls([]);
    setUploadedImages([]);
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${backendUrl}/api/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        
        const data = await response.json();
        return `${backendUrl}${data.url}`;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success(`${files.length} изображений загружено`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Ошибка загрузки изображений');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveUploadedImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
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
          {filteredProducts.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:underline mt-1"
            >
              {selectedProducts.length === filteredProducts.length ? 'Снять выбор со всех' : 'Выбрать все'}
            </button>
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-gray-900 hover:bg-gray-800 text-white">
              <Plus size={16} className="mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="product-form-description">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
            </DialogHeader>
            <p id="product-form-description" className="sr-only">
              Форма для добавления или редактирования товара в каталоге
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
              
              <ImageUploadGuidelines variant="product" />
              
              <div className="space-y-3">
                <Label className="text-base font-semibold">Изображения товара</Label>
                
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors bg-gray-50">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFiles}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {uploadingFiles ? '⏳ Загрузка...' : '📁 Загрузить изображения'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF до 10MB | Можно выбрать несколько
                    </p>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">✅ Загружено: {uploadedImages.length} фото</p>
                    <div className="grid grid-cols-5 gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Фото ${index + 1}`}
                            className="w-full h-20 object-cover rounded border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center py-0.5">
                              Главное
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual URL Input Section - Collapsed by default */}
                <details className="border rounded-md p-3 bg-white">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Plus size={14} />
                    Добавить изображения через URL (опционально)
                  </summary>
                  <div className="space-y-2 mt-3">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={handleAddImageUrl}
                      className="h-8 text-xs w-full"
                    >
                      <Plus size={12} className="mr-1" />
                      Добавить поле URL
                    </Button>
                    {imageUrls.length > 0 && (
                      <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={url}
                              onChange={(e) => handleImageUrlChange(index, e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="text-xs h-8"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveImageUrl(index)}
                              className="flex-shrink-0 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
                
                <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
                  💡 <strong>Совет:</strong> Первое изображение будет отображаться как главное в каталоге
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
        <div className="flex flex-wrap gap-4 items-center">
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

          {selectedProducts.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handleBulkAction('active')}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs px-3 py-1 h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              >
                В наличии
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('pre_order')}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs px-3 py-1 h-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
              >
                Под заказ
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('popular')}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs px-3 py-1 h-8 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
              >
                Популярное
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('unpublished')}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs px-3 py-1 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
              >
                Снять с публикации
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs px-3 py-1 h-8"
              >
                <Trash2 size={14} />
                Удалить
              </Button>
              <span className="text-xs text-gray-600 flex items-center px-2">
                Выбрано: {selectedProducts.length}
              </span>
            </div>
          )}
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
            <Card key={product.id} className="overflow-hidden relative">
              {/* Чекбокс для выбора */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
                />
              </div>
              
              <div className="aspect-square bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img 
                      src={
                        typeof product.images[0] === 'string' 
                          ? (product.images[0].startsWith('http') ? product.images[0] : `${BACKEND_URL}${product.images[0]}`)
                          : (product.images[0]?.url || '/placeholder-image.jpg')
                      }
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