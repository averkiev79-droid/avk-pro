# Инструкция по деплою на production (avk-pro.ru)

## Что было изменено в этом релизе:

### 1. Система управления вариантами товаров
- ✅ Backend: Модели `ProductVariant` и `ProductImage` для управления вариантами и привязкой фотографий
- ✅ Admin Panel: UI для создания вариантов (название + технический рисунок), загрузка фото с привязкой к варианту и размеру
- ✅ Public Page: Динамическая галерея изображений, фильтрация по варианту и категории размера

### 2. Удаление фотографий из Медиа
- ✅ Backend: Endpoint `DELETE /api/uploads/{filename}`
- ✅ Frontend: Кнопка удаления для каждого файла в админ-панели

### 3. Яндекс.Метрика
- ✅ Добавлен счетчик Яндекс.Метрики (ID: 105497832) в `public/index.html`

### 4. Исправления
- ✅ Поле `technical_image` в модели `ProductVariant` сделано опциональным для обратной совместимости
- ✅ Исправлена ошибка загрузки товаров из-за отсутствующих полей у старых товаров

## Шаги деплоя на production:

### Вариант 1: Через Git (рекомендуется)

**Шаг 1:** Сохраните изменения в Git
- Используйте кнопку **"Save to Github"** в интерфейсе чата Emergent
- Или вручную выполните:
```bash
git add .
git commit -m "feat: добавлена система вариантов товаров, удаление медиа, Яндекс.Метрика"
git push origin main
```

**Шаг 2:** Подключитесь к production серверу
```bash
ssh user@avk-pro.ru
```

**Шаг 3:** Перейдите в директорию проекта
```bash
cd /var/www/avk-pro
```

**Шаг 4:** Обновите код
```bash
git pull origin main
```

**Шаг 5:** Обновите зависимости и соберите frontend
```bash
cd frontend
yarn install
yarn build
cd ..
```

**Шаг 6:** Обновите backend зависимости
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

**Шаг 7:** Перезапустите сервисы
```bash
sudo supervisorctl restart all
```

**Шаг 8:** Проверьте статус
```bash
sudo supervisorctl status
```

Все сервисы должны быть в статусе `RUNNING`.

### Вариант 2: Ручной перенос файлов

Если Git недоступен, скопируйте измененные файлы:

**Backend:**
- `/var/www/avk-pro/backend/models.py`
- `/var/www/avk-pro/backend/server.py`

**Frontend:**
- `/var/www/avk-pro/frontend/public/index.html`
- `/var/www/avk-pro/frontend/src/pages/admin/ProductsPage.jsx`
- `/var/www/avk-pro/frontend/src/pages/admin/MediaPage.jsx`
- `/var/www/avk-pro/frontend/src/pages/ProductDetailPage.jsx`

Затем выполните шаги 5-8 из Варианта 1.

## Проверка работоспособности:

1. **Яндекс.Метрика:**
   - Откройте https://avk-pro.ru
   - Проверьте в консоли браузера (F12), что нет ошибок, связанных с `ym`
   - Зайдите в панель Яндекс.Метрики и убедитесь, что счетчик получает данные

2. **Система вариантов:**
   - Зайдите в админ-панель: https://avk-pro.ru/admin/products
   - Создайте тестовый товар с вариантами
   - Откройте публичную страницу товара и проверьте фильтрацию изображений

3. **Удаление медиа:**
   - Зайдите в https://avk-pro.ru/admin/media
   - Убедитесь, что у каждого файла есть красная кнопка корзины
   - Попробуйте удалить тестовый файл

4. **Общая работоспособность:**
   - Проверьте загрузку главной страницы
   - Проверьте каталог товаров
   - Проверьте добавление товара в корзину

## В случае проблем:

**Проверка логов backend:**
```bash
tail -f /var/log/supervisor/backend.err.log
```

**Проверка логов frontend:**
```bash
tail -f /var/log/supervisor/frontend.err.log
```

**Откат изменений (если что-то пошло не так):**
```bash
cd /var/www/avk-pro
git reset --hard HEAD~1
sudo supervisorctl restart all
```

## Контакты для поддержки:
- Документация Emergent: https://docs.emergent.sh
- Support: support@emergent.sh

---
**Дата релиза:** 24 ноября 2024
**Версия:** 2.1.0
