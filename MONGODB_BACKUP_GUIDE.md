# 💾 Полное руководство по бэкапу MongoDB

## 📋 Зачем нужен бэкап?

Бэкап защищает от потери данных при:
- ❌ Случайном удалении товаров/заказов
- ❌ Ошибках в коде при миграциях
- ❌ Сбоях сервера
- ❌ Проблемах с деплоем

---

## ⚡ БЫСТРЫЙ СТАРТ - Создать бэкап прямо сейчас

### Ручной бэкап (1 команда)

```bash
# Создать папку для бэкапов
mkdir -p /app/backups

# Сделать бэкап ВСЕХ баз данных
mongodump --uri="mongodb://localhost:27017" --out=/app/backups/backup-$(date +%Y%m%d-%H%M%S)

# Или только одной базы (test_database)
mongodump --uri="mongodb://localhost:27017" --db=test_database --out=/app/backups/backup-$(date +%Y%m%d-%H%M%S)
```

**Результат:** Папка `/app/backups/backup-20251115-180000/` с вашими данными

---

## 🔄 АВТОМАТИЧЕСКИЙ БЭКАП (рекомендуется)

### Вариант 1: Скрипт с cron (Linux)

#### Шаг 1: Создайте скрипт бэкапа

```bash
cat > /app/backend/backup_mongodb.sh << 'EOF'
#!/bin/bash

# Настройки
BACKUP_DIR="/app/backups"
MONGO_URI="mongodb://localhost:27017"
DB_NAME="test_database"
RETENTION_DAYS=7  # Хранить бэкапы 7 дней

# Создаём папку если её нет
mkdir -p "$BACKUP_DIR"

# Имя бэкапа с датой
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "🔄 Начало бэкапа MongoDB..."
echo "📅 Дата: $(date)"

# Создаём бэкап
mongodump --uri="$MONGO_URI" --db="$DB_NAME" --out="$BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Бэкап успешно создан: $BACKUP_PATH"
    
    # Сжимаем бэкап (экономим место)
    tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
    rm -rf "$BACKUP_PATH"
    echo "✅ Бэкап сжат: $BACKUP_PATH.tar.gz"
    
    # Удаляем старые бэкапы (старше RETENTION_DAYS дней)
    find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    echo "🗑️  Удалены бэкапы старше $RETENTION_DAYS дней"
    
    # Показываем размер
    BACKUP_SIZE=$(du -h "$BACKUP_PATH.tar.gz" | cut -f1)
    echo "📊 Размер бэкапа: $BACKUP_SIZE"
    
else
    echo "❌ Ошибка при создании бэкапа!"
    exit 1
fi

echo "✅ Бэкап завершён!"
EOF

# Делаем скрипт исполняемым
chmod +x /app/backend/backup_mongodb.sh
```

#### Шаг 2: Настройте автоматический запуск (cron)

```bash
# Открываем crontab
crontab -e

# Добавляем строку для ежедневного бэкапа в 3:00 ночи
0 3 * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1

# Или каждые 6 часов:
0 */6 * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1

# Или каждый час:
0 * * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1
```

**Сохраните и закройте** (`:wq` в vim или Ctrl+X в nano)

---

### Вариант 2: Python скрипт (проще)

Создаём Python скрипт для бэкапа:

```python
# /app/backend/auto_backup.py
import subprocess
import os
from datetime import datetime
from pathlib import Path

BACKUP_DIR = Path("/app/backups")
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "test_database"
RETENTION_DAYS = 7

def create_backup():
    """Создаёт бэкап MongoDB"""
    
    # Создаём папку
    BACKUP_DIR.mkdir(exist_ok=True)
    
    # Имя бэкапа
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_name = f"backup-{timestamp}"
    backup_path = BACKUP_DIR / backup_name
    
    print(f"🔄 Создание бэкапа: {backup_name}")
    
    # Запускаем mongodump
    result = subprocess.run([
        "mongodump",
        f"--uri={MONGO_URI}",
        f"--db={DB_NAME}",
        f"--out={backup_path}"
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Бэкап создан: {backup_path}")
        
        # Сжимаем
        tar_file = f"{backup_path}.tar.gz"
        subprocess.run(["tar", "-czf", tar_file, "-C", str(BACKUP_DIR), backup_name])
        subprocess.run(["rm", "-rf", str(backup_path)])
        
        print(f"✅ Бэкап сжат: {tar_file}")
        
        # Удаляем старые
        cleanup_old_backups()
        
        return True
    else:
        print(f"❌ Ошибка: {result.stderr}")
        return False

def cleanup_old_backups():
    """Удаляет бэкапы старше RETENTION_DAYS дней"""
    import time
    
    cutoff_time = time.time() - (RETENTION_DAYS * 86400)
    
    for backup in BACKUP_DIR.glob("backup-*.tar.gz"):
        if backup.stat().st_mtime < cutoff_time:
            backup.unlink()
            print(f"🗑️  Удалён старый бэкап: {backup.name}")

if __name__ == "__main__":
    create_backup()
```

