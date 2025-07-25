#!/bin/bash
# Enhanced auto-deployment webhook handler for FuseFoundry
# Safe deployment with comprehensive testing and rollback
# Place this at /var/www/fusefoundry/deploy-webhook.sh

set -e

LOG_FILE="/var/log/fusefoundry-deploy.log"
DEPLOY_USER="fusefoundry"
APP_DIR="/var/www/fusefoundry"
HEALTH_ENDPOINT="http://localhost:3000/api/health"
APP_ENDPOINT="http://localhost:3000"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to send notification (optional)
notify() {
    # Add Slack/Discord webhook or email notification here
    log "NOTIFICATION: $1"
}

# Function to run comprehensive health checks
health_check() {
    local max_attempts=10
    local attempt=1
    
    log "🏥 Running comprehensive health checks..."
    
    # Wait for application to start
    sleep 3
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        # Check if PM2 process is running
        if ! sudo -u $DEPLOY_USER pm2 show fusefoundry | grep -q "online"; then
            log "❌ PM2 process not running"
            return 1
        fi
        
        # Check health endpoint
        if curl -f -s --max-time 10 "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
            log "✅ Health endpoint responding"
        else
            log "⚠️ Health endpoint not responding (attempt $attempt)"
            if [ $attempt -eq $max_attempts ]; then
                return 1
            fi
            sleep 5
            ((attempt++))
            continue
        fi
        
        # Check main application endpoint
        if curl -f -s --max-time 10 "$APP_ENDPOINT" > /dev/null 2>&1; then
            log "✅ Main application responding"
        else
            log "⚠️ Main application not responding (attempt $attempt)"
            if [ $attempt -eq $max_attempts ]; then
                return 1
            fi
            sleep 5
            ((attempt++))
            continue
        fi
        
        # Check for JavaScript errors in the response
        local response=$(curl -s --max-time 10 "$APP_ENDPOINT" 2>/dev/null || echo "")
        if echo "$response" | grep -qi "error\|exception\|undefined"; then
            log "⚠️ Potential JavaScript errors detected in response"
            if [ $attempt -eq $max_attempts ]; then
                return 1
            fi
            sleep 5
            ((attempt++))
            continue
        fi
        
        # All checks passed
        log "✅ All health checks passed!"
        return 0
    done
    
    log "❌ Health checks failed after $max_attempts attempts"
    return 1
}

# Function to rollback to previous version
rollback() {
    log "🔄 Starting rollback process..."
    
    if [ -d "$BACKUP_DIR" ]; then
        sudo -u $DEPLOY_USER rm -rf .next
        sudo -u $DEPLOY_USER mv "$BACKUP_DIR" .next
        log "📦 Restored previous build"
        
        # Restart with previous version
        sudo -u $DEPLOY_USER pm2 restart fusefoundry
        sleep 5
        
        # Verify rollback worked
        if health_check; then
            log "✅ Rollback successful - application restored"
            notify "🔄 FuseFoundry rolled back successfully after failed deployment"
            return 0
        else
            log "❌ Rollback failed - application may be in inconsistent state"
            notify "🚨 CRITICAL: FuseFoundry rollback failed - manual intervention required"
            return 1
        fi
    else
        log "❌ No backup found for rollback"
        notify "🚨 CRITICAL: FuseFoundry deployment failed and no backup available"
        return 1
    fi
}

# Function to run build tests
test_build() {
    log "🧪 Running build tests..."
    
    # Check if build directory exists and has content
    if [ ! -d ".next" ] || [ ! "$(ls -A .next)" ]; then
        log "❌ Build directory is missing or empty"
        return 1
    fi
    
    # Check for critical build files
    local critical_files=(".next/server/app/page.js" ".next/static")
    for file in "${critical_files[@]}"; do
        if [ ! -e "$file" ]; then
            log "❌ Critical build file missing: $file"
            return 1
        fi
    done
    
    log "✅ Build tests passed"
    return 0
}

log "🚀 Starting safe auto-deployment..."

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

log "📥 New changes detected. Starting safe deployment..."

# Get commit message for logging
COMMIT_MSG=$(sudo -u $DEPLOY_USER git log --format=%B -n 1 "$AFTER_COMMIT" | head -1)
log "📝 Deploying commit: $COMMIT_MSG"

# Create backup of current build
BACKUP_DIR=".next.backup.$(date +%Y%m%d_%H%M%S)"
if [ -d ".next" ]; then
    sudo -u $DEPLOY_USER cp -r .next "$BACKUP_DIR"
    log "📦 Created backup: $BACKUP_DIR"
fi

# Store current commit for potential rollback
echo "$BEFORE_COMMIT" > .last_known_good_commit

# Pull latest changes
log "📥 Pulling latest changes..."
sudo -u $DEPLOY_USER git reset --hard origin/main

# Install/update dependencies
log "📦 Installing dependencies..."
if ! sudo -u $DEPLOY_USER npm ci --production=false; then
    log "❌ Dependency installation failed"
    notify "❌ FuseFoundry deployment failed during dependency installation"
    exit 1
fi

# Build application
log "🔨 Building application..."
if ! sudo -u $DEPLOY_USER npm run build; then
    log "❌ Build failed"
    notify "❌ FuseFoundry deployment failed during build"
    exit 1
fi

# Test the build
if ! test_build; then
    log "❌ Build tests failed"
    notify "❌ FuseFoundry deployment failed build validation"
    exit 1
fi

# Restart application
log "🔄 Restarting application..."
sudo -u $DEPLOY_USER pm2 restart fusefoundry

# Run comprehensive health checks
if health_check; then
    log "✅ Deployment successful!"
    
    # Clean up old backups (keep last 5)
    sudo -u $DEPLOY_USER find "$APP_DIR" -name ".next.backup.*" -type d | sort -r | tail -n +6 | xargs rm -rf
    
    # Update last known good commit
    echo "$AFTER_COMMIT" > .last_known_good_commit
    
    notify "✅ FuseFoundry deployed successfully! Commit: $AFTER_COMMIT - $COMMIT_MSG"
    log "🎉 Safe deployment completed successfully!"
else
    log "❌ Health checks failed! Initiating rollback..."
    
    if rollback; then
        exit 1
    else
        # Critical failure - stop the application to prevent serving broken content
        sudo -u $DEPLOY_USER pm2 stop fusefoundry
        log "🚨 Application stopped due to critical failure"
        exit 2
    fi
fi
