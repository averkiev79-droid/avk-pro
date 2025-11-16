# Руководство по резервному копированию MongoDB

## Введение

Это руководство поможет вам создавать резервные копии базы данных MongoDB для защиты от потери данных. Рекомендуется делать резервные копии регулярно, особенно перед важными обновлениями.

## Оглавление

1. [Предварительные требования](#предварительные-требования)
2. [Создание резервной копии (Backup)](#создание-резервной-копии-backup)
3. [Восстановление из резервной копии (Restore)](#восстановление-из-резервной-копии-restore)
4. [Автоматизация резервного копирования](#автоматизация-резервного-копирования)
5. [Рекомендации](#рекомендации)

---

## Предварительные требования

### Установка MongoDB Database Tools

MongoDB Database Tools включают утилиты `mongodump` и `mongorestore`, которые необходимы для резервного копирования.

#### На Ubuntu/Debian:

```bash
# Импортировать публичный ключ MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Добавить репозиторий MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Обновить список пакетов и установить инструменты
sudo apt-get update
sudo apt-get install -y mongodb-database-tools
```

#### Проверка установки:

```bash
mongodump --version
mongorestore --version
```

---

## Создание резервной копии (Backup)

### Метод 1: Локальное резервное копирование (в контейнере)

Если MongoDB работает локально в вашем контейнере:

```bash
# Создать директорию для резервных копий
mkdir -p /app/backups

# Создать резервную копию базы данных test_database
mongodump --db=test_database --out=/app/backups/backup_$(date +%Y%m%d_%H%M%S)
```

**Параметры:**
- `--db=test_database` - имя вашей базы данных (замените на свое)
- `--out=` - директория для сохранения резервной копии
- `$(date +%Y%m%d_%H%M%S)` - добавляет метку времени к имени папки

### Метод 2: Резервное копирование с указанием хоста и порта

Если MongoDB работает на определенном хосте/порту:

```bash
# Получить MONGO_URL из .env файла
cd /app/backend
source .env

# Создать резервную копию
mongodump --uri="$MONGO_URL" --out=/app/backups/backup_$(date +%Y%m%d_%H%M%S)
```

### Метод 3: Резервное копирование конкретной коллекции

Если нужно сохранить только определенную коллекцию (например, products):

```bash
mongodump --db=test_database --collection=products --out=/app/backups/products_backup_$(date +%Y%m%d_%H%M%S)
```

### Проверка резервной копии

После создания резервной копии проверьте содержимое:

```bash
ls -lh /app/backups/
```

Вы должны увидеть папку с датой, внутри которой находятся файлы `.bson` и `.json`.

---

## Восстановление из резервной копии (Restore)

### Восстановление всей базы данных

```bash
# Восстановить из резервной копии
mongorestore --db=test_database /app/backups/backup_20241116_120000/test_database/
```

**⚠️ Внимание:** Эта команда добавит данные к существующим. Если нужно полностью заменить данные, используйте флаг `--drop`.

### Восстановление с полной заменой данных

```bash
# Удалить существующие данные и восстановить из резервной копии
mongorestore --db=test_database --drop /app/backups/backup_20241116_120000/test_database/
```

### Восстановление конкретной коллекции

```bash
# Восстановить только коллекцию products
mongorestore --db=test_database --collection=products /app/backups/backup_20241116_120000/test_database/products.bson
```

### Восстановление с использованием URI

```bash
cd /app/backend
source .env
mongorestore --uri="$MONGO_URL" --drop /app/backups/backup_20241116_120000/test_database/
```

---

## Автоматизация резервного копирования

### Создание скрипта резервного копирования

Создайте файл `/app/scripts/backup_mongodb.sh`:

```bash
#!/bin/bash

# Переменные
BACKUP_DIR="/app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="test_database"
RETENTION_DAYS=7  # Хранить резервные копии за последние 7 дней

# Создать директорию для резервных копий
mkdir -p $BACKUP_DIR

# Создать резервную копию
echo "Создание резервной копии базы данных $DB_NAME..."
mongodump --db=$DB_NAME --out=$BACKUP_DIR/backup_$DATE

# Проверить успешность
if [ $? -eq 0 ]; then
    echo "✓ Резервная копия успешно создана: $BACKUP_DIR/backup_$DATE"
    
    # Удалить старые резервные копии (старше RETENTION_DAYS дней)
    echo "Удаление резервных копий старше $RETENTION_DAYS дней..."
    find $BACKUP_DIR -type d -name "backup_*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    
    echo "✓ Очистка завершена"
else
    echo "✗ Ошибка при создании резервной копии"
    exit 1
fi
```

Сделайте скрипт исполняемым:

```bash
chmod +x /app/scripts/backup_mongodb.sh
```

### Настройка автоматического резервного копирования через Cron

Добавьте задачу в crontab для ежедневного резервного копирования в 2:00 ночи:

```bash
# Открыть crontab
crontab -e

# Добавить эту строку (ежедневно в 2:00 AM)
0 2 * * * /app/scripts/backup_mongodb.sh >> /var/log/mongodb_backup.log 2>&1

# Для резервного копирования каждые 6 часов:
0 */6 * * * /app/scripts/backup_mongodb.sh >> /var/log/mongodb_backup.log 2>&1

# Для резервного копирования каждую неделю (воскресенье в 3:00 AM):
0 3 * * 0 /app/scripts/backup_mongodb.sh >> /var/log/mongodb_backup.log 2>&1
```

---

## Рекомендации

### Частота резервного копирования

- **E-commerce приложения**: Ежедневно или каждые 6-12 часов
- **Высоконагруженные системы**: Каждые 1-4 часа
- **Низконагруженные системы**: Еженедельно

### Хранение резервных копий

1. **Локальное хранение**: Храните резервные копии в `/app/backups`
2. **Удаленное хранение**: 
   - Загружайте резервные копии на облачные хранилища (AWS S3, Google Cloud Storage)
   - Используйте внешние серверы
   - Настройте синхронизацию через `rsync`

### Пример загрузки в облако (AWS S3)

```bash
# Установить AWS CLI
sudo apt-get install awscli

# Настроить AWS credentials
aws configure

# Загрузить резервную копию в S3
aws s3 cp /app/backups/backup_20241116_120000/ s3://your-bucket-name/mongodb-backups/backup_20241116_120000/ --recursive
```

### Проверка резервных копий

Регулярно проверяйте, что резервные копии можно восстановить:

```bash
# Создать тестовую базу данных для проверки
mongorestore --db=test_restore /app/backups/backup_20241116_120000/test_database/

# Проверить данные
mongosh test_restore --eval "db.products.countDocuments()"

# Удалить тестовую базу после проверки
mongosh test_restore --eval "db.dropDatabase()"
```

### Мониторинг дискового пространства

Следите за свободным местом на диске:

```bash
# Проверить использование диска
df -h

# Проверить размер папки с резервными копиями
du -sh /app/backups/*
```

### Шифрование резервных копий

Для защиты чувствительных данных:

```bash
# Создать зашифрованную резервную копию
mongodump --db=test_database --archive=/app/backups/backup_$(date +%Y%m%d_%H%M%S).archive
gpg --symmetric --cipher-algo AES256 /app/backups/backup_*.archive

# Восстановить из зашифрованной резервной копии
gpg --decrypt /app/backups/backup_20241116_120000.archive.gpg | mongorestore --archive
```

---

## Быстрая шпаргалка

```bash
# Создать резервную копию
mongodump --db=test_database --out=/app/backups/backup_$(date +%Y%m%d_%H%M%S)

# Восстановить резервную копию
mongorestore --db=test_database --drop /app/backups/backup_20241116_120000/test_database/

# Создать резервную копию всех баз данных
mongodump --out=/app/backups/full_backup_$(date +%Y%m%d_%H%M%S)

# Посмотреть список баз данных
mongosh --eval "show dbs"

# Посмотреть коллекции в базе данных
mongosh test_database --eval "show collections"

# Посмотреть количество документов в коллекции
mongosh test_database --eval "db.products.countDocuments()"
```

---

## Устранение неполадок

### Ошибка: "command not found: mongodump"

Установите MongoDB Database Tools (см. раздел "Предварительные требования").

### Ошибка: "Failed: error connecting to db server"

Проверьте, что MongoDB запущен:

```bash
sudo systemctl status mongod
# или
ps aux | grep mongod
```

### Ошибка: "no space left on device"

Освободите место на диске или удалите старые резервные копии:

```bash
# Удалить резервные копии старше 7 дней
find /app/backups -type d -name "backup_*" -mtime +7 -exec rm -rf {} \;
```

---

## Дополнительные ресурсы

- [Официальная документация MongoDB Backup](https://www.mongodb.com/docs/manual/core/backups/)
- [mongodump документация](https://www.mongodb.com/docs/database-tools/mongodump/)
- [mongorestore документация](https://www.mongodb.com/docs/database-tools/mongorestore/)

---

**Примечание**: Всегда тестируйте процесс восстановления на тестовой среде перед применением на production!
