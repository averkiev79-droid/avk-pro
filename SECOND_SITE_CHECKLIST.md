# ✅ Краткий чеклист развертывания ВТОРОГО сайта на VPS

## ⚠️ Важно: Это для VPS с СУЩЕСТВУЮЩИМ сайтом!

**Главное отличие:**
- Первый сайт (uniformfactory.ru): Backend порт **8001**
- Второй сайт (avk-pro.ru): Backend порт **8002** ← используем другой!

---

## 📋 Быстрый план (1-1.5 часа)

### ✅ Шаг 0: Проверка (5 минут)
```bash
ssh user@your_vps
whoami                    # Узнать имя пользователя
pm2 list                  # Какие процессы уже работают
sudo lsof -i :8001        # Проверить первый сайт
sudo lsof -i :8002        # Проверить, свободен ли порт 8002
```

### ✅ Шаг 1: Клонирование (5 минут)
```bash
cd ~/sites
git clone https://github.com/YOUR_USER/YOUR_REPO.git avk-pro
cd avk-pro
```

### ✅ Шаг 2: Backend на порт 8002 (10 минут)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Создать .env с PORT=8002
nano .env
```

**Содержимое .env:**
```env
MONGO_URL=mongodb://localhost:27017/avk_pro_db
PORT=8002
HOST=0.0.0.0
JWT_SECRET=ваш-секретный-ключ
FRONTEND_URL=https://avk-pro.ru
```

**Создать ecosystem.config.js с port: 8002**

### ✅ Шаг 3: Frontend (15 минут)
```bash
cd ../frontend
nano .env
```

**Содержимое .env:**
```env
REACT_APP_BACKEND_URL=https://avk-pro.ru
```

```bash
yarn install
yarn build
```

### ✅ Шаг 4: Nginx (5 минут)
```bash
sudo nano /etc/nginx/sites-available/avk-pro.ru
```

**Важно в конфигурации:**
- `upstream backend_avk_pro { server 127.0.0.1:8002; }`
- `root /home/YOUR_USER/sites/avk-pro/frontend/build;`

```bash
sudo ln -s /etc/nginx/sites-available/avk-pro.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### ✅ Шаг 5: Запуск PM2 (2 минуты)
```bash
cd ~/sites/avk-pro/backend
pm2 start ecosystem.config.js
pm2 save
pm2 list
```

**Должно быть:**
- uniformfactory-backend - online (port 8001)
- avk-pro-backend - online (port 8002)

### ✅ Шаг 6: DNS на REG.RU (5 минут + 10 минут ожидание)
```
A-запись:
@ → IP_вашего_VPS

A-запись:
www → IP_вашего_VPS
```

**Подождать 10-15 минут**

### ✅ Шаг 7: SSL (3 минуты)
```bash
sudo certbot --nginx -d avk-pro.ru -d www.avk-pro.ru
```

### ✅ Шаг 8: Проверка
```bash
pm2 list                           # Оба backend online
curl https://avk-pro.ru/api/products
```

**В браузере:**
- https://uniformfactory.ru ✅ (старый сайт работает)
- https://avk-pro.ru ✅ (новый сайт работает)

---

## 🚨 Частые ошибки и решения

### ❌ Ошибка: "Address already in use :8001"
**Причина:** Забыли изменить порт на 8002
**Решение:**
```bash
nano backend/.env           # PORT=8002
nano backend/ecosystem.config.js  # env: { PORT: 8002 }
```

### ❌ Ошибка: PM2 процесс с таким именем уже есть
**Причина:** Имя процесса совпадает
**Решение:**
```bash
nano backend/ecosystem.config.js
# name: 'avk-pro-backend'  (не uniformfactory-backend)
```

### ❌ Ошибка: Nginx 502 Bad Gateway
**Решение:**
```bash
pm2 logs avk-pro-backend     # Проверить логи
pm2 restart avk-pro-backend  # Перезапустить
sudo lsof -i :8002           # Проверить порт
```

### ❌ Ошибка: База данных пустая
**Причина:** Используется та же база, что у первого сайта
**Решение:**
```bash
nano backend/.env
# MONGO_URL=mongodb://localhost:27017/avk_pro_db (не uniformfactory_db!)
```

---

## 📊 Сводка конфигурации

| Параметр | uniformfactory.ru | avk-pro.ru |
|----------|-------------------|------------|
| Backend Port | 8001 | 8002 |
| Database | uniformfactory_db | avk_pro_db |
| PM2 Process | uniformfactory-backend | avk-pro-backend |
| Frontend Path | ~/sites/uniformfactory/frontend/build | ~/sites/avk-pro/frontend/build |
| Nginx Config | /etc/nginx/sites-available/uniformfactory.ru | /etc/nginx/sites-available/avk-pro.ru |

---

## 🔧 Полезные команды

### Управление процессами
```bash
pm2 list                         # Список всех процессов
pm2 logs avk-pro-backend         # Логи нового сайта
pm2 restart avk-pro-backend      # Перезапуск нового сайта
pm2 restart uniformfactory-backend  # Перезапуск старого сайта
pm2 monit                        # Мониторинг
```

### Проверка портов
```bash
sudo lsof -i :8001              # Кто использует 8001
sudo lsof -i :8002              # Кто использует 8002
```

### Nginx
```bash
sudo nginx -t                   # Проверка конфигурации
sudo systemctl reload nginx     # Применить изменения
sudo tail -f /var/log/nginx/avk-pro.error.log  # Логи
```

### MongoDB
```bash
mongosh                         # Подключиться
show dbs                        # Список баз
use avk_pro_db                  # Выбрать базу
db.products.find().limit(5)     # Проверить данные
```

---

## 🎉 После успешного развертывания

### Проверка в Яндекс.Вебмастере
1. Зайти: https://webmaster.yandex.ru/
2. Добавить сайт: **avk-pro.ru**
3. **Инструменты → Проверка ответа сервера**
4. Ввести: `https://avk-pro.ru`
5. Должно быть: **HTTP 200** ✅ (без ошибок DNS!)

### Преимущества VPS
✅ **Нет Cloudflare** → Яндекс не блокируется
✅ **Полный контроль** над конфигурацией
✅ **Два сайта** на одном сервере без конфликтов
✅ **Отличное SEO** и индексация

---

## 📞 Помощь

**Полная инструкция:** `DEPLOY_SECOND_SITE_VPS.md`

**Автоматический скрипт:** `QUICK_DEPLOY_SECOND_SITE.sh`
```bash
# Отредактировать переменные в начале файла
nano QUICK_DEPLOY_SECOND_SITE.sh

# Запустить
chmod +x QUICK_DEPLOY_SECOND_SITE.sh
./QUICK_DEPLOY_SECOND_SITE.sh
```

---

**Время:** 1-1.5 часа
**Результат:** Два независимых сайта на VPS! 🚀
