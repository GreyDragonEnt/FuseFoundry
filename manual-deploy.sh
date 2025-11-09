#!/bin/bash
# Manual deployment script for FuseFoundry
# Run this directly on your VPS if automated deployment isn't working

set -e

echo "🚀 Starting manual FuseFoundry deployment..."

# Navigate to app directory
cd /var/www/fusefoundry

echo "📦 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

echo "📋 Current commit:"
git log --oneline -1

echo "🔧 Installing dependencies..."
npm ci --production=false

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting application..."
pm2 restart fusefoundry || pm2 start ecosystem.config.js

echo "🧹 Clearing any reverse proxy cache..."
# If you're using nginx, clear its cache
sudo systemctl reload nginx || echo "nginx reload skipped"

echo "✅ Manual deployment completed!"
echo "🌐 Site should be updated at: https://fusefoundry.dev"

# Wait a moment for restart
sleep 3

echo "🏥 Testing health endpoint..."
curl -s -k https://fusefoundry.dev/api/health | grep -o '"status":"healthy"' && echo " ✅ Health check passed!" || echo " ⚠️ Health check failed"
