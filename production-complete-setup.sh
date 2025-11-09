#!/bin/bash
# FuseFoundry Production Server Setup Script
# Run this on your production VPS to complete the setup

set -e

echo "🚀 FuseFoundry Production Setup Script"
echo "======================================"

# Configuration
APP_DIR="/var/www/fusefoundry"
DEPLOY_USER="fusefoundry" 
LOG_FILE="/var/log/fusefoundry-setup.log"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "Starting FuseFoundry production setup..."

# Step 1: Check if the app directory exists
if [ ! -d "$APP_DIR" ]; then
    log "Creating application directory..."
    sudo mkdir -p "$APP_DIR"
    sudo chown -R $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"
fi

cd "$APP_DIR"

# Step 2: Setup database
log "Setting up production database..."
if [ -f "setup-production-database.sh" ]; then
    chmod +x setup-production-database.sh
    sudo ./setup-production-database.sh
else
    log "⚠️  Database setup script not found. Manual setup required."
fi

# Step 3: Create environment file
log "Setting up environment variables..."
if [ ! -f ".env.production" ]; then
    if [ -f ".env.production.example" ]; then
        sudo -u $DEPLOY_USER cp .env.production.example .env.production
        log "Created .env.production from template"
        
        # Generate secure secrets
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
        WEBHOOK_SECRET=$(openssl rand -base64 32)
        
        # Update environment file with generated secrets
        sudo -u $DEPLOY_USER sed -i "s/your-super-secret-production-key-here-change-this/$NEXTAUTH_SECRET/" .env.production
        sudo -u $DEPLOY_USER sed -i "s/your-github-webhook-secret/$WEBHOOK_SECRET/" .env.production
        
        log "✅ Environment file configured with secure secrets"
    else
        log "⚠️  Environment template not found. Creating basic environment file..."
        sudo -u $DEPLOY_USER tee .env.production > /dev/null << EOF
NODE_ENV=production
DATABASE_URL=postgresql://fusefoundry:change_this_password@localhost:5432/fusefoundry_production
USE_MOCK_DB=false
NEXTAUTH_URL=https://fusefoundry.dev
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=admin@fusefoundry.dev
ADMIN_PASSWORD=FuseFoundry2025!
WEBHOOK_SECRET=$(openssl rand -base64 32)
WEBHOOK_PORT=9000
EOF
    fi
    sudo chmod 600 .env.production
    sudo chown $DEPLOY_USER:$DEPLOY_USER .env.production
else
    log "Environment file already exists"
fi

# Step 4: Build and restart application
log "Building application..."
sudo -u $DEPLOY_USER npm ci --production=false
sudo -u $DEPLOY_USER npm run build

log "Restarting application..."
sudo -u $DEPLOY_USER pm2 restart fusefoundry || sudo -u $DEPLOY_USER pm2 start ecosystem.config.js

# Step 5: Setup nginx configuration (if needed)
log "Checking nginx configuration..."
NGINX_CONF="/etc/nginx/sites-available/fusefoundry"
if [ ! -f "$NGINX_CONF" ]; then
    log "Creating nginx configuration..."
    sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fusefoundry.dev www.fusefoundry.dev;

    ssl_certificate /var/www/fusefoundry/SSL/fusefoundry_dev.crt;
    ssl_certificate_key /var/www/fusefoundry/SSL/fusefoundry_dev.key;

    root /var/www/fusefoundry;
    index index.html index.htm;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle Next.js static files
    location /_next/static {
        alias /var/www/fusefoundry/.next/static;
        expires 365d;
        access_log off;
    }

    # Handle admin routes specifically
    location /admin {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name fusefoundry.dev www.fusefoundry.dev;
    return 301 https://$server_name$request_uri;
}
EOF

    # Enable the site
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    log "✅ Nginx configuration created and enabled"
else
    log "Nginx configuration already exists"
fi

# Step 6: Wait and test
log "Waiting for application to start..."
sleep 15

# Test health endpoint
for i in {1..5}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "✅ Application health check passed!"
        
        # Test admin routes
        if curl -f http://localhost:3000/admin/login > /dev/null 2>&1; then
            log "✅ Admin routes are accessible!"
        else
            log "⚠️  Admin routes may need additional configuration"
        fi
        break
    else
        log "⏳ Health check attempt $i failed, retrying..."
        sleep 5
    fi
done

# Display status
log "Setup completed! Checking final status..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health 2>/dev/null || echo "Health check failed")
log "Health Status: $HEALTH_RESPONSE"

echo ""
echo "🎉 FuseFoundry Production Setup Complete!"
echo "=========================================="
echo ""
echo "✅ Application Status:"
echo "   - Main Site: https://fusefoundry.dev"
echo "   - Admin Panel: https://fusefoundry.dev/admin/login"
echo "   - Health Check: https://fusefoundry.dev/api/health"
echo ""
echo "🔧 Next Steps:"
echo "   1. Configure GOOGLE_AI_API_KEY in .env.production for AI features"
echo "   2. Test admin login with: admin@fusefoundry.dev / FuseFoundry2025!"
echo "   3. Generate test reports to verify functionality"
echo ""
echo "📋 Configuration Files:"
echo "   - Environment: $APP_DIR/.env.production"
echo "   - Nginx: /etc/nginx/sites-available/fusefoundry"
echo "   - Logs: /var/log/fusefoundry-*.log"
echo ""
echo "📊 Monitor with: sudo tail -f /var/log/fusefoundry-*.log"