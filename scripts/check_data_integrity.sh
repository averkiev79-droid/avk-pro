#!/bin/bash

# Data Integrity Check Script для A.V.K. SPORT

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DB_NAME="test_database"

echo -e "${YELLOW}==================================${NC}"
echo -e "${YELLOW}  DATA INTEGRITY CHECK${NC}"
echo -e "${YELLOW}==================================${NC}"
echo ""
echo -e "Database: ${GREEN}$DB_NAME${NC}"
echo ""

# Проверить основные коллекции
echo -e "${BLUE}Collection counts:${NC}"
PRODUCTS=$(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments()')
USERS=$(mongosh $DB_NAME --quiet --eval 'db.users.countDocuments()')
ORDERS=$(mongosh $DB_NAME --quiet --eval 'db.orders.countDocuments()')
ARTICLES=$(mongosh $DB_NAME --quiet --eval 'db.articles.countDocuments()')
REVIEWS=$(mongosh $DB_NAME --quiet --eval 'db.reviews.countDocuments()')
CLUBS=$(mongosh $DB_NAME --quiet --eval 'db.hockey_clubs.countDocuments()')

echo -e "  Products:     ${GREEN}$PRODUCTS${NC}"
echo -e "  Users:        ${GREEN}$USERS${NC}"
echo -e "  Orders:       ${GREEN}$ORDERS${NC}"
echo -e "  Articles:     ${GREEN}$ARTICLES${NC}"
echo -e "  Reviews:      ${GREEN}$REVIEWS${NC}"
echo -e "  Hockey Clubs: ${GREEN}$CLUBS${NC}"
echo ""

# Проверить товары без изображений
PRODUCTS_NO_IMAGES=$(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments({$or: [{images: {$exists: false}}, {images: {$size: 0}}]})')
if [ "$PRODUCTS_NO_IMAGES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Products without images: $PRODUCTS_NO_IMAGES${NC}"
else
    echo -e "${GREEN}✓ All products have images${NC}"
fi

# Проверить активные товары
ACTIVE_PRODUCTS=$(mongosh $DB_NAME --quiet --eval 'db.products.countDocuments({is_active: true})')
echo -e "Active products: ${GREEN}$ACTIVE_PRODUCTS${NC} / ${BLUE}$PRODUCTS${NC}"

# Проверить наличие администратора
ADMIN_COUNT=$(mongosh $DB_NAME --quiet --eval 'db.users.countDocuments({role: "admin"})')
if [ "$ADMIN_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ No admin users found!${NC}"
else
    echo -e "${GREEN}✓ Admin users: $ADMIN_COUNT${NC}"
fi

echo ""

# Проверить последние изменения
echo -e "${BLUE}Recent activity:${NC}"

# Последний созданный товар
LAST_PRODUCT=$(mongosh $DB_NAME --quiet --eval 'db.products.find({}, {name: 1, created_at: 1, _id: 0}).sort({created_at: -1}).limit(1).toArray()[0]')
if [ ! -z "$LAST_PRODUCT" ]; then
    echo -e "  Last product: ${GREEN}$(echo $LAST_PRODUCT | grep -o '"name":"[^"]*"' | cut -d'"' -f4)${NC}"
fi

# Последний заказ
LAST_ORDER=$(mongosh $DB_NAME --quiet --eval 'db.orders.find({}, {created_at: 1, _id: 0}).sort({created_at: -1}).limit(1).toArray()[0]')
if [ ! -z "$LAST_ORDER" ] && [ "$LAST_ORDER" != "null" ]; then
    echo -e "  Last order: ${GREEN}$(echo $LAST_ORDER | grep -o '"created_at":"[^"]*"' | cut -d'"' -f4)${NC}"
else
    echo -e "  ${YELLOW}No orders yet${NC}"
fi

echo ""
echo -e "${GREEN}✓ Data integrity check complete!${NC}"
echo -e "${YELLOW}==================================${NC}"
