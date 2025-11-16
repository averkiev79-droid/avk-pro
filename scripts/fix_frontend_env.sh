#!/bin/bash

CORRECT_URL="https://avk-pro.ru"
CURRENT_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d'=' -f2)

echo "==========================================="
echo "ИСПРАВЛЕНИЕ FRONTEND .ENV"
echo "==========================================="
echo ""
echo "Текущий BACKEND_URL: $CURRENT_URL"
echo "Правильный URL: $CORRECT_URL"
echo ""

if [ "$CURRENT_URL" != "$CORRECT_URL" ]; then
    echo "❌ Неправильный URL! Исправляю..."
    sed -i "s|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=$CORRECT_URL|" /app/frontend/.env
    echo "✅ URL исправлен!"
    echo ""
    echo "Перезапускаю frontend..."
    sudo supervisorctl restart frontend
    echo "✅ Frontend перезапущен!"
    echo ""
    echo "⚠️  ВАЖНО:"
    echo "   1. Подождите 30 секунд"
    echo "   2. Очистите кеш браузера (Ctrl+Shift+Delete)"
    echo "   3. Обновите страницу (F5)"
else
    echo "✅ URL правильный! Исправление не требуется."
fi

echo ""
echo "==========================================="
