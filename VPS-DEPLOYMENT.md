# FuseFoundry VPS Deployment Guide

## 🚀 Complete VPS Setup for Namecheap

### Prerequisites
- Ubuntu 20.04+ VPS from Namecheap
- Root access to the server
- Domain name pointed to VPS IP

### Quick Setup
```bash
# 1. Download and run the setup script
wget https://raw.githubusercontent.com/GreyDragonEnt/FuseFoundry/main/deploy-vps.sh
chmod +x deploy-vps.sh
sudo ./deploy-vps.sh

# 2. Configure your domain in Nginx
sudo nano /etc/nginx/sites-available/fusefoundry
# Replace 'yourdomain.com' with your actual domain

# 3. Setup SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 4. Update environment variables
sudo -u fusefoundry nano /var/www/fusefoundry/.env
# Update NEXT_PUBLIC_SITE_URL with your domain

# 5. Restart the application
sudo -u fusefoundry pm2 restart fusefoundry
```

### What Gets Installed
- ✅ Node.js 18 LTS
- ✅ Nginx (reverse proxy + SSL)
- ✅ PM2 (process management)
- ✅ UFW Firewall (configured)
- ✅ Certbot (SSL certificates)
- ✅ FuseFoundry application

### Database Setup (Future)
When you're ready to add databases:

#### PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE fusefoundry;
CREATE USER fusefoundry_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fusefoundry TO fusefoundry_user;
\q

# Update .env file
echo "DATABASE_URL=postgresql://fusefoundry_user:secure_password@localhost:5432/fusefoundry" >> /var/www/fusefoundry/.env
```

#### Redis (for caching/sessions)
```bash
# Install Redis
sudo apt install redis-server

# Update .env file
echo "REDIS_URL=redis://localhost:6379" >> /var/www/fusefoundry/.env
```

### Application Management

#### Check Status
```bash
sudo -u fusefoundry pm2 status
sudo -u fusefoundry pm2 logs fusefoundry
```

#### Update Application
```bash
cd /var/www/fusefoundry
sudo -u fusefoundry git pull
sudo -u fusefoundry npm ci
sudo -u fusefoundry npm run build
sudo -u fusefoundry pm2 restart fusefoundry
```

#### Backup Script
```bash
#!/bin/bash
# Create in /home/fusefoundry/backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/fusefoundry/backups"

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/fusefoundry_$DATE.tar.gz /var/www/fusefoundry

# Backup database (when you have one)
# sudo -u postgres pg_dump fusefoundry > $BACKUP_DIR/database_$DATE.sql

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Monitoring Setup

#### Log Rotation
```bash
# Create /etc/logrotate.d/fusefoundry
sudo tee /etc/logrotate.d/fusefoundry > /dev/null << EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 fusefoundry fusefoundry
    postrotate
        sudo -u fusefoundry pm2 reloadLogs
    endscript
}
EOF
```

### Security Checklist
- ✅ Firewall configured (UFW)
- ✅ SSL certificate (Let's Encrypt)
- ✅ Security headers in Nginx
- ✅ Non-root application user
- ✅ Environment variables secured
- 🔲 SSH key authentication (recommended)
- 🔲 Fail2ban (optional but recommended)
- 🔲 Regular security updates

### Performance Optimization
- ✅ Gzip compression enabled
- ✅ Static file caching
- ✅ PM2 cluster mode
- ✅ Memory limits configured
- 🔲 CDN integration (future)
- 🔲 Database optimization (when added)

### Troubleshooting

#### Application won't start
```bash
# Check PM2 logs
sudo -u fusefoundry pm2 logs fusefoundry

# Check environment variables
sudo -u fusefoundry cat /var/www/fusefoundry/.env

# Rebuild application
cd /var/www/fusefoundry
sudo -u fusefoundry npm run build
```

#### Nginx issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

#### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Future Database Schema Ideas
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Athena conversations
CREATE TABLE athena_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    mode VARCHAR(50) DEFAULT 'teaser',
    business_context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    page_path VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT NOT NULL,
    services TEXT[],
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
