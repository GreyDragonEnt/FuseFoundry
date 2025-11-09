#!/bin/bash
# Test deployment and webhook functionality
# Run this to verify everything is working

echo "🧪 FuseFoundry Deployment Test"
echo "=============================="

# Test webhook listener
echo "1. Testing webhook listener..."
WEBHOOK_RESPONSE=$(curl -s "http://localhost:9000/status" 2>/dev/null)
if [[ "$WEBHOOK_RESPONSE" == *"healthy"* ]]; then
    echo "✅ Webhook listener is healthy"
    echo "   Response: $WEBHOOK_RESPONSE"
else
    echo "❌ Webhook listener is not responding"
    echo "   Trying to start it..."
    cd /var/www/fusefoundry
    sudo -u fusefoundry pm2 restart webhook-listener || sudo -u fusefoundry nohup node webhook-listener.js &
fi

# Test main application
echo ""
echo "2. Testing main application..."
APP_RESPONSE=$(curl -s "https://fusefoundry.dev/api/health")
if [[ "$APP_RESPONSE" == *"healthy"* ]]; then
    echo "✅ Main application is healthy"
    echo "   Uptime: $(echo $APP_RESPONSE | grep -o '"uptime":[0-9]*' | cut -d':' -f2)"
else
    echo "❌ Main application is not responding properly"
fi

# Test admin routes (the main issue)
echo ""
echo "3. Testing admin routes..."
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://fusefoundry.dev/admin/login")
if [[ "$ADMIN_RESPONSE" == "200" ]]; then
    echo "✅ Admin routes are working (HTTP $ADMIN_RESPONSE)"
else
    echo "❌ Admin routes still returning HTTP $ADMIN_RESPONSE"
fi

# Test if latest changes are deployed
echo ""
echo "4. Checking deployment status..."
CURRENT_COMMIT=$(cd /var/www/fusefoundry && git rev-parse HEAD | cut -c1-7)
LATEST_COMMIT=$(cd /var/www/fusefoundry && git rev-parse origin/main | cut -c1-7)

echo "   Current deployed commit: $CURRENT_COMMIT"
echo "   Latest available commit: $LATEST_COMMIT"

if [[ "$CURRENT_COMMIT" == "$LATEST_COMMIT" ]]; then
    echo "✅ Latest changes are deployed"
else
    echo "❌ Deployment is behind. Need to update."
    echo "   Run: cd /var/www/fusefoundry && ./manual-deploy.sh"
fi

# Check nginx configuration
echo ""
echo "5. Checking nginx configuration..."
if sudo nginx -t 2>/dev/null; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
fi

echo ""
echo "📊 Summary:"
echo "=========="
if [[ "$WEBHOOK_RESPONSE" == *"healthy"* ]] && [[ "$APP_RESPONSE" == *"healthy"* ]] && [[ "$ADMIN_RESPONSE" == "200" ]] && [[ "$CURRENT_COMMIT" == "$LATEST_COMMIT" ]]; then
    echo "🎉 All systems are working correctly!"
else
    echo "⚠️  Some issues detected. Run the following to fix:"
    echo "     cd /var/www/fusefoundry"
    echo "     ./restart-webhook.sh"
fi