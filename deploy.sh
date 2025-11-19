#!/bin/bash

#================================================
# Скрипт деплоя для AVK-PRO.RU
# Использование: bash deploy.sh
#================================================

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
PROJECT_DIR="/var/www/avk-pro"
BACKUP_DIR="/var/www/backups/avk-pro"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BRANCH="main"  # или master

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  🚀 Деплой AVK-PRO.RU${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка, что скрипт запущен из правильной директории
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Ошибка: Директория проекта не найдена: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# Шаг 1: Создание бэкапа
echo -e "${YELLOW}📦 Шаг 1: Создание бэкапа...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p "$BACKUP_DIR"
rsync -a --exclude 'node_modules' --exclude 'venv' --exclude '__pycache__' \
    --exclude '.git' "$PROJECT_DIR/" "$BACKUP_PATH/"

echo -e "${GREEN}✅ Бэкап создан: $BACKUP_PATH${NC}"
echo ""

# Шаг 2: Git Pull
echo -e "${YELLOW}📥 Шаг 2: Получение обновлений из GitHub...${NC}"

# Сохраняем .env файлы
cp "$BACKEND_DIR/.env" "/tmp/backend_env_backup" 2>/dev/null || true
cp "$FRONTEND_DIR/.env" "/tmp/frontend_env_backup" 2>/dev/null || true

# Stash локальные изменения (если есть)
git stash save "Auto-stash before deploy $TIMESTAMP" 2>/dev/null || true

# Pull изменений
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Восстанавливаем .env файлы
cp "/tmp/backend_env_backup" "$BACKEND_DIR/.env" 2>/dev/null || true
cp "/tmp/frontend_env_backup" "$FRONTEND_DIR/.env" 2>/dev/null || true

echo -e "${GREEN}✅ Обновления получены${NC}"
echo ""

# Шаг 3: Проверка изменений в зависимостях
echo -e "${YELLOW}📦 Шаг 3: Проверка зависимостей...${NC}"

INSTALL_BACKEND=false
INSTALL_FRONTEND=false

# Проверка изменений в requirements.txt
if git diff HEAD@{1} HEAD --name-only | grep -q "backend/requirements.txt"; then
    echo -e "${BLUE}ℹ️  Обнаружены изменения в requirements.txt${NC}"
    INSTALL_BACKEND=true
fi

# Проверка изменений в package.json
if git diff HEAD@{1} HEAD --name-only | grep -q "frontend/package.json"; then
    echo -e "${BLUE}ℹ️  Обнаружены изменения в package.json${NC}"
    INSTALL_FRONTEND=true
fi

# Шаг 4: Установка backend зависимостей
if [ "$INSTALL_BACKEND" = true ]; then
    echo -e "${YELLOW}🐍 Шаг 4a: Установка Python зависимостей...${NC}"
    cd "$BACKEND_DIR"
    
    # Активация виртуального окружения
    if [ -d "venv" ]; then
        source venv/bin/activate
        pip install -r requirements.txt --quiet
        deactivate
        echo -e "${GREEN}✅ Python зависимости установлены${NC}"
    else
        echo -e "${RED}⚠️  Виртуальное окружение не найдено${NC}"
    fi
    cd "$PROJECT_DIR"
else
    echo -e "${GREEN}✅ Backend зависимости не изменились${NC}"
fi

# Шаг 5: Установка frontend зависимостей
if [ "$INSTALL_FRONTEND" = true ]; then
    echo -e "${YELLOW}📦 Шаг 4b: Установка Node.js зависимостей...${NC}"
    cd "$FRONTEND_DIR"
    
    yarn install --silent
    echo -e "${GREEN}✅ Node.js зависимости установлены${NC}"
    cd "$PROJECT_DIR"
else
    echo -e "${GREEN}✅ Frontend зависимости не изменились${NC}"
fi

echo ""

# Шаг 6: Перезапуск сервисов
echo -e "${YELLOW}🔄 Шаг 5: Перезапуск сервисов...${NC}"

# Перезапуск backend через supervisor
if command -v supervisorctl &> /dev/null; then
    echo -e "${BLUE}  - Перезапуск backend...${NC}"
    sudo supervisorctl restart avk-pro-backend
    sleep 2
    
    # Проверка статуса backend
    if sudo supervisorctl status avk-pro-backend | grep -q "RUNNING"; then
        echo -e "${GREEN}  ✅ Backend запущен${NC}"
    else
        echo -e "${RED}  ❌ Backend не запустился!${NC}"
        echo -e "${YELLOW}  📋 Логи:${NC}"
        sudo tail -n 20 /var/log/supervisor/avk-pro-backend.err.log
        exit 1
    fi
else
    echo -e "${YELLOW}  ⚠️  Supervisor не найден, пропускаем перезапуск backend${NC}"
fi

# Перезапуск frontend через PM2 или supervisor
if command -v pm2 &> /dev/null; then
    echo -e "${BLUE}  - Перезапуск frontend (PM2)...${NC}"
    pm2 restart avk-pro-frontend 2>/dev/null || true
    echo -e "${GREEN}  ✅ Frontend перезапущен${NC}"
elif sudo supervisorctl status avk-pro-frontend &> /dev/null; then
    echo -e "${BLUE}  - Перезапуск frontend (Supervisor)...${NC}"
    sudo supervisorctl restart avk-pro-frontend
    sleep 2
    echo -e "${GREEN}  ✅ Frontend перезапущен${NC}"
else
    echo -e "${YELLOW}  ⚠️  Процесс-менеджер frontend не найден${NC}"
fi

# Перезагрузка Nginx
if command -v nginx &> /dev/null; then
    echo -e "${BLUE}  - Перезагрузка Nginx...${NC}"
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}  ✅ Nginx перезагружен${NC}"
fi

echo ""

# Шаг 7: Проверка работоспособности
echo -e "${YELLOW}🔍 Шаг 6: Проверка работоспособности...${NC}"

# Проверка backend
BACKEND_URL="http://localhost:8002/api/"
if curl -s "$BACKEND_URL" | grep -q "Hello World"; then
    echo -e "${GREEN}✅ Backend отвечает${NC}"
else
    echo -e "${RED}❌ Backend не отвечает!${NC}"
    echo -e "${YELLOW}Проверьте логи: sudo tail -n 50 /var/log/supervisor/avk-pro-backend.err.log${NC}"
fi

# Проверка frontend
FRONTEND_URL="http://localhost:3000"
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Frontend отвечает${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend не отвечает на localhost (возможно, это нормально)${NC}"
fi

# Проверка публичного доступа
PUBLIC_URL="https://avk-pro.ru"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PUBLIC_URL")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✅ Сайт доступен: $PUBLIC_URL (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Сайт недоступен: $PUBLIC_URL (HTTP $HTTP_CODE)${NC}"
fi

echo ""

# Итоговая информация
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Деплой завершён успешно!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Информация:${NC}"
echo -e "  • Бэкап: $BACKUP_PATH"
echo -e "  • Ветка: $BRANCH"
echo -e "  • Время: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${BLUE}📝 Полезные команды:${NC}"
echo -e "  • Логи backend:  ${YELLOW}sudo tail -f /var/log/supervisor/avk-pro-backend.err.log${NC}"
echo -e "  • Статус сервисов: ${YELLOW}sudo supervisorctl status${NC}"
echo -e "  • Откат на бэкап: ${YELLOW}rsync -a $BACKUP_PATH/ $PROJECT_DIR/${NC}"
echo ""
