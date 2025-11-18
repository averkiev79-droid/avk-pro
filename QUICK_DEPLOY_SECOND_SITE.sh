#!/bin/bash
# 🚀 Быстрое развертывание ВТОРОГО сайта avk-pro.ru на VPS
# Ubuntu 24.04 LTS
# ⚠️ Используется порт 8002 (8001 занят первым сайтом)

# ================================
# ВАЖНО: Замените эти переменные!
# ================================
USERNAME="your_username"          # Ваше имя пользователя (whoami)
GITHUB_REPO="https://github.com/YOUR_USERNAME/YOUR_REPO.git"
DOMAIN="avk-pro.ru"
MONGO_URL="mongodb://localhost:27017/avk_pro_db"  # ДРУГАЯ база данных!
JWT_SECRET=$(openssl rand -hex 32)
VPS_IP="YOUR_VPS_IP"             # IP вашего VPS
BACKEND_PORT=8002                # ВАЖНО: Другой порт!

# ================================
# 0. ПРОВЕРКА СУЩЕСТВУЮЩЕЙ КОНФИГУРАЦИИ
# ================================
echo "🔍 Проверка существующей конфигурации..."
echo ""
echo "=== Занятые порты ==="
sudo lsof -i :8001
sudo lsof -i :8002
echo ""
echo "=== PM2 процессы ==="
pm2 list
echo ""
echo "=== Nginx сайты ==="
ls -la /etc/nginx/sites-enabled/
echo ""
echo "⚠️  ВНИМАНИЕ: Убедитесь, что порт 8002 свободен!"
echo "   Если порт 8001 занят - это нормально (первый сайт)"
echo ""
read -p "Продолжить установку? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# ================================
# 1. КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ
# ================================
echo "📥 Клонирование кода..."
cd ~/sites
if [ -d "avk-pro" ]; then
    echo "⚠️  Директория avk-pro уже существует!"
    read -p "Удалить и клонировать заново? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        rm -rf avk-pro
    else
        echo "Отменено"
        exit 1
    fi
fi

git clone $GITHUB_REPO avk-pro
cd avk-pro

# ================================
# 2. НАСТРОЙКА BACKEND (порт 8002)
# ================================
echo "⚙️  Настройка Backend на порт $BACKEND_PORT..."
cd ~/sites/avk-pro/backend

# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install --upgrade pip
pip install -r requirements.txt

# Создать .env файл
cat > .env << EOF
MONGO_URL=$MONGO_URL
PORT=$BACKEND_PORT
HOST=0.0.0.0
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://$DOMAIN
EOF

# Создать директории
mkdir -p logs uploads

# Создать ecosystem.config.js для PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'avk-pro-backend',
    script: 'server.py',
    interpreter: '/home/$USERNAME/sites/avk-pro/backend/venv/bin/python',
    cwd: '/home/$USERNAME/sites/avk-pro/backend',
    env: {
      PORT: $BACKEND_PORT,
      NODE_ENV: 'production'
    },
    error_file: '/home/$USERNAME/sites/avk-pro/backend/logs/err.log',
    out_file: '/home/$USERNAME/sites/avk-pro/backend/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_restarts: 10,
    watch: false
  }]
};
EOF

# ================================
# 3. НАСТРОЙКА FRONTEND
# ================================
echo "⚙️  Настройка Frontend..."
cd ~/sites/avk-pro/frontend

# Создать .env
cat > .env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN
EOF

# Установить зависимости
yarn install

# Собрать production build
yarn build

# ================================
# 4. НАСТРОЙКА NGINX
# ================================
echo "⚙️  Настройка Nginx для второго сайта..."
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
# Backend API на порту $BACKEND_PORT
upstream backend_avk_pro {
    server 127.0.0.1:$BACKEND_PORT;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    access_log /var/log/nginx/avk-pro.access.log;
    error_log /var/log/nginx/avk-pro.error.log;

    location / {
        root /home/$USERNAME/sites/avk-pro/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://backend_avk_pro;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /uploads/ {
        alias /home/$USERNAME/sites/avk-pro/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    client_max_body_size 50M;
}
EOF

# Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx конфигурация корректна"
    sudo systemctl reload nginx
else
    echo "❌ Ошибка в конфигурации Nginx!"
    exit 1
fi

# ================================
# 5. ЗАПУСК BACKEND
# ================================
echo "🚀 Запуск Backend на порту $BACKEND_PORT..."
cd ~/sites/avk-pro/backend
pm2 start ecosystem.config.js
pm2 save

# ================================
# 6. ПРОВЕРКА
# ================================
echo ""
echo "🔍 Проверка статуса..."
echo ""
echo "=== PM2 процессы ==="
pm2 list
echo ""
echo "=== Nginx статус ==="
sudo systemctl status nginx --no-pager
echo ""
echo "=== Порты ==="
echo "Порт 8001 (первый сайт):"
sudo lsof -i :8001 | head -2
echo "Порт $BACKEND_PORT (avk-pro):"
sudo lsof -i :$BACKEND_PORT | head -2
echo ""

# ================================
# 7. ИНСТРУКЦИИ ПО DNS И SSL
# ================================
echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📋 Следующие шаги:"
echo ""
echo "1️⃣  Настройте DNS на REG.RU:"
echo "   Тип: A"
echo "   Имя: @"
echo "   Значение: $VPS_IP"
echo ""
echo "   Тип: A"
echo "   Имя: www"
echo "   Значение: $VPS_IP"
echo ""
echo "   Подождите 10-15 минут для пропагации DNS"
echo ""
echo "2️⃣  После пропагации DNS установите SSL:"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "3️⃣  Проверьте сайт:"
echo "   https://$DOMAIN"
echo ""
echo "📊 Сводка конфигурации:"
echo "   Frontend: /home/$USERNAME/sites/avk-pro/frontend/build"
echo "   Backend Port: $BACKEND_PORT"
echo "   Database: avk_pro_db"
echo "   PM2 Process: avk-pro-backend"
echo ""
echo "📝 Полезные команды:"
echo "   pm2 list                    - Список процессов"
echo "   pm2 logs avk-pro-backend    - Логи backend"
echo "   pm2 restart avk-pro-backend - Перезапуск backend"
echo "   sudo systemctl reload nginx - Перезагрузка Nginx"
echo ""
echo "📄 Полная инструкция: ~/sites/avk-pro/DEPLOY_SECOND_SITE_VPS.md"
echo ""
