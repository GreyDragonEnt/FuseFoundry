#!/bin/bash
# Ultra-simple one-command deployment for Namecheap support
# This is the EASIEST command for support to run

echo "🚀 FuseFoundry Emergency Deployment - Single Command"
echo "================================================="

cd /var/www/fusefoundry || { echo "❌ Directory not found"; exit 1; }

# Pull latest changes
git pull origin main

# Quick build and restart
npm ci --production=false
npm run build
pm2 restart fusefoundry || pm2 start ecosystem.config.js

echo "✅ Emergency deployment completed!"
echo "🔗 Test at: https://fusefoundry.dev/admin/login"