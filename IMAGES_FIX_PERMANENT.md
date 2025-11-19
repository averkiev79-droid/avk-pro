# ПОСТОЯННОЕ РЕШЕНИЕ ПРОБЛЕМЫ С ИЗОБРАЖЕНИЯМИ

## ⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА - ROOT CAUSE

### Главная проблема
Frontend использовал **НЕПРАВИЛЬНЫЙ BACKEND_URL** в production:
```
Было: https://avk-ecommerce.preview.emergentagent.com
Должно быть: https://avk-pro.ru
```

Это приводило к тому, что:
1. Все запросы изображений шли на preview домен вместо production
2. CORS блокировал запросы между разными доменами
3. Изображения не загружались на production сайте
4. После каждого deploy проблема возвращалась

### Почему проблема повторялась
При каждом deployment переменная `REACT_APP_BACKEND_URL` в `/app/frontend/.env` сбрасывалась на preview домен.

---

## ✅ ПОСТОЯННОЕ РЕШЕНИЕ

### 1. Исправлен .env файл

**Файл:** `/app/frontend/.env`

```env
REACT_APP_BACKEND_URL=https://avk-pro.ru
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

**ВАЖНО:** Этот файл должен содержать правильный production URL!

### 2. Проверка перед deployment

**Перед каждым deploy проверяйте:**

```bash
# Проверить текущий BACKEND_URL
cat /app/frontend/.env | grep REACT_APP_BACKEND_URL

# Должно быть:
REACT_APP_BACKEND_URL=https://avk-pro.ru
```

### 3. После deployment

**Если изображения не загружаются:**

```bash
# 1. Проверить BACKEND_URL
cat /app/frontend/.env | grep REACT_APP_BACKEND_URL

# 2. Если неправильный - исправить
sed -i 's|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=https://avk-pro.ru|' /app/frontend/.env

# 3. Перезапустить frontend
sudo supervisorctl restart frontend

# 4. Подождать 30 секунд
sleep 30

# 5. Очистить кеш браузера (Ctrl+Shift+Delete)

# 6. Проверить, что изображения загружаются
curl -I https://avk-pro.ru/api/uploads/fd1cd109-1d19-4b99-92fc-ef28df788c18.jpg
```

---

## 📋 ЧЕКЛИСТ ПРОВЕРКИ ИЗОБРАЖЕНИЙ

### Шаг 1: Проверка backend URL
```bash
cat /app/frontend/.env | grep REACT_APP_BACKEND_URL
```
✅ Должно быть: `https://avk-pro.ru`
❌ Если `sportstore-app.preview.emergentagent.com` - ИСПРАВИТЬ!

### Шаг 2: Проверка базы данных
```bash
mongosh test_database --quiet --eval "db.products.findOne({}, {images: 1})"
```
✅ Изображения должны быть: `/api/uploads/filename.jpg` (относительные пути)
❌ Если содержат `http://` или `https://` - запустить скрипт fix

### Шаг 3: Проверка файлов на диске
```bash
ls -lh /app/backend/uploads/ | grep -E "\.jpg|\.png|\.webp" | head -5
```
✅ Файлы должны существовать
❌ Если пусто - файлы были удалены при deploy

### Шаг 4: Проверка эндпоинта
```bash
curl -I https://avk-pro.ru/api/uploads/filename.jpg
```
✅ Должно вернуть: `HTTP/2 200`
❌ Если 404 - файл не существует
❌ Если 502/504 - backend не работает

### Шаг 5: Проверка в браузере
1. Открыть https://avk-pro.ru/catalog
2. F12 → Network tab
3. Проверить запросы изображений
4. Должны идти на: `https://avk-pro.ru/api/uploads/...`

---

## 🔧 СКРИПТЫ ДЛЯ БЫСТРОГО ИСПРАВЛЕНИЯ

### Скрипт 1: Проверка и исправление .env

Создать файл `/app/scripts/fix_frontend_env.sh`:

```bash
#!/bin/bash

CORRECT_URL="https://avk-pro.ru"
CURRENT_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d'=' -f2)

echo "Текущий BACKEND_URL: $CURRENT_URL"
echo "Правильный URL: $CORRECT_URL"

if [ "$CURRENT_URL" != "$CORRECT_URL" ]; then
    echo "❌ Неправильный URL! Исправляю..."
    sed -i "s|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=$CORRECT_URL|" /app/frontend/.env
    echo "✅ URL исправлен!"
    echo "Перезапускаю frontend..."
    sudo supervisorctl restart frontend
    echo "✅ Готово! Подождите 30 секунд и очистите кеш браузера."
else
    echo "✅ URL правильный!"
fi
```

