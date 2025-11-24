#!/bin/bash

# Скрипт быстрого деплоя на production сервер

echo "=========================================="
echo "🚀 Быстрый деплой AVK-PRO.RU"
echo "=========================================="

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Шаг 1: Проверка текущей директории${NC}"
cd /var/www/avk-pro || exit 1
echo -e "${GREEN}✓ В директории /var/www/avk-pro${NC}"

echo -e "\n${YELLOW}📋 Шаг 2: Получение изменений с GitHub${NC}"
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Git pull выполнен успешно${NC}"
else
    echo -e "${RED}✗ Ошибка git pull${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📋 Шаг 3: Перезапуск Backend${NC}"
sudo supervisorctl restart backend
sleep 2
BACKEND_STATUS=$(sudo supervisorctl status backend | grep RUNNING)
if [ -n "$BACKEND_STATUS" ]; then
    echo -e "${GREEN}✓ Backend перезапущен и работает${NC}"
else
    echo -e "${RED}✗ Backend не запустился${NC}"
    sudo tail -n 20 /var/log/supervisor/avk-pro-backend.err.log
    exit 1
fi

echo -e "\n${YELLOW}📋 Шаг 4: Очистка кэша и пересборка Frontend${NC}"
cd /var/www/avk-pro/frontend

echo "  → Очистка кэша..."
rm -rf node_modules/.cache
rm -rf build

echo "  → Сборка production версии..."
yarn build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend собран успешно${NC}"
else
    echo -e "${RED}✗ Ошибка сборки frontend${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📋 Шаг 5: Перезагрузка Nginx${NC}"
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx перезагружен${NC}"
else
    echo -e "${RED}✗ Ошибка перезагрузки Nginx${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📋 Шаг 6: Проверка статуса сервисов${NC}"
sudo supervisorctl status | grep -E "backend|frontend"

echo -e "\n${YELLOW}📋 Шаг 7: Проверка доступности сайта${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://avk-pro.ru)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Сайт доступен (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}✗ Сайт недоступен (HTTP $HTTP_STATUS)${NC}"
fi

echo -e "\n=========================================="
echo -e "${GREEN}✅ Деплой завершен!${NC}"
echo "=========================================="
echo "Проверьте сайт: https://avk-pro.ru"
echo "Админ-панель: https://avk-pro.ru/admin"
echo ""
echo "Для просмотра логов backend:"
echo "  sudo tail -f /var/log/supervisor/avk-pro-backend.err.log"
echo ""
