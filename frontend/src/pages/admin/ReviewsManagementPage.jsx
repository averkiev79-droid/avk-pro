import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ReviewsManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    role: '',
    text: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    verified: true
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReview) {
        await axios.put(`${BACKEND_URL}/api/reviews/${editingReview.id}`, formData);
        toast.success('Отзыв обновлен');
      } else {
        await axios.post(`${BACKEND_URL}/api/reviews`, formData);
        toast.success('Отзыв добавлен');
      }
      
      fetchReviews();
      resetForm();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Ошибка сохранения отзыва');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот отзыв?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/reviews/${id}`);
      toast.success('Отзыв удален');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Ошибка удаления отзыва');
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setFormData({
      author: review.author,
      role: review.role,
      text: review.text,
      rating: review.rating,
      date: review.date,
      verified: review.verified
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingReview(null);
    setShowAddForm(false);
    setFormData({
      author: '',
      role: '',
      text: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      verified: true
    });
  };

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Управление отзывами</h1>
          <p className="text-gray-600">Добавление, редактирование и удаление отзывов</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-sport-blue hover:bg-sport-red text-white"
        >
          <Plus size={20} className="mr-2" />
          Добавить отзыв
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="p-6 mb-8 border-2 border-sport-blue">
          <h2 className="text-xl font-bold mb-4">
            {editingReview ? 'Редактировать отзыв' : 'Новый отзыв'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Автор *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  required
                  placeholder="Имя автора"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Должность/Роль *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                  placeholder="Тренер ДЮСШ"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text">Текст отзыва *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                required
                rows={4}
                placeholder="Текст отзыва..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Рейтинг *</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} звезд</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Проверенный отзыв</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-sport-blue hover:bg-sport-red text-white">
                <Check size={18} className="mr-2" />
                {editingReview ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <X size={18} className="mr-2" />
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200">
            <p className="text-gray-500">Нет отзывов</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{review.author}</h3>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        ✓ Проверено
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{review.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(review)}
                    className="border-gray-300"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="fill-sport-orange text-sport-orange" size={16} />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsManagementPage;
