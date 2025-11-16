# Руководство по безопасному Deployment

## Важно! Перед каждым deployment

### 1. Создайте резервную копию базы данных

**ОБЯЗАТЕЛЬНО** перед каждым deploy создавайте backup:

```bash
# Создать резервную копию
./scripts/backup_mongodb.sh
```

Это займет несколько секунд и защитит ваши данные от потери.

---

## Проблемы, которые были исправлены

### ❌ Проблема: Товары исчезали при deploy

**Причина:** Несколько служебных скриптов использовали жестко закодированные имена баз данных вместо переменной окружения `DB_NAME`.

**Исправлено:**
- ✅ `create_admin.py` - теперь использует `DB_NAME` из `.env`
- ✅ `list_users.py` - теперь использует `DB_NAME` из `.env`
- ✅ `update_admin_email.py` - теперь использует `DB_NAME` из `.env`
- ✅ `migrate_slugs.py` - теперь использует `DB_NAME` из `.env`
- ✅ `auto_publish_articles.py` - теперь использует `DB_NAME` из `.env`
- ✅ `server.py` - `load_dotenv()` больше не перезаписывает переменные окружения Kubernetes

---

## Процесс безопасного Deployment

### Шаг 1: Подготовка

```bash
# 1. Проверить текущее состояние базы данных
mongosh test_database --quiet --eval "db.products.countDocuments()"
mongosh test_database --quiet --eval "db.users.countDocuments()"
mongosh test_database --quiet --eval "db.orders.countDocuments()"
```

### Шаг 2: Создать резервную копию

```bash
# 2. Создать backup перед deploy
./scripts/backup_mongodb.sh
```

### Шаг 3: Выполнить Deploy

```bash
# 3. Выполнить deployment через платформу Emergent
# (используйте веб-интерфейс или API платформы)
```

### Шаг 4: Проверка после Deploy

```bash
# 4. Проверить, что данные на месте
mongosh test_database --quiet --eval "db.products.countDocuments()"
mongosh test_database --quiet --eval "db.users.countDocuments()"

# 5. Проверить, что backend работает
curl -X GET https://avk-pro.ru/api/products | jq '.length'
```

### Шаг 5: Восстановление (если что-то пошло не так)

Если после deploy данные пропали:

```bash
# Восстановить из последней резервной копии
./scripts/restore_mongodb.sh 1

# Или выбрать конкретную резервную копию
./scripts/restore_mongodb.sh
```

---

## Переменные окружения

### Backend (.env)

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="https://avk-pro.ru,http://localhost:3000"
JWT_SECRET_KEY="ваш_секретный_ключ"
EMERGENT_LLM_KEY="ваш_ключ"
RESEND_API_KEY="ваш_ключ_resend"
TELEGRAM_BOT_TOKEN="ваш_токен_telegram"
TELEGRAM_CHAT_ID="ваш_chat_id"
FRONTEND_URL="https://avk-pro.ru"
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL="https://avk-pro.ru"
```

---

## Автоматизация резервного копирования

### Настройка автоматического backup перед deploy

Создайте файл `/app/scripts/pre_deploy.sh`:

```bash
#!/bin/bash

echo "=================================="
echo "PRE-DEPLOYMENT BACKUP"
echo "=================================="

# Создать резервную копию
/app/scripts/backup_mongodb.sh

# Проверить количество данных
echo ""
echo "Current data counts:"
echo "Products: $(mongosh test_database --quiet --eval 'db.products.countDocuments()')"
echo "Users: $(mongosh test_database --quiet --eval 'db.users.countDocuments()')"
echo "Orders: $(mongosh test_database --quiet --eval 'db.orders.countDocuments()')"
echo ""

# Сохранить метрику для сравнения после deploy
mongosh test_database --quiet --eval 'db.products.countDocuments()' > /tmp/pre_deploy_product_count.txt

echo "✅ Pre-deployment backup complete!"
```

Создайте файл `/app/scripts/post_deploy.sh`:

```bash
#!/bin/bash

echo "=================================="
echo "POST-DEPLOYMENT VERIFICATION"
echo "=================================="

# Подождать, пока сервисы запустятся
sleep 5

