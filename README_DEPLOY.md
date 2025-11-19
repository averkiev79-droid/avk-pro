# 🚀 Деплой проекта AVK-PRO.RU

## Быстрый старт

### 1. Сохранить изменения в GitHub
- Нажмите **"Save to Github"** на платформе Emergent
- Дождитесь подтверждения

### 2. Запустить деплой на сервере
```bash
ssh root@avk-pro.ru
cd /var/www/avk-pro && bash deploy.sh
```

**Готово!** Сайт обновлён за 30 секунд ⚡

---

## Файлы деплоя

- **`deploy.sh`** - основной скрипт деплоя
- **`DEPLOY_INSTRUCTIONS.md`** - полная документация
- **`DEPLOY_QUICK_GUIDE.txt`** - краткая шпаргалка

---

## Первая настройка на сервере

Если деплой запускается впервые:

### 1. Проверить пути в скрипте

```bash
nano /var/www/avk-pro/deploy.sh
```

Убедитесь, что пути совпадают:
- `PROJECT_DIR="/var/www/avk-pro"`
- `BRANCH="main"` (или `master`)

### 2. Сделать скрипт исполняемым

```bash
chmod +x /var/www/avk-pro/deploy.sh
```

### 3. Проверить имена сервисов в supervisor

```bash
sudo supervisorctl status
```

Если имена сервисов отличаются, обновите в скрипте:
- `avk-pro-backend` → ваше имя
- `avk-pro-frontend` → ваше имя

### 4. Создать директорию для бэкапов

```bash
mkdir -p /var/www/backups/avk-pro
```

---

## Структура проекта

```
/var/www/avk-pro/
├── backend/              # FastAPI приложение
│   ├── .env             # Конфигурация (НЕ в Git!)
│   ├── requirements.txt # Python зависимости
│   └── server.py        # Основной файл
├── frontend/            # React приложение
│   ├── .env             # Конфигурация (НЕ в Git!)
│   ├── package.json     # Node зависимости
│   └── src/             # Исходники
├── deploy.sh            # 🚀 Скрипт деплоя
└── DEPLOY_*.md          # Документация
```

---

## Supervisor конфигурация

### Backend: `/etc/supervisor/conf.d/avk-pro-backend.conf`

```ini
[program:avk-pro-backend]
directory=/var/www/avk-pro/backend
command=/var/www/avk-pro/backend/venv/bin/python server.py
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/avk-pro-backend.err.log
stdout_logfile=/var/log/supervisor/avk-pro-backend.out.log
environment=MONGO_URL="...",DB_NAME="...",ADMIN_PASSWORD="..."
```

### Frontend: `/etc/supervisor/conf.d/avk-pro-frontend.conf`

```ini
[program:avk-pro-frontend]
directory=/var/www/avk-pro/frontend
command=yarn start
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/avk-pro-frontend.err.log
stdout_logfile=/var/log/supervisor/avk-pro-frontend.out.log
```

После изменения конфигов:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart all
```

---

## Nginx конфигурация

### `/etc/nginx/sites-available/avk-pro.ru`

```nginx
server {
    listen 80;
    server_name avk-pro.ru www.avk-pro.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name avk-pro.ru www.avk-pro.ru;

    ssl_certificate /etc/letsencrypt/live/avk-pro.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avk-pro.ru/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Безопасность

### .env файлы (НЕ в Git!)

**Backend** `/var/www/avk-pro/backend/.env`:
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="avk_pro"
ADMIN_PASSWORD="ваш-пароль"
ADMIN_EMAIL="admin@email.com"
SMTP_HOST="smtp.yandex.ru"
SMTP_PORT="465"
SMTP_PASSWORD="app-password"
TELEGRAM_BOT_TOKEN="токен"
TELEGRAM_CHAT_ID="id"
```

**Frontend** `/var/www/avk-pro/frontend/.env`:
```bash
REACT_APP_BACKEND_URL=https://avk-pro.ru
```

⚠️ **Важно:** Скрипт деплоя автоматически сохраняет и восстанавливает .env файлы!

---

## Мониторинг

### Проверка работы сайта

```bash
# Backend
curl http://localhost:8002/api/
# Должен вернуть: {"message":"Hello World"}

# Frontend
curl http://localhost:3000
# Должен вернуть HTML

# Публичный доступ
curl -I https://avk-pro.ru
# Должен вернуть: HTTP/2 200
```

### Логи

```bash
# Backend
sudo tail -f /var/log/supervisor/avk-pro-backend.err.log

# Frontend
sudo tail -f /var/log/supervisor/avk-pro-frontend.err.log

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## Полезные ссылки

- 📚 Полная инструкция: `DEPLOY_INSTRUCTIONS.md`
- 📋 Быстрая шпаргалка: `DEPLOY_QUICK_GUIDE.txt`
- 🌐 Сайт: https://avk-pro.ru
- 🔐 Админ-панель: https://avk-pro.ru/admin/login

---

**Вопросы?** Читайте полную документацию в `DEPLOY_INSTRUCTIONS.md`
