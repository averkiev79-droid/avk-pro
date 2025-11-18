# 🚀 Развертывание avk-pro.ru на VPS sweb (Ubuntu 24.04)

## 📋 Предварительные требования

- VPS с Ubuntu 24.04 LTS
- SSH доступ к серверу
- Домен avk-pro.ru (настроен на REG.RU)
- Код проекта на GitHub или готов к загрузке

---

## ⚙️ ЭТАП 1: Проверка установленного ПО (5 минут)

Подключитесь к VPS по SSH и выполните команды для проверки:

### 1.1. Проверить Node.js
```bash
node --version
```

**Если установлен:** Увидите версию (например: v20.x.x)
**Если НЕ установлен:** Увидите "command not found"

### 1.2. Проверить Python
```bash
python3 --version
```

**Должна быть версия 3.8 или выше**

### 1.3. Проверить MongoDB
```bash
mongod --version
```

**Если установлен:** Увидите версию
**Если НЕ установлен:** Увидите "command not found"

### 1.4. Проверить Nginx
```bash
nginx -v
```

### 1.5. Проверить PM2 (менеджер процессов)
```bash
pm2 --version
```

---

## 📦 ЭТАП 2: Установка недостающего ПО

### 2.1. Обновить систему
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2. Установить Node.js 20.x (если не установлен)
```bash
# Добавить репозиторий NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Установить Node.js
sudo apt install -y nodejs

# Проверить установку
node --version
npm --version
```

### 2.3. Установить Yarn (если нет)
```bash
sudo npm install -g yarn
yarn --version
```

### 2.4. Установить Python и pip (если нужно)
```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version
pip3 --version
```

### 2.5. Установить MongoDB (если не установлена)

**Вариант A: Локальная установка MongoDB**
```bash
# Импортировать ключ
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Добавить репозиторий
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Обновить и установить
sudo apt update
sudo apt install -y mongodb-org

# Запустить MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Проверить статус
sudo systemctl status mongod
```

**Вариант B: Использовать MongoDB Atlas (облачная БД - рекомендуется)**
- Зарегистрироваться на https://www.mongodb.com/cloud/atlas
- Создать бесплатный кластер
- Получить строку подключения
- **Проще и надежнее для продакшена!**

### 2.6. Установить Nginx (если не установлен)
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.7. Установить PM2 (менеджер процессов Node.js)
```bash
sudo npm install -g pm2
pm2 --version
```

### 2.8. Установить Certbot (для SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 📂 ЭТАП 3: Подготовка директорий и клонирование кода (10 минут)

### 3.1. Создать директорию для проектов
```bash
# Перейти в home
cd ~

# Создать директорию для сайтов (если еще нет)
mkdir -p ~/sites
cd ~/sites
```

### 3.2. Клонировать репозиторий с GitHub

**ВАЖНО:** Замените `YOUR_GITHUB_USERNAME` и `YOUR_REPO_NAME` на ваши данные!

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git avk-pro

# Перейти в директорию
cd avk-pro
```

**Если репозиторий приватный:**
```bash
# Настроить Git credentials
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# При клонировании GitHub попросит авторизацию
```

**Альтернатива: Загрузить файлы напрямую (если нет GitHub)**
```bash
# Создать директорию
mkdir -p ~/sites/avk-pro
cd ~/sites/avk-pro

# Здесь можно использовать scp или SFTP для загрузки файлов
# Или создать архив и загрузить через wget/curl
```

---

## 🔧 ЭТАП 4: Настройка Backend (15-20 минут)

### 4.1. Перейти в директорию backend
```bash
cd ~/sites/avk-pro/backend
```

### 4.2. Создать виртуальное окружение Python
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4.3. Установить зависимости
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.4. Настроить переменные окружения

Создать файл `.env`:
```bash
nano .env
```

Вставить следующее содержимое:
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/avk_pro_db

# ИЛИ если используете MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/avk_pro_db

# Backend settings
PORT=8001
HOST=0.0.0.0

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS (ваш домен)
FRONTEND_URL=https://avk-pro.ru
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

**Сгенерировать JWT_SECRET:**
```bash
openssl rand -hex 32
# Скопируйте результат и вставьте в .env как JWT_SECRET
```

### 4.5. Проверить структуру базы данных

Если нужно создать индексы или начальные данные:
```bash
# Активировать виртуальное окружение (если не активно)
source venv/bin/activate

# Запустить миграции (если есть)
python migrate_database.py

# Создать администратора (если есть скрипт)
python create_admin.py
```

### 4.6. Тестовый запуск backend
```bash
# Активировать виртуальное окружение
source venv/bin/activate

