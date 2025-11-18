# 🚀 Развертывание второго сайта (avk-pro.ru) на VPS с существующим uniformfactory.ru

## ⚠️ ВАЖНО: Это инструкция для VPS, на котором УЖЕ работает сайт!

**Что учтено:**
- Разные порты для backend (8001 → используется, 8002 → для нового)
- Отдельные директории
- Отдельные базы данных MongoDB
- Отдельные процессы PM2
- Отдельные конфигурации Nginx

---

## 📋 ЭТАП 0: Проверка существующей конфигурации (5 минут)

### 0.1. Подключиться к VPS
```bash
ssh ваш_пользователь@ip_вашего_vps
```

### 0.2. Проверить, что уже работает
```bash
# Какие порты заняты
echo "=== Занятые порты ==="
sudo lsof -i :8001
sudo lsof -i :8002
sudo lsof -i :3000

# Процессы PM2
echo "=== PM2 процессы ==="
pm2 list

# Nginx конфигурации
echo "=== Nginx сайты ==="
ls -la /etc/nginx/sites-enabled/

# MongoDB базы
echo "=== MongoDB базы ==="
mongosh --eval "show dbs" 2>/dev/null || mongo --eval "show dbs"

# Имя пользователя
echo "=== Имя пользователя ==="
whoami
```

**Запишите результаты** - нам понадобятся эти данные!

---

## 📦 ЭТАП 1: Клонирование проекта (5 минут)

### 1.1. Перейти в директорию с сайтами
```bash
cd ~/sites
# Если директории нет:
# mkdir -p ~/sites && cd ~/sites
```

### 1.2. Клонировать репозиторий
```bash
# Замените YOUR_GITHUB_USERNAME и YOUR_REPO_NAME на ваши данные!
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git avk-pro

# Перейти в директорию
cd avk-pro
```

**Проверить структуру:**
```bash
ls -la
# Должны быть: frontend/, backend/, и т.д.
```

---

## 🔧 ЭТАП 2: Настройка Backend на порт 8002 (10 минут)

### 2.1. Перейти в директорию backend
```bash
cd ~/sites/avk-pro/backend
```

### 2.2. Создать виртуальное окружение Python
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3. Установить зависимости
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Это займет 3-5 минут**

### 2.4. Создать файл .env

```bash
nano .env
```

Вставить следующее содержимое:
```env
# MongoDB - ДРУГАЯ база данных!
MONGO_URL=mongodb://localhost:27017/avk_pro_db

# Backend settings - ДРУГОЙ порт!
PORT=8002
HOST=0.0.0.0

# JWT Secret (сгенерируйте новый)
JWT_SECRET=замените-на-случайную-строку

# CORS (ваш домен)
FRONTEND_URL=https://avk-pro.ru
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.5. Сгенерировать JWT_SECRET
```bash
openssl rand -hex 32
```

**Скопируйте результат и вставьте в .env как JWT_SECRET:**
```bash
nano .env
# Замените строку JWT_SECRET=... на сгенерированное значение
```

### 2.6. Создать директорию для логов
```bash
mkdir -p ~/sites/avk-pro/backend/logs
mkdir -p ~/sites/avk-pro/backend/uploads
```

### 2.7. Создать ecosystem.config.js для PM2

```bash
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
      PORT: 8002,
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