**Использование:**
```bash
cd /app/backend
python auto_backup.py
```

---

## 🔙 ВОССТАНОВЛЕНИЕ ИЗ БЭКАПА

### Восстановить полностью

```bash
# Распаковать бэкап
cd /app/backups
tar -xzf backup-20251115-180000.tar.gz

# Восстановить базу данных
mongorestore --uri="mongodb://localhost:27017" --db=test_database backup-20251115-180000/test_database/

# Или с перезаписью существующих данных
mongorestore --uri="mongodb://localhost:27017" --db=test_database --drop backup-20251115-180000/test_database/
```

### Восстановить только одну коллекцию

```bash
# Только товары
mongorestore --uri="mongodb://localhost:27017" --db=test_database --collection=products backup-20251115-180000/test_database/products.bson

# Только заказы
mongorestore --uri="mongodb://localhost:27017" --db=test_database --collection=orders backup-20251115-180000/test_database/orders.bson
```

---

## 📊 ПРОВЕРКА БЭКАПОВ

### Список всех бэкапов

```bash
ls -lh /app/backups/
```

### Содержимое бэкапа

```bash
# Распаковать во временную папку
tar -xzf /app/backups/backup-20251115-180000.tar.gz -C /tmp/

# Посмотреть структуру
ls -lR /tmp/backup-20251115-180000/
```

### Размер бэкапов

```bash
du -sh /app/backups/*
```

---

## 🤖 АВТОМАТИЗАЦИЯ ЧЕРЕЗ PYTHON + SUPERVISOR

### Создайте supervisor конфиг для периодического бэкапа:

```bash
cat > /etc/supervisor/conf.d/mongodb-backup.conf << 'EOF'
[program:mongodb-backup]
command=/bin/bash -c "while true; do python3 /app/backend/auto_backup.py && sleep 21600; done"
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/mongodb-backup.err.log
stdout_logfile=/var/log/supervisor/mongodb-backup.out.log
user=root
EOF

# Перезагрузить supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mongodb-backup
```

**Результат:** Бэкап каждые 6 часов (21600 секунд)

Для изменения частоты:
- `3600` = каждый час
- `21600` = каждые 6 часов
- `86400` = раз в день

---

## 📈 РАСПИСАНИЕ БЭКАПОВ (рекомендации)

### Для production сайта:

**Частота:**
- 🔴 Критичные данные: каждые 1-6 часов
- 🟡 Важные данные: раз в день
- 🟢 Архивные данные: раз в неделю

**Хранение:**
- Последние 7 дней: все бэкапы
- Последний месяц: еженедельные
- Последний год: ежемесячные

**Пример:**
```
/app/backups/
├── backup-20251115-030000.tar.gz  (сегодня 03:00)
├── backup-20251115-090000.tar.gz  (сегодня 09:00)
├── backup-20251115-150000.tar.gz  (сегодня 15:00)
├── backup-20251114-030000.tar.gz  (вчера)
└── backup-20251113-030000.tar.gz  (позавчера)
```

---

## 🌐 БЭКАП В ОБЛАКО (ПРОДВИНУТЫЙ УРОВЕНЬ)

### Синхронизация с облаком

После создания локального бэкапа, отправляйте его в облако:

**Яндекс.Диск:**
```bash
# Установить rclone
curl https://rclone.org/install.sh | sudo bash

# Настроить Яндекс.Диск
rclone config

# Синхронизировать бэкапы
rclone sync /app/backups yandex:backups/mongodb/
```

**Google Drive / Dropbox:** 
- Аналогично через rclone

---

## 🔍 МОНИТОРИНГ БЭКАПОВ

### Проверка последнего бэкапа

