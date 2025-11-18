#!/bin/bash
# 🚀 Быстрое развертывание avk-pro.ru на VPS
# Ubuntu 24.04 LTS

# ================================
# ВАЖНО: Замените эти переменные!
# ================================
USERNAME="your_username"          # Ваше имя пользователя (whoami)
GITHUB_REPO="https://github.com/YOUR_USERNAME/YOUR_REPO.git"
DOMAIN="avk-pro.ru"
MONGO_URL="mongodb://localhost:27017/avk_pro_db"  # Или MongoDB Atlas URL
JWT_SECRET=$(openssl rand -hex 32)
VPS_IP="YOUR_VPS_IP"             # IP вашего VPS

# ================================
# 1. ОБНОВЛЕНИЕ СИСТЕМЫ
# ================================
echo "📦 Обновление системы..."
sudo apt update && sudo apt upgrade -y

# ================================
# 2. УСТАНОВКА NODE.JS 20.x
# ================================
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn pm2

# ================================
# 3. УСТАНОВКА PYTHON И PIP
# ================================
echo "📦 Установка Python..."
sudo apt install -y python3 python3-pip python3-venv

# ================================
# 4. УСТАНОВКА MONGODB
# ================================
echo "📦 Установка MongoDB..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# ================================
# 5. УСТАНОВКА NGINX
# ================================
echo "📦 Установка Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# ================================
# 6. УСТАНОВКА CERTBOT
# ================================
echo "📦 Установка Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# ================================
# 7. КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ
# ================================
echo "📥 Клонирование кода..."
mkdir -p ~/sites
cd ~/sites
git clone $GITHUB_REPO avk-pro
cd avk-pro

# ================================
# 8. НАСТРОЙКА BACKEND
# ================================
echo "⚙️  Настройка Backend..."
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
PORT=8001
HOST=0.0.0.0
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://$DOMAIN
EOF

# Создать директорию для логов
mkdir -p logs

# Создать ecosystem.config.js для PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'avk-pro-backend',
    script: 'server.py',
    interpreter: '/home/$USERNAME/sites/avk-pro/backend/venv/bin/python',
    cwd: '/home/$USERNAME/sites/avk-pro/backend',
    env: {
      PORT: 8001,
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
# 9. НАСТРОЙКА FRONTEND
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
# 10. НАСТРОЙКА NGINX
# ================================
echo "⚙️  Настройка Nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
upstream backend_avk_pro {
    server 127.0.0.1:8001;
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
sudo nginx -t
sudo systemctl reload nginx

# ================================
# 11. ЗАПУСК BACKEND
# ================================
echo "🚀 Запуск Backend..."
cd ~/sites/avk-pro/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# ================================
# 12. НАСТРОЙКА SSL
# ================================
echo "🔐 Настройка SSL..."
echo ""
echo "⚠️  ВАЖНО: Перед продолжением настройте DNS на REG.RU:"
echo "   Тип: A"
echo "   Имя: @"
echo "   Значение: $VPS_IP"
echo ""
echo "   Тип: A"
echo "   Имя: www"
echo "   Значение: $VPS_IP"
echo ""
echo "Подождите 5-10 минут для пропагации DNS, затем выполните:"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

# ================================
# ЗАВЕРШЕНИЕ
# ================================
echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📋 Статус сервисов:"
echo "   Nginx: $(sudo systemctl is-active nginx)"
echo "   MongoDB: $(sudo systemctl is-active mongod)"
echo "   Backend (PM2): $(pm2 list | grep avk-pro-backend | awk '{print $10}')"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу: https://$DOMAIN"
echo ""
echo "📝 Полезные команды:"
echo "   pm2 status                 - Статус backend"
echo "   pm2 logs avk-pro-backend   - Логи backend"
echo "   sudo systemctl status nginx - Статус Nginx"
echo ""
echo "📄 Полная инструкция: ~/sites/avk-pro/DEPLOYMENT_SWEB_VPS.md"