# Запустить сервер
python server.py
```

**Проверить в другом терминале:**
```bash
curl http://localhost:8001/api/health
# Должен вернуть ответ от API
```

**Остановить:** `Ctrl+C`

---

## 🎨 ЭТАП 5: Настройка Frontend (15-20 минут)

### 5.1. Перейти в директорию frontend
```bash
cd ~/sites/avk-pro/frontend
```

### 5.2. Настроить переменные окружения

Создать файл `.env`:
```bash
nano .env
```

Вставить:
```env
REACT_APP_BACKEND_URL=https://avk-pro.ru
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 5.3. Установить зависимости
```bash
yarn install
```

**Это может занять 5-10 минут**

### 5.4. Собрать production build
```bash
yarn build
```

**Это создаст директорию `build/` с оптимизированными файлами**

---

## 🌐 ЭТАП 6: Настройка Nginx (10 минут)

### 6.1. Создать конфигурацию для avk-pro.ru

```bash
sudo nano /etc/nginx/sites-available/avk-pro.ru
```

Вставить следующую конфигурацию:
```nginx
# Backend API (порт 8001)
upstream backend_avk_pro {
    server 127.0.0.1:8001;
}

server {
    listen 80;
    server_name avk-pro.ru www.avk-pro.ru;

    # Логи
    access_log /var/log/nginx/avk-pro.access.log;
    error_log /var/log/nginx/avk-pro.error.log;

    # Frontend (React build)
    location / {
        root /home/YOUR_USERNAME/sites/avk-pro/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache статики
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend_avk_pro;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Загрузки (если есть)
    location /uploads/ {
        alias /home/YOUR_USERNAME/sites/avk-pro/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Размер загружаемых файлов
    client_max_body_size 50M;
}
```

**ВАЖНО:** Замените `YOUR_USERNAME` на ваше имя пользователя!

Узнать имя пользователя:
```bash
whoami
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 6.2. Активировать конфигурацию
```bash
# Создать символическую ссылку
sudo ln -s /etc/nginx/sites-available/avk-pro.ru /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Если все OK - перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 🚀 ЭТАП 7: Запуск Backend с PM2 (5 минут)

### 7.1. Создать ecosystem файл для PM2

```bash
cd ~/sites/avk-pro/backend
nano ecosystem.config.js
```

Вставить:
```javascript
module.exports = {
  apps: [{
    name: 'avk-pro-backend',
    script: 'server.py',
    interpreter: '/home/YOUR_USERNAME/sites/avk-pro/backend/venv/bin/python',
    cwd: '/home/YOUR_USERNAME/sites/avk-pro/backend',
    env: {
      PORT: 8001,
      NODE_ENV: 'production'
    },
    error_file: '/home/YOUR_USERNAME/sites/avk-pro/backend/logs/err.log',
    out_file: '/home/YOUR_USERNAME/sites/avk-pro/backend/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    max_restarts: 10,
    watch: false
  }]
};
```

**ВАЖНО:** Замените `YOUR_USERNAME` на ваше имя пользователя!

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 7.2. Создать директорию для логов
```bash
mkdir -p ~/sites/avk-pro/backend/logs
```

### 7.3. Запустить backend через PM2
```bash
cd ~/sites/avk-pro/backend
pm2 start ecosystem.config.js

# Сохранить список процессов
pm2 save

# Настроить автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую выдаст PM2
```

### 7.4. Проверить статус
```bash
pm2 status
pm2 logs avk-pro-backend --lines 50
```

---

## 🔐 ЭТАП 8: Настройка SSL сертификата (5 минут)

### 8.1. Настроить DNS на REG.RU

**ВАЖНО: Сначала настройте DNS!**

Зайдите на REG.RU и настройте A-запись:
```
Тип: A
Имя: @
Значение: IP_ВАШЕГО_VPS
TTL: 3600
```

И для www:
```
Тип: A
Имя: www
Значение: IP_ВАШЕГО_VPS
TTL: 3600
```

**Подождите 5-10 минут для пропагации DNS**

### 8.2. Получить SSL сертификат

```bash
# Получить сертификат для домена
sudo certbot --nginx -d avk-pro.ru -d www.avk-pro.ru

# Следуйте инструкциям:
# 1. Введите email
# 2. Согласитесь с условиями (Y)
# 3. Выберите: 2 (Redirect HTTP to HTTPS)
```

### 8.3. Настроить автообновление сертификата
```bash
# Certbot автоматически настроит cron, но проверим:
sudo certbot renew --dry-run
```

