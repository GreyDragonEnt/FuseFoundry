#!/bin/bash
# FuseFoundry VPS Deployment Script for CentOS/RHEL/AlmaLinux
# Run this script on a fresh CentOS/RHEL VPS

set -e

echo "🚀 Starting FuseFoundry VPS Setup for CentOS/RHEL..."

# Detect the package manager
if command -v dnf >/dev/null 2>&1; then
    PKG_MANAGER="dnf"
elif command -v yum >/dev/null 2>&1; then
    PKG_MANAGER="yum"
else
    echo "❌ Neither dnf nor yum found. This script requires CentOS/RHEL."
    exit 1
fi

echo "📦 Using package manager: $PKG_MANAGER"

# Update system
echo "📦 Updating system packages..."
$PKG_MANAGER update -y

# Install EPEL repository (needed for some packages)
echo "📦 Installing EPEL repository..."
$PKG_MANAGER install -y epel-release

# Install basic tools
echo "📦 Installing basic tools..."
$PKG_MANAGER install -y curl wget git unzip

# Install Node.js 18 LTS
echo "📦 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
$PKG_MANAGER install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install Nginx
echo "📦 Installing Nginx..."
$PKG_MANAGER install -y nginx

# Install additional tools
echo "📦 Installing additional tools..."
$PKG_MANAGER install -y firewalld certbot python3-certbot-nginx

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Create application user
echo "👤 Creating application user..."
useradd -m -s /bin/bash fusefoundry || echo "User already exists"

# Setup application directory
echo "📁 Setting up application directory..."
mkdir -p /var/www/fusefoundry
chown fusefoundry:fusefoundry /var/www/fusefoundry

# Switch to application user for the rest
echo "🔄 Setting up application as fusefoundry user..."
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
NEXT_PUBLIC_SITE_URL=https://fusefoundry.dev

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
# SMTP_USER=noreply@fusefoundry.dev
# SMTP_PASS=your-email-password
ENVEOF

# Build the application
echo "🔨 Building FuseFoundry..."
npm run build

EOF

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/conf.d/fusefoundry.conf << 'EOF'
server {
    listen 80;
    server_name fusefoundry.dev www.fusefoundry.dev;

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

# Test Nginx configuration
nginx -t

# Configure firewall
echo "🔒 Configuring firewall..."
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

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
mkdir -p /var/log/pm2
chown fusefoundry:fusefoundry /var/log/pm2

# Start the application with PM2
echo "🚀 Starting FuseFoundry with PM2..."
sudo -u fusefoundry bash << 'EOF'
cd /var/www/fusefoundry
pm2 start ecosystem.config.js
pm2 save
EOF

# Setup PM2 startup
env PATH=$PATH:/usr/bin pm2 startup systemd -u fusefoundry --hp /home/fusefoundry

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

echo ""
echo "✅ FuseFoundry VPS setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Point your domain DNS to this VPS IP address"
echo "2. Run: certbot --nginx -d fusefoundry.dev -d www.fusefoundry.dev"
echo "3. Restart the application: sudo -u fusefoundry pm2 restart fusefoundry"
echo ""
echo "📋 Useful commands:"
echo "- Check application status: sudo -u fusefoundry pm2 status"
echo "- View logs: sudo -u fusefoundry pm2 logs fusefoundry"
echo "- Restart app: sudo -u fusefoundry pm2 restart fusefoundry"
echo ""
echo "🌐 Your site will be available at: http://fusefoundry.dev"
echo "🔒 After SSL setup: https://fusefoundry.dev"
