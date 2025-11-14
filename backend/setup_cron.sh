#!/bin/bash
# Setup cron job for automatic article publishing
# Runs every Monday at 10:00 AM

# Create log directory
mkdir -p /var/log

# Create cron job
CRON_COMMAND="0 10 * * 1 cd /app/backend && /usr/bin/python3 /app/backend/auto_publish_articles.py >> /var/log/auto_articles.log 2>&1"

# Check if cron job already exists
(crontab -l 2>/dev/null | grep -v "/app/backend/auto_publish_articles.py"; echo "$CRON_COMMAND") | crontab -

echo "✅ Cron job installed successfully!"
echo "Schedule: Every Monday at 10:00 AM"
echo "Command: $CRON_COMMAND"
echo ""
echo "To view cron jobs: crontab -l"
echo "To view logs: tail -f /var/log/auto_articles.log"
