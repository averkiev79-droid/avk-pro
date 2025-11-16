#!/bin/bash

# MongoDB Restore Script для A.V.K. SPORT
# Использование: ./restore_mongodb.sh [путь_к_резервной_копии]

# Переменные
BACKUP_DIR="/app/backups"
DB_NAME="test_database"

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  MongoDB Restore Script${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Проверить, передан ли путь к резервной копии
if [ -z "$1" ]; then
    echo -e "${BLUE}Доступные резервные копии:${NC}"
    echo ""
    
    # Показать список резервных копий
    BACKUPS=($(ls -dt $BACKUP_DIR/backup_*/ 2>/dev/null))
    
    if [ ${#BACKUPS[@]} -eq 0 ]; then
        echo -e "${RED}✗ Не найдено резервных копий в $BACKUP_DIR${NC}"
        echo -e "${YELLOW}Сначала создайте резервную копию с помощью backup_mongodb.sh${NC}"
        exit 1
    fi
    
    # Пронумеровать резервные копии
    i=1
    for backup in "${BACKUPS[@]}"; do
        backup_name=$(basename "$backup")
        backup_size=$(du -sh "$backup" | cut -f1)
        backup_date=$(echo "$backup_name" | sed 's/backup_//' | sed 's/_/ /')
        echo -e "  ${GREEN}[$i]${NC} $backup_name (размер: $backup_size)"
        ((i++))
    done
    
    echo ""
    echo -e "${YELLOW}Использование:${NC}"
    echo -e "  ${GREEN}./restore_mongodb.sh <номер_резервной_копии>${NC}"
    echo -e "  или"
    echo -e "  ${GREEN}./restore_mongodb.sh <полный_путь_к_резервной_копии>${NC}"
    echo ""
    echo -e "Пример:"
    echo -e "  ${GREEN}./restore_mongodb.sh 1${NC}  - восстановить самую свежую резервную копию"
    echo -e "  ${GREEN}./restore_mongodb.sh /app/backups/backup_20241116_120000/${NC}"
    echo ""
    exit 0
fi

# Определить путь к резервной копии
if [[ "$1" =~ ^[0-9]+$ ]]; then
    # Если передан номер, выбрать соответствующую резервную копию
    BACKUPS=($(ls -dt $BACKUP_DIR/backup_*/ 2>/dev/null))
    index=$(($1 - 1))
    
    if [ $index -lt 0 ] || [ $index -ge ${#BACKUPS[@]} ]; then
        echo -e "${RED}✗ Неверный номер резервной копии${NC}"
        exit 1
    fi
    
    BACKUP_PATH="${BACKUPS[$index]}"
else
    # Если передан путь, использовать его
    BACKUP_PATH="$1"
fi

# Убрать завершающий слэш
BACKUP_PATH="${BACKUP_PATH%/}"

# Проверить, существует ли путь
if [ ! -d "$BACKUP_PATH" ]; then
    echo -e "${RED}✗ Резервная копия не найдена: $BACKUP_PATH${NC}"
    exit 1
fi

# Проверить, есть ли в резервной копии директория с базой данных
if [ ! -d "$BACKUP_PATH/$DB_NAME" ]; then
    echo -e "${RED}✗ В резервной копии не найдена база данных: $DB_NAME${NC}"
    echo -e "${YELLOW}Содержимое резервной копии:${NC}"
    ls -la "$BACKUP_PATH"
    exit 1
fi

# Показать информацию о восстановлении
BACKUP_NAME=$(basename "$BACKUP_PATH")
BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)

echo -e "База данных: ${GREEN}$DB_NAME${NC}"
echo -e "Резервная копия: ${GREEN}$BACKUP_NAME${NC}"
echo -e "Размер: ${GREEN}$BACKUP_SIZE${NC}"
echo -e "Путь: ${GREEN}$BACKUP_PATH${NC}"
echo ""

# Предупреждение
echo -e "${RED}⚠️  ВНИМАНИЕ!${NC}"
echo -e "${YELLOW}Эта операция удалит все текущие данные в базе '$DB_NAME'${NC}"
echo -e "${YELLOW}и заменит их данными из резервной копии.${NC}"
echo ""

# Запросить подтверждение
read -p "Вы уверены, что хотите продолжить? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo -e "${YELLOW}Операция отменена${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Восстановление базы данных...${NC}"

# Восстановить базу данных
mongorestore --db=$DB_NAME --drop "$BACKUP_PATH/$DB_NAME/"

# Проверить успешность
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ База данных успешно восстановлена!${NC}"
    echo ""
    
    # Показать статистику
    echo -e "${YELLOW}Статистика восстановленной базы данных:${NC}"
    mongosh $DB_NAME --quiet --eval "
        const collections = db.getCollectionNames();
        print('  Коллекций: ' + collections.length);
        collections.forEach(col => {
            const count = db[col].countDocuments();
            print('  - ' + col + ': ' + count + ' документов');
        });
    "
    
    echo ""
    echo -e "${GREEN}✓ Восстановление завершено успешно!${NC}"
    echo -e "${YELLOW}========================================${NC}"
    
    exit 0
else
    echo ""
    echo -e "${RED}✗ Ошибка при восстановлении базы данных${NC}"
    echo -e "${RED}Проверьте, что MongoDB запущен и доступен${NC}"
    echo -e "${YELLOW}========================================${NC}"
    exit 1
fi
