#!/bin/bash
# Enhanced deployment script for FuseFoundry with environment setup
# Place this at /var/www/fusefoundry/deploy-enhanced.sh

set -e

LOG_FILE="/var/log/fusefoundry-deploy.log"
DEPLOY_USER="fusefoundry"
APP_DIR="/var/www/fusefoundry"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to send notification (optional)
notify() {
    log "NOTIFICATION: $1"
}

log "🚀 Starting enhanced deployment..."

# Change to application directory
cd "$APP_DIR"

# Check if there are any changes
BEFORE_COMMIT=$(sudo -u $DEPLOY_USER git rev-parse HEAD)
log "Current commit: $BEFORE_COMMIT"

# Fetch latest changes
sudo -u $DEPLOY_USER git fetch origin main

AFTER_COMMIT=$(sudo -u $DEPLOY_USER git rev-parse origin/main)
log "Latest commit: $AFTER_COMMIT"

# Check if update is needed
if [ "$BEFORE_COMMIT" = "$AFTER_COMMIT" ]; then
    log "✅ No updates needed. Application is up to date."
    exit 0
fi

log "📥 New changes detected. Starting deployment..."

# Create backup of current build
BACKUP_DIR=".next.backup.$(date +%Y%m%d_%H%M%S)"
if [ -d ".next" ]; then
    sudo -u $DEPLOY_USER cp -r .next "$BACKUP_DIR"
    log "📦 Created backup: $BACKUP_DIR"
fi

# Pull latest changes
log "📥 Pulling latest changes..."
sudo -u $DEPLOY_USER git reset --hard origin/main

# Install/update dependencies
log "📦 Installing dependencies..."
sudo -u $DEPLOY_USER npm ci --production=false

# Setup production environment if not exists
if [ ! -f ".env.production" ]; then
    log "🔧 Setting up production environment..."
    if [ -f ".env.production.example" ]; then
        sudo -u $DEPLOY_USER cp .env.production.example .env.production
        log "⚠️  Please configure .env.production with actual values"
    fi
fi

# Build application
log "🔨 Building application..."
sudo -u $DEPLOY_USER npm run build

# Restart application
log "🔄 Restarting application..."
sudo -u $DEPLOY_USER pm2 restart fusefoundry

# Wait for startup
sleep 10

# Health check with retries
log "🏥 Running health checks..."
for i in {1..5}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "✅ Health check passed on attempt $i!"
        
        # Get health details
        HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
        log "Health Status: $HEALTH_RESPONSE"
        
        # Clean up old backups (keep last 5)
        sudo -u $DEPLOY_USER find "$APP_DIR" -name ".next.backup.*" -type d | sort -r | tail -n +6 | xargs rm -rf
        
        notify "✅ FuseFoundry deployed successfully! Commit: $AFTER_COMMIT"
        
        # Check if admin routes are working
        if curl -f http://localhost:3000/admin/login > /dev/null 2>&1; then
            log "✅ Admin routes are accessible"
        else
            log "⚠️  Admin routes may have issues"
        fi
        
        exit 0
    else
        log "⏳ Health check failed on attempt $i, retrying in 5 seconds..."
        sleep 5
    fi
done

log "❌ Health check failed after 5 attempts! Rolling back..."

# Rollback
if [ -d "$BACKUP_DIR" ]; then
    sudo -u $DEPLOY_USER rm -rf .next
    sudo -u $DEPLOY_USER mv "$BACKUP_DIR" .next
    sudo -u $DEPLOY_USER pm2 restart fusefoundry
    log "🔄 Rolled back to previous version"
fi

notify "❌ FuseFoundry deployment failed! Rolled back to previous version."
exit 1