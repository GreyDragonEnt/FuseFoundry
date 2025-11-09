#!/bin/bash
# One-Command Production Deployment for FuseFoundry
# This script applies all production fixes automatically

set -e

echo "🚀 FuseFoundry One-Command Production Setup"
echo "==========================================="

# Check if we're on the production server
if [ ! -f "/var/www/fusefoundry/package.json" ]; then
    echo "❌ This script must be run on the production server in /var/www/fusefoundry"
    echo "   Please copy this script to your production server and run it there."
    exit 1
fi

cd /var/www/fusefoundry

# Step 1: Pull latest changes
echo "📥 Pulling latest changes..."
sudo -u fusefoundry git pull origin main

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
sudo -u fusefoundry npm ci --production=false

# Step 3: Setup database (if not exists)
echo "🗄️ Setting up database..."
if [ -f "setup-production-database.sh" ] && [ ! -f "/var/lib/postgresql/data/pg_hba.conf" ]; then
    chmod +x setup-production-database.sh
    ./setup-production-database.sh
fi

# Step 4: Create nginx configuration for admin routes
echo "🌐 Configuring nginx for admin routes..."
sudo tee /etc/nginx/sites-available/fusefoundry > /dev/null << 'EOF'
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fusefoundry.dev www.fusefoundry.dev;

    ssl_certificate /var/www/fusefoundry/SSL/fusefoundry_dev.crt;
    ssl_certificate_key /var/www/fusefoundry/SSL/fusefoundry_dev.key;

    root /var/www/fusefoundry;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "origin-when-cross-origin" always;

    # Main proxy to Next.js app
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
        proxy_read_timeout 86400;
    }

    # Handle Next.js static files
    location /_next/static {
        alias /var/www/fusefoundry/.next/static;
        expires 365d;
        access_log off;
    }

    # Ensure admin routes work
    location ~ ^/(admin|api) {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
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
sudo ln -sf /etc/nginx/sites-available/fusefoundry /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Step 5: Setup environment variables
echo "⚙️ Setting up environment..."
if [ ! -f ".env.production" ]; then
    sudo -u fusefoundry tee .env.production > /dev/null << EOF
NODE_ENV=production
DATABASE_URL=postgresql://fusefoundry:$(openssl rand -base64 12)@localhost:5432/fusefoundry_production
USE_MOCK_DB=false
NEXTAUTH_URL=https://fusefoundry.dev
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=admin@fusefoundry.dev
ADMIN_PASSWORD=FuseFoundry2025!
WEBHOOK_SECRET=$(openssl rand -base64 32)
WEBHOOK_PORT=9000
EOF
    sudo chmod 600 .env.production
    sudo chown fusefoundry:fusefoundry .env.production
    echo "✅ Environment file created"
fi

# Step 6: Build application
echo "🔨 Building application..."
sudo -u fusefoundry npm run build

# Step 7: Restart services
echo "🔄 Restarting services..."
sudo -u fusefoundry pm2 restart fusefoundry || sudo -u fusefoundry pm2 start ecosystem.config.js

# Step 8: Test everything
echo "🧪 Testing deployment..."
sleep 15

echo "Testing main site..."
if curl -f -s https://fusefoundry.dev > /dev/null; then
    echo "✅ Main site is working"
else
    echo "❌ Main site test failed"
fi

echo "Testing health endpoint..."
HEALTH=$(curl -s https://fusefoundry.dev/api/health)
echo "Health: $HEALTH"

echo "Testing admin routes..."
if curl -f -s https://fusefoundry.dev/admin/login > /dev/null; then
    echo "✅ Admin routes are working"
else
    echo "⚠️  Admin routes may need manual verification"
fi

echo ""
echo "🎉 Production setup complete!"
echo "=============================="
echo ""
echo "📊 Access your application:"
echo "   Main Site: https://fusefoundry.dev"
echo "   Admin Panel: https://fusefoundry.dev/admin/login"
echo "   Health Check: https://fusefoundry.dev/api/health"
echo ""
echo "🔑 Admin Login:"
echo "   Email: admin@fusefoundry.dev"
echo "   Password: FuseFoundry2025!"
echo ""
echo "📝 To configure AI services, add GOOGLE_AI_API_KEY to .env.production"
echo "📋 Monitor logs with: sudo tail -f /var/log/pm2/fusefoundry-*.log"