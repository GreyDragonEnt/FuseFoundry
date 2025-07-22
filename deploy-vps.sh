#!/bin/bash
# FuseFoundry VPS Deployment Script for Namecheap
# Run this script on a fresh Ubuntu VPS

set -e

echo "🚀 Starting FuseFoundry VPS Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional tools
echo "📦 Installing additional tools..."
sudo apt install -y git nginx certbot python3-certbot-nginx ufw

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application user
echo "👤 Creating application user..."
sudo useradd -m -s /bin/bash fusefoundry
sudo usermod -aG sudo fusefoundry

# Setup application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/fusefoundry
sudo chown fusefoundry:fusefoundry /var/www/fusefoundry

# Switch to application user for the rest
echo "🔄 Switching to application user..."
sudo -u fusefoundry bash << 'EOF'
cd /var/www/fusefoundry

# Clone the repository
echo "📥 Cloning FuseFoundry repository..."
git clone https://github.com/GreyDragonEnt/FuseFoundry.git .

# Install dependencies
echo "📦 Installing application dependencies..."
npm ci --production=false

# Create environment file
echo "⚙️ Creating environment file..."
cat > .env << 'ENVEOF'
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Google AI (Gemini) API Configuration
GOOGLE_AI_API_KEY=AIzaSyB2C0RGwtFAqgaZJIwPp4Hp7M7kLaLSO8A

# Database Configuration (for future use)
# DATABASE_URL=postgresql://username:password@localhost:5432/fusefoundry
# REDIS_URL=redis://localhost:6379

# Analytics and Monitoring
# VERCEL_ANALYTICS_ID=
# VERCEL_SPEED_INSIGHTS_ID=

# JWT Secret for user authentication (generate a secure secret)
# JWT_SECRET=your-super-secure-jwt-secret-here

# Email Configuration (for contact forms and notifications)
# SMTP_HOST=smtp.namecheap.com
# SMTP_PORT=587
# SMTP_USER=noreply@yourdomain.com
# SMTP_PASS=your-email-password
ENVEOF

# Build the application
echo "🔨 Building FuseFoundry..."
npm run build

EOF

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/fusefoundry > /dev/null << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

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

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/fusefoundry /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 ecosystem..."
sudo -u fusefoundry tee /var/www/fusefoundry/ecosystem.config.js > /dev/null << 'EOF'
module.exports = {
  apps: [{
    name: 'fusefoundry',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/fusefoundry',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/fusefoundry-error.log',
    out_file: '/var/log/pm2/fusefoundry-out.log',
    log_file: '/var/log/pm2/fusefoundry.log',
    time: true,
    watch: false,
    ignore_watch: ['node_modules', '.git', '.next'],
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown fusefoundry:fusefoundry /var/log/pm2

# Start the application with PM2
echo "🚀 Starting FuseFoundry with PM2..."
sudo -u fusefoundry bash << 'EOF'
cd /var/www/fusefoundry
pm2 start ecosystem.config.js
pm2 save
EOF

# Setup PM2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u fusefoundry --hp /home/fusefoundry

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo ""
echo "✅ FuseFoundry VPS setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Point your domain DNS to this VPS IP address"
echo "2. Update yourdomain.com in /etc/nginx/sites-available/fusefoundry"
echo "3. Run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "4. Update NEXT_PUBLIC_SITE_URL in /var/www/fusefoundry/.env"
echo "5. Restart the application: sudo -u fusefoundry pm2 restart fusefoundry"
echo ""
echo "📋 Useful commands:"
echo "- Check application status: sudo -u fusefoundry pm2 status"
echo "- View logs: sudo -u fusefoundry pm2 logs fusefoundry"
echo "- Restart app: sudo -u fusefoundry pm2 restart fusefoundry"
echo "- Update app: cd /var/www/fusefoundry && git pull && npm ci && npm run build && pm2 restart fusefoundry"
echo ""
echo "🌐 Your site will be available at: http://yourdomain.com"
echo "🔒 After SSL setup: https://yourdomain.com"