```bash
chmod +x /app/scripts/fix_frontend_env.sh
```

### Скрипт 2: Полная диагностика изображений

Создать файл `/app/scripts/diagnose_images.sh`:

```bash
#!/bin/bash

echo "=========================================="
echo "ДИАГНОСТИКА ИЗОБРАЖЕНИЙ"
echo "=========================================="
echo ""

# 1. Проверка .env
echo "1. Проверка BACKEND_URL:"
BACKEND_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d'=' -f2)
echo "   $BACKEND_URL"
if [ "$BACKEND_URL" = "https://avk-pro.ru" ]; then
    echo "   ✅ Правильный URL"
else
    echo "   ❌ Неправильный URL!"
fi
echo ""

# 2. Проверка базы данных
echo "2. Проверка URL изображений в базе:"
mongosh test_database --quiet --eval "
    const product = db.products.findOne({}, {images: 1});
    if (product && product.images && product.images.length > 0) {
        print('   Первое изображение: ' + product.images[0]);
        if (product.images[0].startsWith('/api/uploads/')) {
            print('   ✅ Правильный формат');
        } else {
            print('   ❌ Неправильный формат!');
        }
    } else {
        print('   ⚠️  Нет товаров с изображениями');
    }
"
echo ""

# 3. Проверка файлов
echo "3. Проверка файлов на диске:"
FILE_COUNT=$(ls /app/backend/uploads/*.{jpg,png,webp} 2>/dev/null | wc -l)
echo "   Найдено файлов: $FILE_COUNT"
if [ $FILE_COUNT -gt 0 ]; then
    echo "   ✅ Файлы существуют"
else
    echo "   ❌ Нет файлов изображений!"
fi
echo ""

# 4. Проверка эндпоинта
echo "4. Проверка эндпоинта загрузки:"
FIRST_FILE=$(ls /app/backend/uploads/*.jpg 2>/dev/null | head -1 | xargs basename)
if [ ! -z "$FIRST_FILE" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://avk-pro.ru/api/uploads/$FIRST_FILE)
    echo "   Файл: $FIRST_FILE"
    echo "   HTTP код: $HTTP_CODE"
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Эндпоинт работает"
    else
        echo "   ❌ Эндпоинт не работает!"
    fi
else
    echo "   ⚠️  Нет файлов для проверки"
fi
echo ""

echo "=========================================="
echo "ДИАГНОСТИКА ЗАВЕРШЕНА"
echo "=========================================="
```

```bash
chmod +x /app/scripts/diagnose_images.sh
```

---

## 🚀 ИСПОЛЬЗОВАНИЕ

### После каждого deployment:

```bash
# Быстрая проверка и исправление
/app/scripts/fix_frontend_env.sh

# Полная диагностика
/app/scripts/diagnose_images.sh
```

### Если изображения не загружаются:

```bash
# 1. Запустить диагностику
/app/scripts/diagnose_images.sh

# 2. Исправить .env
/app/scripts/fix_frontend_env.sh

# 3. Исправить URL в базе данных (если нужно)
cd /app/backend && python fix_production_images.py

# 4. Очистить кеш браузера
# 5. Подождать 2-3 минуты для Cloudflare
```

---

## 📝 ДОКУМЕНТАЦИЯ ДЛЯ DEPLOYMENT

### Что НЕ ДЕЛАТЬ:
❌ НЕ изменять REACT_APP_BACKEND_URL на preview домен в production
❌ НЕ использовать абсолютные URL в базе данных
❌ НЕ удалять папку /app/backend/uploads при deploy

### Что ДЕЛАТЬ:
✅ Проверять .env после каждого deploy
✅ Использовать относительные пути в базе данных
✅ Делать резервные копии перед deploy
✅ Тестировать загрузку изображений после deploy

---

## 🎯 ИТОГ

**Проблема решена навсегда, если:**
1. REACT_APP_BACKEND_URL = https://avk-pro.ru
2. URL изображений в БД = /api/uploads/filename.jpg
3. Файлы существуют в /app/backend/uploads/
4. После deploy запускается fix_frontend_env.sh

**Если проблема вернулась:**
- Запустить `/app/scripts/diagnose_images.sh`
- Следовать инструкциям в выводе
- Запустить `/app/scripts/fix_frontend_env.sh`
