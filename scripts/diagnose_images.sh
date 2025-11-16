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
    echo "   Запустите: /app/scripts/fix_frontend_env.sh"
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
        } else if (product.images[0].startsWith('http')) {
            print('   ❌ Неправильный формат! Запустите: cd /app/backend && python fix_production_images.py');
        } else {
            print('   ✅ Правильный формат');
        }
    } else {
        print('   ⚠️  Нет товаров с изображениями');
    }
"
echo ""

# 3. Проверка файлов
echo "3. Проверка файлов на диске:"
FILE_COUNT=$(ls /app/backend/uploads/*.{jpg,png,webp,jpeg} 2>/dev/null | wc -l)
echo "   Найдено файлов: $FILE_COUNT"
if [ $FILE_COUNT -gt 0 ]; then
    echo "   ✅ Файлы существуют"
    ls /app/backend/uploads/*.{jpg,png,webp,jpeg} 2>/dev/null | head -3 | while read file; do
        echo "     - $(basename $file)"
    done
else
    echo "   ❌ Нет файлов изображений!"
    echo "   Файлы были удалены при deploy. Нужно загрузить заново через админку."
fi
echo ""

# 4. Проверка эндпоинта
echo "4. Проверка эндпоинта загрузки:"
FIRST_FILE=$(ls /app/backend/uploads/*.{jpg,png,webp,jpeg} 2>/dev/null | head -1 | xargs basename 2>/dev/null)
if [ ! -z "$FIRST_FILE" ]; then
    echo "   Проверяю файл: $FIRST_FILE"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://avk-pro.ru/api/uploads/$FIRST_FILE 2>/dev/null)
    echo "   HTTP код: $HTTP_CODE"
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Эндпоинт работает"
        echo "   URL: https://avk-pro.ru/api/uploads/$FIRST_FILE"
    else
        echo "   ❌ Эндпоинт не работает! (HTTP $HTTP_CODE)"
        echo "   Проверьте, что backend запущен: sudo supervisorctl status backend"
    fi
else
    echo "   ⚠️  Нет файлов для проверки"
fi
echo ""

# 5. Статус сервисов
echo "5. Статус сервисов:"
echo "   Backend: $(sudo supervisorctl status backend | awk '{print $2}')"
echo "   Frontend: $(sudo supervisorctl status frontend | awk '{print $2}')"
echo ""

echo "=========================================="
echo "ДИАГНОСТИКА ЗАВЕРШЕНА"
echo "=========================================="
echo ""
echo "Если есть проблемы, выполните:"
echo "  1. /app/scripts/fix_frontend_env.sh"
echo "  2. cd /app/backend && python fix_production_images.py"
echo "  3. Очистите кеш браузера"
