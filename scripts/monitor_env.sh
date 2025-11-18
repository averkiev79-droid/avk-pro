#!/bin/bash

# Monitor and auto-fix BACKEND_URL
# This script runs periodically to ensure BACKEND_URL is correct

LOG_FILE="/var/log/env_monitor.log"
CORRECT_URL="https://avk-pro.ru"
ENV_FILE="/app/frontend/.env"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    log_message "ERROR: .env file not found at $ENV_FILE"
    exit 1
fi

# Get current BACKEND_URL
CURRENT_URL=$(grep REACT_APP_BACKEND_URL "$ENV_FILE" | cut -d'=' -f2)

if [ "$CURRENT_URL" != "$CORRECT_URL" ]; then
    log_message "WARNING: Incorrect BACKEND_URL detected: $CURRENT_URL"
    log_message "INFO: Fixing BACKEND_URL to: $CORRECT_URL"
    
    # Fix the URL
    sed -i "s|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=$CORRECT_URL|" "$ENV_FILE"
    
    # Restart frontend
    sudo supervisorctl restart frontend > /dev/null 2>&1
    
    log_message "SUCCESS: BACKEND_URL fixed and frontend restarted"
else
    log_message "INFO: BACKEND_URL is correct: $CORRECT_URL"
fi
