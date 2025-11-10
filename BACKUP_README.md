Создан README для восстановления
# ИНСТРУКЦИЯ ПО ВОССТАНОВЛЕНИЮ ДИЗАЙНА

## Бэкап создан: $(date)

### Для восстановления предыдущего дизайна:

1. Копируем файлы обратно:
```bash
cp -r /app/frontend/src/pages_backup/*.jsx /app/frontend/src/pages/
cp -r /app/frontend/src/components_backup/*.jsx /app/frontend/src/components/
cp /app/frontend/src/App_backup.css /app/frontend/src/App.css
cp /app/frontend/src/index_backup.css /app/frontend/src/index.css
cp /app/frontend/src/mock_backup.js /app/frontend/src/mock.js
```

2. Перезапускаем frontend:
```bash
sudo supervisorctl restart frontend
```

### Расположение бэкапов:
- Страницы: /app/frontend/src/pages_backup/
- Компоненты: /app/frontend/src/components_backup/
- Стили: /app/frontend/src/*_backup.css
- Данные: /app/frontend/src/mock_backup.js