---

## ✅ ЭТАП 9: Проверка и тестирование (10 минут)

### 9.1. Проверить статус всех сервисов
```bash
# Nginx
sudo systemctl status nginx

# MongoDB (если локальная)
sudo systemctl status mongod

# Backend через PM2
pm2 status
```

### 9.2. Проверить логи
```bash
# Backend логи
pm2 logs avk-pro-backend --lines 100

# Nginx логи
sudo tail -f /var/log/nginx/avk-pro.access.log
sudo tail -f /var/log/nginx/avk-pro.error.log
```

### 9.3. Проверить сайт в браузере

Откройте в браузере:
- https://avk-pro.ru
- Проверьте, что сайт загружается
- Проверьте, что SSL работает (зеленый замочек)

### 9.4. Проверить API
```bash
curl https://avk-pro.ru/api/products
# Должен вернуть список продуктов
```

---

## 📊 ЭТАП 10: Мониторинг и обслуживание

### Полезные команды для управления

**PM2 (Backend):**
```bash
pm2 status                      # Статус всех процессов
pm2 restart avk-pro-backend     # Перезапустить backend
pm2 stop avk-pro-backend        # Остановить backend
pm2 logs avk-pro-backend        # Смотреть логи
pm2 monit                       # Мониторинг в реальном времени
```

**Nginx:**
```bash
sudo nginx -t                   # Проверить конфигурацию
sudo systemctl reload nginx     # Перезагрузить конфигурацию
sudo systemctl restart nginx    # Перезапустить Nginx
```

**MongoDB:**
```bash
sudo systemctl status mongod    # Статус
sudo systemctl restart mongod   # Перезапустить
mongosh                         # Подключиться к БД
```

**Логи:**
```bash
# Backend логи
pm2 logs avk-pro-backend --lines 200

# Nginx логи
sudo tail -f /var/log/nginx/avk-pro.access.log
sudo tail -f /var/log/nginx/avk-pro.error.log
```

---

## 🔄 Обновление сайта

Когда нужно обновить код:

### Обновить Backend:
```bash
cd ~/sites/avk-pro/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
pm2 restart avk-pro-backend
```

### Обновить Frontend:
```bash
cd ~/sites/avk-pro/frontend
git pull origin main
yarn install
yarn build
# Nginx автоматически будет отдавать новый build
```

---

## 🆘 Решение типичных проблем

### Проблема 1: Backend не запускается
```bash
# Проверить логи
pm2 logs avk-pro-backend

# Проверить порт (не занят ли)
sudo lsof -i :8001

# Перезапустить
pm2 restart avk-pro-backend
```

### Проблема 2: Nginx ошибка 502 Bad Gateway
```bash
# Проверить, запущен ли backend
pm2 status

# Проверить, слушает ли backend порт
curl http://localhost:8001/api/health

# Проверить логи Nginx
sudo tail -f /var/log/nginx/avk-pro.error.log
```

### Проблема 3: MongoDB не подключается
```bash
# Проверить статус
sudo systemctl status mongod

# Проверить логи
sudo tail -f /var/log/mongodb/mongod.log

# Перезапустить
sudo systemctl restart mongod
```

### Проблема 4: SSL не работает
```bash
# Проверить сертификат
sudo certbot certificates

# Обновить сертификат
sudo certbot renew

# Проверить конфигурацию Nginx
sudo nginx -t
```

---

## 📞 Поддержка

- **Документация PM2:** https://pm2.keymetrics.io/docs/
- **Документация Nginx:** https://nginx.org/ru/docs/
- **Документация MongoDB:** https://www.mongodb.com/docs/
- **Поддержка sweb.ru:** Через личный кабинет или техподдержку

---

## ✅ Чеклист развертывания

- [ ] Проверено установленное ПО
- [ ] Установлены Node.js, Python, MongoDB
- [ ] Установлен Nginx и PM2
- [ ] Код клонирован с GitHub
- [ ] Backend настроен (.env файл)
- [ ] Backend запущен через PM2
- [ ] Frontend собран (yarn build)
- [ ] Nginx настроен для avk-pro.ru
- [ ] DNS настроен на REG.RU
- [ ] SSL сертификат установлен
- [ ] Сайт открывается в браузере
- [ ] API работает
- [ ] Настроен автозапуск при перезагрузке

---

**Время развертывания:** 1-2 часа
**Сложность:** Средняя
**Результат:** Полностью работающий сайт на вашем VPS!

🎉 **Удачи в развертывании!**