```bash
# Последний бэкап
ls -lt /app/backups/ | head -2

# Когда был создан
stat /app/backups/backup-*.tar.gz | grep Modify | tail -1
```

### Проверка логов

```bash
# Логи бэкапов
tail -50 /app/backups/backup.log

# Или supervisor логи (если используете)
tail -50 /var/log/supervisor/mongodb-backup.out.log
```

---

## 🆘 ЧАСТЫЕ ПРОБЛЕМЫ

### Проблема: mongodump не найден

**Решение:**
```bash
# Установить mongodb-database-tools
sudo apt-get update
sudo apt-get install -y mongodb-database-tools
```

### Проблема: Нет места на диске

**Решение:**
```bash
# Проверить место
df -h /app/backups

# Удалить старые бэкапы
find /app/backups -name "backup-*.tar.gz" -type f -mtime +7 -delete

# Или переместить в облако
```

### Проблема: Бэкап слишком большой

**Решение:**
```bash
# Сжимайте с максимальным уровнем
tar -czf backup.tar.gz --best backup/

# Исключите временные коллекции
mongodump --uri="mongodb://localhost:27017" --db=test_database --excludeCollection=temp --out=/app/backups/
```

---

## 📝 ГОТОВЫЙ СКРИПТ АВТОМАТИЧЕСКОГО БЭКАПА

Создайте этот файл и запускайте его регулярно:

```bash
#!/bin/bash
# /app/backend/backup_mongodb.sh

set -e  # Остановить при ошибке

# ============================================================================
# НАСТРОЙКИ (измените под себя)
# ============================================================================
BACKUP_DIR="/app/backups"
MONGO_URI="mongodb://localhost:27017"
DB_NAME="test_database"
RETENTION_DAYS=7
ENABLE_COMPRESSION=true
ENABLE_CLOUD_SYNC=false  # Включите если настроили rclone

# ============================================================================
# ОСНОВНОЙ КОД
# ============================================================================

# Создаём папку
mkdir -p "$BACKUP_DIR"

# Дата и время
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DATE_READABLE=$(date "+%Y-%m-%d %H:%M:%S")
BACKUP_NAME="backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "============================================================"
echo "🔄 БЭКАП MongoDB"
echo "============================================================"
echo "📅 Дата: $DATE_READABLE"
echo "💾 База: $DB_NAME"
echo "📂 Путь: $BACKUP_PATH"
echo ""

# Создаём бэкап
mongodump --uri="$MONGO_URI" --db="$DB_NAME" --out="$BACKUP_PATH" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Дамп создан успешно"
    
    # Сжатие
    if [ "$ENABLE_COMPRESSION" = true ]; then
        echo "📦 Сжатие бэкапа..."
        tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
        rm -rf "$BACKUP_PATH"
        
        BACKUP_SIZE=$(du -h "$BACKUP_PATH.tar.gz" | cut -f1)
        echo "✅ Бэкап сжат: $BACKUP_SIZE"
    fi
    
    # Очистка старых бэкапов
    echo "🗑️  Очистка старых бэкапов (старше $RETENTION_DAYS дней)..."
    DELETED=$(find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete -print | wc -l)
    echo "🗑️  Удалено бэкапов: $DELETED"
    
    # Синхронизация с облаком
    if [ "$ENABLE_CLOUD_SYNC" = true ]; then
        echo "☁️  Синхронизация с облаком..."
        rclone sync "$BACKUP_DIR" yandex:backups/mongodb/ --progress
        echo "✅ Синхронизация завершена"
    fi
    
    # Статистика
    echo ""
    echo "============================================================"
    echo "📊 СТАТИСТИКА БЭКАПОВ"
    echo "============================================================"
    echo "Всего бэкапов: $(ls -1 "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | wc -l)"
    echo "Общий размер: $(du -sh "$BACKUP_DIR" | cut -f1)"
    echo ""
    echo "Последние 5 бэкапов:"
    ls -lht "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | head -5 | awk '{print "  📦 " $9 " (" $5 ")"}'
    echo ""
    echo "✅ БЭКАП ЗАВЕРШЁН УСПЕШНО!"
    echo "============================================================"
    
else
    echo "❌ ОШИБКА ПРИ СОЗДАНИИ БЭКАПА!"
    exit 1
fi
```