Узнать имя пользователя:
```bash
whoami
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.8. Исправить порт в server.py (если захардкожен)

Проверить:
```bash
grep "8001" server.py
```

Если найдено - заменить на 8002:
```bash
nano server.py
# Найти строку с port=8001 и заменить на port=8002
# Или убедиться, что используется os.environ.get('PORT')
```

### 2.9. Тестовый запуск backend
```bash
source venv/bin/activate
python server.py
```

**В другом терминале проверить:**
```bash
curl http://localhost:8002/api/products
# Должен вернуть ответ
```

**Остановить тестовый сервер:** `Ctrl+C`

---

## 🎨 ЭТАП 3: Настройка Frontend (15 минут)

### 3.1. Перейти в директорию frontend
```bash
cd ~/sites/avk-pro/frontend
```

### 3.2. Создать файл .env

```bash
nano .env
```

Вставить:
```env
REACT_APP_BACKEND_URL=https://avk-pro.ru
```

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 3.3. Установить зависимости
```bash
yarn install
```

**Это займет 5-10 минут**

### 3.4. Собрать production build
```bash
yarn build
```

**Это займет 2-5 минут**

### 3.5. Проверить, что build создан
```bash
ls -la build/
# Должны быть файлы: index.html, static/, и т.д.
```

---

## 🌐 ЭТАП 4: Настройка Nginx для второго сайта (10 минут)

### 4.1. Создать новую конфигурацию Nginx

```bash
sudo nano /etc/nginx/sites-available/avk-pro.ru
```

Вставить следующую конфигурацию:
```nginx
# Backend API на порту 8002
upstream backend_avk_pro {
    server 127.0.0.1:8002;
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

    # Загрузки
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

**Сохранить:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.2. Активировать конфигурацию
```bash
# Создать символическую ссылку
sudo ln -s /etc/nginx/sites-available/avk-pro.ru /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t
```

**Должно быть:**
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 4.3. Перезагрузить Nginx
```bash
sudo systemctl reload nginx
```

### 4.4. Проверить статус Nginx
```bash
sudo systemctl status nginx
```

---

## 🚀 ЭТАП 5: Запуск Backend через PM2 (5 минут)

### 5.1. Запустить backend
```bash
cd ~/sites/avk-pro/backend
pm2 start ecosystem.config.js
```

### 5.2. Проверить статус
```bash
pm2 list
```

**Должны увидеть:**
- `uniformfactory-backend` (или как называется) - running
- `avk-pro-backend` - running ← **новый процесс**

### 5.3. Проверить логи
```bash
pm2 logs avk-pro-backend --lines 50
```

**Должно быть:** "Application startup complete" или похожее сообщение

### 5.4. Сохранить конфигурацию PM2
```bash
pm2 save
```

### 5.5. Проверить автозапуск (если еще не настроен)
```bash
pm2 startup
# Если выдаст команду - выполните её
```

---

## 🌍 ЭТАП 6: Настройка DNS на REG.RU (5 минут)

### 6.1. Зайти на REG.RU
1. Зайти в личный кабинет REG.RU
2. Перейти к управлению доменом **avk-pro.ru**
3. Найти раздел **DNS-серверы и управление зоной**

### 6.2. Создать A-записи

**Запись 1:**
- Тип: **A**
- Имя: **@**
- Значение: **IP_вашего_VPS** (тот же, что у uniformfactory.ru)
- TTL: **3600**

**Запись 2:**
- Тип: **A**
- Имя: **www**
- Значение: **IP_вашего_VPS**
- TTL: **3600**

### 6.3. Сохранить изменения

**Подождать 5-15 минут** для пропагации DNS

### 6.4. Проверить DNS
```bash
# На VPS выполнить:
nslookup avk-pro.ru
ping avk-pro.ru -c 3
```

**Должен показать IP вашего VPS**

---

## 🔐 ЭТАП 7: Установка SSL сертификата (5 минут)

### 7.1. Убедиться, что DNS работает
```bash
curl -I http://avk-pro.ru
# Должен вернуть ответ от Nginx
```

### 7.2. Получить SSL сертификат
```bash
sudo certbot --nginx -d avk-pro.ru -d www.avk-pro.ru
```

**Следовать инструкциям:**
1. Ввести email (можно тот же, что для uniformfactory)
2. Согласиться с условиями: **Y**
3. Выбрать: **2** (Redirect HTTP to HTTPS)

### 7.3. Проверить сертификат
```bash
sudo certbot certificates
```

**Должны увидеть сертификаты для:**
- uniformfactory.ru
- avk-pro.ru ← **новый**

---

## ✅ ЭТАП 8: Проверка и тестирование (10 минут)

### 8.1. Проверить статус всех сервисов

**Nginx:**
```bash
sudo systemctl status nginx
```

**MongoDB:**
```bash
sudo systemctl status mongod
```

**PM2 процессы:**
```bash
pm2 list
```

**Должны быть ОБА backend'а в статусе "online":**
- uniformfactory-backend (port 8001)
- avk-pro-backend (port 8002)

### 8.2. Проверить порты
```bash
sudo lsof -i :8001  # uniformfactory
sudo lsof -i :8002  # avk-pro
```

**Оба порта должны быть заняты Python процессами**

### 8.3. Проверить API напрямую
```bash
# avk-pro API
curl http://localhost:8002/api/products

# через Nginx
curl https://avk-pro.ru/api/products
```

### 8.4. Проверить в браузере

Откройте в браузере:
- **https://avk-pro.ru** ← новый сайт
- **https://uniformfactory.ru** ← старый сайт (должен работать как прежде!)

**Проверить:**
- ✅ Оба сайта открываются
- ✅ SSL работает (зеленый замочек)
- ✅ Нет конфликтов

### 8.5. Проверить логи
```bash
# Backend avk-pro
pm2 logs avk-pro-backend --lines 50

# Backend uniformfactory
pm2 logs uniformfactory-backend --lines 50  # или как называется

# Nginx
sudo tail -f /var/log/nginx/avk-pro.access.log
sudo tail -f /var/log/nginx/avk-pro.error.log
```

---

## 📊 ЭТАП 9: Финальная проверка конфигурации

### 9.1. Сводная таблица портов

| Сайт | Frontend | Backend Port | Database | PM2 Process |
|------|----------|--------------|----------|-------------|
| uniformfactory.ru | Nginx | 8001 | uniformfactory_db | uniformfactory-backend |
| avk-pro.ru | Nginx | 8002 | avk_pro_db | avk-pro-backend |

### 9.2. Проверить базы данных MongoDB
```bash
mongosh --eval "show dbs"
```

**Должны увидеть:**
- uniformfactory_db
- avk_pro_db ← **новая база**
- admin
- config
- local

### 9.3. Проверить Nginx конфигурации
```bash
ls -la /etc/nginx/sites-enabled/
```

**Должны быть:**
- uniformfactory.ru
- avk-pro.ru ← **новая конфигурация**

---

## 🔄 Управление двумя сайтами

### Управление Backend через PM2

**Список всех процессов:**
```bash
pm2 list
```

**Перезапустить конкретный сайт:**
```bash
pm2 restart avk-pro-backend
pm2 restart uniformfactory-backend
```

**Остановить:**
```bash
pm2 stop avk-pro-backend
```

**Логи:**
```bash
pm2 logs avk-pro-backend
pm2 logs uniformfactory-backend
```

**Мониторинг:**
```bash
pm2 monit
```

### Управление Nginx

**Проверить конфигурацию:**
```bash
sudo nginx -t
```

**Перезагрузить:**
```bash
sudo systemctl reload nginx
```

**Перезапустить:**
```bash
sudo systemctl restart nginx
```

---

## 🔄 Обновление кода

### Обновить avk-pro:
```bash
cd ~/sites/avk-pro

# Backend
cd backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
cd ..
pm2 restart avk-pro-backend

# Frontend
cd frontend
git pull origin main
yarn install
yarn build
```

### Обновить uniformfactory:
```bash
cd ~/sites/uniformfactory
# ... аналогично
```

---

## 🆘 Решение типичных проблем

### Проблема 1: Конфликт портов
```bash
# Проверить, кто занял порт 8002
sudo lsof -i :8002

# Убить процесс, если нужно
sudo kill -9 PID

# Перезапустить
pm2 restart avk-pro-backend
```

### Проблема 2: Nginx 502 Bad Gateway
```bash
# Проверить, запущен ли backend
pm2 status

# Проверить логи backend
pm2 logs avk-pro-backend

# Проверить, слушает ли порт
curl http://localhost:8002/api/products

# Перезапустить
pm2 restart avk-pro-backend
sudo systemctl reload nginx
```

### Проблема 3: Сайт не открывается
```bash
# Проверить DNS
nslookup avk-pro.ru
ping avk-pro.ru

# Проверить Nginx
sudo nginx -t
sudo systemctl status nginx

# Проверить логи Nginx
sudo tail -f /var/log/nginx/avk-pro.error.log
```

### Проблема 4: SSL не работает
```bash
# Проверить сертификаты
sudo certbot certificates

# Обновить сертификат
sudo certbot renew

# Проверить конфигурацию Nginx
sudo nginx -t
```

### Проблема 5: MongoDB ошибки
```bash
# Проверить статус
sudo systemctl status mongod

# Проверить базы
mongosh --eval "show dbs"

# Проверить, к какой базе подключается
cat ~/sites/avk-pro/backend/.env | grep MONGO_URL
```

---

## ✅ Чеклист развертывания второго сайта

- [ ] Проверена существующая конфигурация (порты, процессы)
- [ ] Код клонирован в отдельную директорию ~/sites/avk-pro
- [ ] Backend настроен на порт 8002
- [ ] Backend .env создан с новой базой данных
- [ ] Frontend .env создан
- [ ] Frontend build собран
- [ ] Nginx конфигурация создана для avk-pro.ru
- [ ] Nginx конфигурация активирована
- [ ] Backend запущен через PM2 с именем avk-pro-backend
- [ ] DNS настроен на REG.RU
- [ ] SSL сертификат установлен
- [ ] Оба сайта открываются в браузере
- [ ] Оба backend работают (проверено через pm2 list)
- [ ] Нет конфликтов портов
- [ ] Логи проверены, ошибок нет

---

## 🎉 Результат

После выполнения инструкции у вас будет:

✅ **Два полностью независимых сайта на одном VPS:**
- uniformfactory.ru (backend: 8001, БД: uniformfactory_db)
- avk-pro.ru (backend: 8002, БД: avk_pro_db)

✅ **Оба сайта работают без конфликтов**

✅ **SSL для обоих доменов**

✅ **Полный контроль через PM2 и Nginx**

✅ **Яндекс.Вебмастер сможет проиндексировать avk-pro.ru без проблем!**

---

**Время развертывания:** 1-1.5 часа
**Сложность:** Средняя
**Результат:** Два работающих сайта на одном VPS!

🚀 **Удачи в развертывании!**
