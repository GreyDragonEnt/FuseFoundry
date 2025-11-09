#!/bin/bash
#!/bin/bash
# Manual Production Fix - Run this on your production server
# This will immediately fix the admin routes and apply all configurations

echo "� Applying FuseFoundry Production Fixes..."

# Change to app directory
cd /var/www/fusefoundry

# Pull latest changes
echo "� Pulling latest changes..."
sudo -u fusefoundry git pull origin main

# Apply environment variables
echo "⚙️ Applying environment configuration..."
if [ -f ".env.production" ]; then
    sudo chown fusefoundry:fusefoundry .env.production
    sudo chmod 600 .env.production
fi

# Fix nginx configuration for admin routes
echo "🌐 Fixing nginx configuration..."
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

    # Primary location block for the app
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
        
        # Important: Don't cache admin pages
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
            proxy_read_timeout 86400;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # Static files
    location /_next/static {
        alias /var/www/fusefoundry/.next/static;
        expires 365d;
        access_log off;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

# Enable site and reload nginx
sudo ln -sf /etc/nginx/sites-available/fusefoundry /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Rebuild application
echo "🔨 Building application..."
sudo -u fusefoundry npm ci --production=false
sudo -u fusefoundry npm run build

# Restart PM2
echo "🔄 Restarting application..."
sudo -u fusefoundry pm2 restart fusefoundry || sudo -u fusefoundry pm2 start ecosystem.config.js

# Test the fix
echo "🧪 Testing fixes..."
sleep 10

# Test admin route
if curl -f -s http://localhost:3000/admin/login > /dev/null; then
    echo "✅ Admin routes are now working!"
else
    echo "⚠️ Admin routes still need attention"
fi

# Test main site
if curl -f -s https://fusefoundry.dev > /dev/null; then
    echo "✅ Main site is working"
else
    echo "❌ Main site has issues"
fi

echo "🎉 Production fixes applied!"
echo "Admin panel should now be accessible at: https://fusefoundry.dev/admin/login"
echo "Login with: admin@fusefoundry.dev / FuseFoundry2025!"