**Сделайте скрипт исполняемым:**
```bash
chmod +x /app/backend/backup_mongodb.sh
```

**Протестируйте:**
```bash
/app/backend/backup_mongodb.sh
```

---

## ⏰ НАСТРОЙКА РАСПИСАНИЯ

### Через cron (рекомендуется)

```bash
# Редактировать crontab
crontab -e

# Добавить одну из строк:

# Каждый день в 3:00 ночи
0 3 * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1

# Каждые 6 часов
0 */6 * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1

# Каждый час
0 * * * * /app/backend/backup_mongodb.sh >> /app/backups/backup.log 2>&1

# Перед каждым деплоем (вручную запускайте)
# /app/backend/backup_mongodb.sh
```

### Проверка cron задачи

```bash
# Список всех задач
crontab -l

# Логи cron
tail -f /var/log/cron

# Или
tail -f /app/backups/backup.log
```

---

## 🔙 КАК ВОССТАНОВИТЬ ДАННЫЕ

### Полное восстановление базы

```bash
# Распаковать бэкап
cd /app/backups
tar -xzf backup-20251115-180000.tar.gz

# Восстановить (заменит все данные!)
mongorestore --uri="mongodb://localhost:27017" --db=test_database --drop backup-20251115-180000/test_database/

# Перезапустить backend
sudo supervisorctl restart backend
```

### Восстановить только товары

```bash
# Распаковать
tar -xzf backup-20251115-180000.tar.gz

# Восстановить только products
mongorestore --uri="mongodb://localhost:27017" \
  --db=test_database \
  --collection=products \
  --drop \
  backup-20251115-180000/test_database/products.bson

# Перезапустить backend
sudo supervisorctl restart backend
```

### Выборочное восстановление (без удаления)

```bash
# Восстановить БЕЗ удаления существующих данных
mongorestore --uri="mongodb://localhost:27017" \
  --db=test_database \
  --collection=products \
  backup-20251115-180000/test_database/products.bson
```

---

## 📦 ЧТО ВКЛЮЧАЕТ БЭКАП

При бэкапе базы `test_database` сохраняются все коллекции:

- ✅ **products** - все товары с изображениями
- ✅ **orders** - заказы клиентов
- ✅ **users** - пользователи и администраторы
- ✅ **articles** - статьи блога
- ✅ **reviews** - отзывы
- ✅ **hockey_clubs** - хоккейные клубы
- ✅ **portfolio** - портфолио работ
- ✅ **site_settings** - настройки сайта
- ✅ **legal_pages** - юридические страницы

**Что НЕ включает:**
- ❌ Файлы из `/app/backend/uploads/` (нужен отдельный бэкап)
- ❌ Код приложения (хранится в Git)
- ❌ Настройки .env (сохраните отдельно)

---

## 💡 БЭКАП ПАПКИ UPLOADS

Файлы изображений тоже нужно бэкапить!

```bash
# Создать бэкап папки uploads
tar -czf /app/backups/uploads-$(date +%Y%m%d-%H%M%S).tar.gz /app/backend/uploads/

# Или синхронизировать в облако
rclone sync /app/backend/uploads/ yandex:backups/uploads/
```

---

## 🎯 ПОЛНЫЙ СКРИПТ БЭКАПА (MongoDB + Uploads)

```bash
#!/bin/bash
# /app/backend/full_backup.sh

BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "🔄 Полный бэкап системы..."

# 1. Бэкап MongoDB
echo "1️⃣ Бэкап базы данных..."
mongodump --uri="mongodb://localhost:27017" --db=test_database --out="$BACKUP_DIR/db-$TIMESTAMP"
tar -czf "$BACKUP_DIR/db-$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "db-$TIMESTAMP"
rm -rf "$BACKUP_DIR/db-$TIMESTAMP"

# 2. Бэкап файлов
echo "2️⃣ Бэкап загруженных файлов..."
tar -czf "$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz" /app/backend/uploads/

# 3. Статистика
DB_SIZE=$(du -h "$BACKUP_DIR/db-$TIMESTAMP.tar.gz" | cut -f1)
UPLOADS_SIZE=$(du -h "$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz" | cut -f1)

echo ""
echo "✅ Полный бэкап готов!"
echo "  📦 База данных: $DB_SIZE"
echo "  📦 Файлы: $UPLOADS_SIZE"
echo ""

# 4. Очистка старых (>7 дней)
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +7 -delete

echo "✅ Бэкап завершён: $TIMESTAMP"
```