# Проверить количество данных
echo ""
echo "Current data counts:"
PRODUCTS_NOW=$(mongosh test_database --quiet --eval 'db.products.countDocuments()')
USERS_NOW=$(mongosh test_database --quiet --eval 'db.users.countDocuments()')

echo "Products: $PRODUCTS_NOW"
echo "Users: $USERS_NOW"
echo ""

# Сравнить с pre-deploy
if [ -f /tmp/pre_deploy_product_count.txt ]; then
    PRODUCTS_BEFORE=$(cat /tmp/pre_deploy_product_count.txt)
    
    if [ "$PRODUCTS_NOW" -lt "$PRODUCTS_BEFORE" ]; then
        echo "⚠️  WARNING: Product count decreased!"
        echo "Before: $PRODUCTS_BEFORE"
        echo "After: $PRODUCTS_NOW"
        echo ""
        echo "To restore from backup:"
        echo "  ./scripts/restore_mongodb.sh 1"
        exit 1
    else
        echo "✅ Data integrity verified!"
    fi
fi

# Проверить, что API работает
echo ""
echo "Checking API health..."
if curl -f -s https://avk-pro.ru/api/products > /dev/null; then
    echo "✅ API is responding correctly"
else
    echo "❌ API check failed"
    exit 1
fi

echo ""
echo "✅ Post-deployment verification complete!"
```

Сделайте скрипты исполняемыми:

```bash
chmod +x /app/scripts/pre_deploy.sh
chmod +x /app/scripts/post_deploy.sh
```

---

## Мониторинг данных

### Проверка целостности данных

Создайте файл `/app/scripts/check_data_integrity.sh`:

```bash
#!/bin/bash

echo "=================================="
echo "DATA INTEGRITY CHECK"
echo "=================================="
echo ""

# Подключение к базе данных
DB_NAME="test_database"

echo "Database: $DB_NAME"
echo ""

# Проверить основные коллекции
echo "Collection counts:"
echo "  Products:     $(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments()')"
echo "  Users:        $(mongosh $DB_NAME --quiet --eval 'db.users.countDocuments()')"
echo "  Orders:       $(mongosh $DB_NAME --quiet --eval 'db.orders.countDocuments()')"
echo "  Articles:     $(mongosh $DB_NAME --quiet --eval 'db.articles.countDocuments()')"
echo "  Reviews:      $(mongosh $DB_NAME --quiet --eval 'db.reviews.countDocuments()')"
echo "  Hockey Clubs: $(mongosh $DB_NAME --quiet --eval 'db.hockey_clubs.countDocuments()')"
echo ""

# Проверить товары без изображений
PRODUCTS_NO_IMAGES=$(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments({$or: [{images: {$exists: false}}, {images: {$size: 0}}]})')
echo "Products without images: $PRODUCTS_NO_IMAGES"

# Проверить активные товары
ACTIVE_PRODUCTS=$(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments({is_active: true})')
echo "Active products: $ACTIVE_PRODUCTS"

echo ""
echo "✅ Data integrity check complete!"
```

```bash
chmod +x /app/scripts/check_data_integrity.sh
```

---

## Чеклист перед Production Deploy

- [ ] Создана резервная копия базы данных (`./scripts/backup_mongodb.sh`)
- [ ] Проверено количество товаров, пользователей, заказов
- [ ] Проверены все переменные окружения в `.env`
- [ ] Протестировано приложение локально
- [ ] Настроено автоматическое резервное копирование (cron)
- [ ] Проверена работа восстановления из backup
- [ ] Документированы все изменения
- [ ] Подготовлен план отката (rollback)

---

## Быстрое восстановление

Если после deploy что-то пошло не так:

```bash
# 1. Остановить приложение
sudo supervisorctl stop all

# 2. Восстановить из последней резервной копии
./scripts/restore_mongodb.sh 1

# 3. Запустить приложение
sudo supervisorctl start all

# 4. Проверить данные
./scripts/check_data_integrity.sh
```

---

## Контакты и поддержка

Если возникли проблемы с deployment:
1. Проверьте логи: `tail -f /var/log/supervisor/backend.err.log`
2. Создайте резервную копию текущего состояния
3. Обратитесь к документации Emergent
4. Используйте rollback к предыдущей стабильной версии

---

**Помните:** Backup перед каждым deploy - это не опция, а необходимость!
