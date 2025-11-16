#!/bin/bash

# MongoDB Backup Script для A.V.K. SPORT
# Использование: ./backup_mongodb.sh

# Переменные
BACKUP_DIR="/app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="test_database"
RETENTION_DAYS=7  # Хранить резервные копии за последние 7 дней

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Создать директорию для резервных копий
mkdir -p $BACKUP_DIR

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  MongoDB Backup Script${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "База данных: ${GREEN}$DB_NAME${NC}"
echo -e "Директория: ${GREEN}$BACKUP_DIR${NC}"
echo -e "Дата/время: ${GREEN}$DATE${NC}"
echo ""

# Создать резервную копию
echo -e "${YELLOW}Создание резервной копии...${NC}"
mongodump --db=$DB_NAME --out=$BACKUP_DIR/backup_$DATE

# Проверить успешность
if [ $? -eq 0 ]; then
    # Получить размер резервной копии
    BACKUP_SIZE=$(du -sh $BACKUP_DIR/backup_$DATE | cut -f1)
    
    echo ""
    echo -e "${GREEN}✓ Резервная копия успешно создана!${NC}"
    echo -e "  Путь: ${GREEN}$BACKUP_DIR/backup_$DATE${NC}"
    echo -e "  Размер: ${GREEN}$BACKUP_SIZE${NC}"
    echo ""
    
    # Удалить старые резервные копии (старше RETENTION_DAYS дней)
    echo -e "${YELLOW}Удаление резервных копий старше $RETENTION_DAYS дней...${NC}"
    
    # Подсчитать количество удаляемых резервных копий
    OLD_BACKUPS=$(find $BACKUP_DIR -type d -name "backup_*" -mtime +$RETENTION_DAYS | wc -l)
    
    if [ $OLD_BACKUPS -gt 0 ]; then
        find $BACKUP_DIR -type d -name "backup_*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
        echo -e "${GREEN}✓ Удалено старых резервных копий: $OLD_BACKUPS${NC}"
    else
        echo -e "${GREEN}✓ Нет старых резервных копий для удаления${NC}"
    fi
    
    echo ""
    
    # Показать список всех резервных копий
    echo -e "${YELLOW}Доступные резервные копии:${NC}"
    ls -lh $BACKUP_DIR | grep "backup_" | awk '{print "  " $9 " - " $5}'
    
    echo ""
    echo -e "${GREEN}✓ Резервное копирование завершено успешно!${NC}"
    echo -e "${YELLOW}========================================${NC}"
    
    exit 0
else
    echo ""
    echo -e "${RED}✗ Ошибка при создании резервной копии${NC}"
    echo -e "${RED}Проверьте, что MongoDB запущен и доступен${NC}"
    echo -e "${YELLOW}========================================${NC}"
    exit 1
fi
