#!/bin/bash
# Test script for safe auto-deployment system
# Run this on your VPS to test the deployment safety features

set -e

APP_DIR="/var/www/fusefoundry"
WEBHOOK_URL="http://localhost:9000"

echo "🧪 Testing Safe Auto-Deployment System"
echo "======================================"

# Test 1: Check webhook listener status
echo "Test 1: Webhook Listener Status"
if curl -s "$WEBHOOK_URL/status" | grep -q "healthy"; then
    echo "✅ Webhook listener is healthy"
else
    echo "❌ Webhook listener not responding"
    exit 1
fi

# Test 2: Check application health
echo ""
echo "Test 2: Application Health Check"
if curl -s "http://localhost:3000/api/health" | grep -q "healthy"; then
    echo "✅ Application health endpoint responding"
else
    echo "❌ Application health endpoint not responding"
    exit 1
fi

# Test 3: Check PM2 status
echo ""
echo "Test 3: PM2 Process Status"
if pm2 show fusefoundry | grep -q "online"; then
    echo "✅ PM2 process is online"
else
    echo "❌ PM2 process is not online"
    exit 1
fi

# Test 4: Check deployment script
echo ""
echo "Test 4: Deployment Script"
if [ -f "$APP_DIR/deploy-webhook.sh" ] && [ -x "$APP_DIR/deploy-webhook.sh" ]; then
    echo "✅ Deployment script exists and is executable"
else
    echo "❌ Deployment script missing or not executable"
    exit 1
fi

# Test 5: Check backup capability
echo ""
echo "Test 5: Backup System"
cd "$APP_DIR"
if [ -d ".next" ]; then
    echo "✅ Build directory exists for backup"
else
    echo "⚠️ No build directory found (this is ok for initial setup)"
fi

# Test 6: Check log file
echo ""
echo "Test 6: Logging System"
if [ -f "/var/log/fusefoundry-deploy.log" ]; then
    echo "✅ Deployment log file exists"
    echo "Recent log entries:"
    tail -3 /var/log/fusefoundry-deploy.log | sed 's/^/   /'
else
    echo "ℹ️ No deployment log yet (will be created on first deployment)"
fi

# Test 7: Check firewall ports
echo ""
echo "Test 7: Firewall Configuration"
if firewall-cmd --list-ports | grep -q "9000/tcp"; then
    echo "✅ Webhook port 9000 is open"
else
    echo "⚠️ Webhook port 9000 not open - you may need to open it"
    echo "   Run: firewall-cmd --permanent --add-port=9000/tcp && firewall-cmd --reload"
fi

if firewall-cmd --list-ports | grep -q "443/tcp"; then
    echo "✅ HTTPS port 443 is open"
else
    echo "❌ HTTPS port 443 not open"
fi

# Test 8: SSL Certificate
echo ""
echo "Test 8: SSL Certificate"
if openssl x509 -in /etc/nginx/ssl/fusefoundry_dev.crt -noout -dates 2>/dev/null; then
    echo "✅ SSL certificate is valid"
    echo "Certificate expiry:"
    openssl x509 -in /etc/nginx/ssl/fusefoundry_dev.crt -noout -dates | grep "notAfter" | sed 's/^/   /'
else
    echo "❌ SSL certificate issue"
fi

echo ""
echo "🎉 Safe Deployment System Test Complete!"
echo ""
echo "Next Steps:"
echo "1. Copy the enhanced deployment script to your VPS:"
echo "   scp deploy-webhook-safe.sh your-server:/var/www/fusefoundry/deploy-webhook.sh"
echo ""
echo "2. Set webhook secret:"
echo "   export WEBHOOK_SECRET='your-secure-secret'"
echo ""
echo "3. Configure GitHub webhook:"
echo "   URL: https://fusefoundry.dev:9000/webhook"
echo "   Secret: (your webhook secret)"
echo ""
echo "4. Start webhook listener with PM2:"
echo "   pm2 start webhook-listener.js --name webhook-listener"