**Использование:**
```bash
chmod +x /app/backend/full_backup.sh
/app/backend/full_backup.sh
```

---

## ✅ БЫСТРЫЙ СТАРТ (сделайте прямо сейчас)

### 1. Создать первый бэкап

```bash
mkdir -p /app/backups
mongodump --uri="mongodb://localhost:27017" --db=test_database --out=/app/backups/backup-$(date +%Y%m%d-%H%M%S)
echo "✅ Первый бэкап создан!"
```

### 2. Настроить автоматический бэкап

```bash
# Добавить в crontab (каждый день в 3:00)
(crontab -l 2>/dev/null; echo "0 3 * * * mongodump --uri='mongodb://localhost:27017' --db=test_database --out=/app/backups/backup-\$(date +\%Y\%m\%d-\%H\%M\%S) && find /app/backups -name 'backup-*' -type d -mtime +7 -exec rm -rf {} +") | crontab -
```

### 3. Проверить

```bash
ls -lh /app/backups/
```

---

## 📞 ВАЖНЫЕ КОМАНДЫ

```bash
# Создать бэкап ПРЯМО СЕЙЧАС
mongodump --uri="mongodb://localhost:27017" --db=test_database --out=/app/backups/manual-backup-$(date +%Y%m%d-%H%M%S)

# Восстановить последний бэкап
LAST_BACKUP=$(ls -t /app/backups/ | head -1)
mongorestore --uri="mongodb://localhost:27017" --db=test_database --drop "/app/backups/$LAST_BACKUP/test_database/"

# Список бэкапов
ls -lht /app/backups/

# Размер всех бэкапов
du -sh /app/backups/

# Удалить все бэкапы старше 30 дней
find /app/backups -name "backup-*" -mtime +30 -delete
```

---

## 🎯 РЕКОМЕНДАЦИИ

### Перед каждым деплоем:

```bash
# 1. Создайте бэкап
mongodump --uri="mongodb://localhost:27017" --db=test_database --out=/app/backups/pre-deploy-$(date +%Y%m%d-%H%M%S)

# 2. Сделайте деплой
# Save to GitHub → Re-Deploy

# 3. Проверьте данные
# Если что-то не так - восстановите из бэкапа
```

### Хранение бэкапов:

- ✅ Локально: минимум последние 7 дней
- ✅ В облаке: долгосрочное хранение (месяцы/годы)
- ✅ На другом сервере: для катастрофоустойчивости

---

## ⚡ ЧЕКЛИСТ

- [ ] Создал папку `/app/backups`
- [ ] Установил mongodb-database-tools
- [ ] Создал тестовый бэкап вручную
- [ ] Проверил, что бэкап создался
- [ ] Настроил cron для автоматического бэкапа
- [ ] Протестировал восстановление из бэкапа
- [ ] Настроил очистку старых бэкапов
- [ ] (Опционально) Настроил синхронизацию с облаком

---

## 🎓 ЛУЧШИЕ ПРАКТИКИ

1. **Правило 3-2-1:**
   - 3 копии данных
   - 2 разных носителя
   - 1 копия вне офиса (облако)

2. **Тестируйте восстановление:**
   - Раз в месяц пробуйте восстановить данные
   - Убедитесь, что бэкапы рабочие

3. **Мониторинг:**
   - Проверяйте, что бэкапы создаются
   - Следите за размером папки бэкапов
   - Получайте уведомления при ошибках

4. **Документация:**
   - Записывайте процедуру восстановления
   - Храните пароли в безопасном месте
   - Обучите команду

---

## 📧 УВЕДОМЛЕНИЯ ПРИ ОШИБКАХ (опционально)

Добавьте в конец скрипта:

```bash
# Если бэкап упал - отправить email
if [ $? -ne 0 ]; then
    echo "Ошибка бэкапа MongoDB на $(hostname)" | mail -s "BACKUP FAILED" admin@example.com
fi
```

---

**Начните с создания первого бэкапа прямо сейчас! Это займёт 1 минуту! 💾🚀**

**Команда:**
```bash
mkdir -p /app/backups && mongodump --uri="mongodb://localhost:27017" --db=test_database --out=/app/backups/backup-$(date +%Y%m%d-%H%M%S) && echo "✅ Бэкап создан!"
```
