#!/bin/bash
# Webhook System Restart and Manual Deployment Script
# This will restart the webhook listener and trigger a manual deployment

echo "🔧 FuseFoundry Webhook System Restart"
echo "====================================="

# Configuration
APP_DIR="/var/www/fusefoundry"
DEPLOY_USER="fusefoundry"
WEBHOOK_PORT="9000"

cd "$APP_DIR"

echo "1. 🛑 Stopping existing webhook listener..."
# Kill any existing webhook processes
sudo pkill -f "webhook-listener" || echo "No webhook process found"
sudo pkill -f "node.*9000" || echo "No node process on port 9000"

echo "2. 📥 Pulling latest changes..."
sudo -u $DEPLOY_USER git fetch origin main
sudo -u $DEPLOY_USER git reset --hard origin/main

echo "3. 🔄 Installing webhook dependencies..."
sudo -u $DEPLOY_USER npm install node-fetch

echo "4. 🚀 Starting webhook listener..."
# Start webhook listener in background with PM2
sudo -u $DEPLOY_USER pm2 delete webhook-listener || echo "Webhook not in PM2"
sudo -u $DEPLOY_USER pm2 start webhook-listener.js --name "webhook-listener" --env production

echo "5. ⚙️ Setting up environment for webhook..."
# Ensure environment variables are available for webhook
if [ ! -f "/home/$DEPLOY_USER/.env" ]; then
    sudo -u $DEPLOY_USER tee "/home/$DEPLOY_USER/.env" > /dev/null << EOF
WEBHOOK_SECRET=a9b8c7d6e5f4938271f6e5d4c3b2a1908
WEBHOOK_PORT=9000
GOOGLE_AI_API_KEY=
EOF
    echo "Created webhook environment file"
fi

echo "6. 🧪 Testing webhook listener..."
sleep 3

# Test webhook listener health
WEBHOOK_STATUS=$(curl -s "http://localhost:$WEBHOOK_PORT/status" 2>/dev/null || echo "failed")
if [[ "$WEBHOOK_STATUS" == *"healthy"* ]]; then
    echo "✅ Webhook listener is healthy: $WEBHOOK_STATUS"
else
    echo "❌ Webhook listener test failed. Attempting manual start..."
    
    # Manual start as fallback
    sudo -u $DEPLOY_USER nohup node webhook-listener.js > /var/log/webhook.log 2>&1 &
    sleep 3
    
    WEBHOOK_STATUS=$(curl -s "http://localhost:$WEBHOOK_PORT/status" 2>/dev/null || echo "still failed")
    echo "Fallback status: $WEBHOOK_STATUS"
fi

echo "7. 🔄 Triggering manual deployment..."
# Run manual deployment to get latest changes
chmod +x manual-deploy.sh
./manual-deploy.sh

echo "8. 📊 Final system status check..."
echo ""
echo "Webhook Status: $(curl -s http://localhost:$WEBHOOK_PORT/status 2>/dev/null || echo 'Not responding')"
echo "App Health: $(curl -s https://fusefoundry.dev/api/health | head -c 200 || echo 'App not responding')..."
echo ""

echo "🎉 Webhook system restart complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Configure GitHub webhook URL: https://fusefoundry.dev:9000/webhook"
echo "   2. Set webhook secret in GitHub: a9b8c7d6e5f4938271f6e5d4c3b2a1908"
echo "   3. Test by pushing a commit to main branch"
echo ""
echo "📊 Monitor webhook with:"
echo "   - Status: curl http://localhost:9000/status"
echo "   - Logs: sudo tail -f /var/log/webhook.log"
echo "   - PM2: sudo -u $DEPLOY_USER pm2 logs webhook-listener"