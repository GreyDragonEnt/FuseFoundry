# FuseFoundry VPS Deployment Guide

## 🚀 Complete VPS Setup for Namecheap

### Prerequisites
- Ubuntu 20.04+ VPS from Namecheap
- Root access to the server
- Domain name `fusefoundry.dev` pointed to VPS IP: `209.74.88.212`

### DNS Configuration
Before deploying, ensure your DNS records are configured correctly:

```
Type: A
Name: @ (root domain)
Value: 209.74.88.212
TTL: 300

Type: CNAME
Name: www
Value: fusefoundry.dev
TTL: 300
```

### Complete DNS Zone Configuration
Here's a complete DNS zone file setup for `fusefoundry.dev`:

```dns
; DNS Zone for fusefoundry.dev
$TTL 300
@       IN  SOA     ns1.fusefoundry.dev. admin.fusefoundry.dev. (
                    2025012301  ; Serial (YYYYMMDDNN format)
                    3600        ; Refresh (1 hour)
                    1800        ; Retry (30 minutes)
                    604800      ; Expire (1 week)
                    300         ; Minimum TTL (5 minutes)
                    )

; Name servers
@       IN  NS      ns1.fusefoundry.dev.
@       IN  NS      ns2.fusefoundry.dev.

; A Records (IPv4)
@       IN  A       209.74.88.212
www     IN  A       209.74.88.212
api     IN  A       209.74.88.212
admin   IN  A       209.74.88.212

; CNAME Records
www     IN  CNAME   fusefoundry.dev.
api     IN  CNAME   fusefoundry.dev.
admin   IN  CNAME   fusefoundry.dev.

; Mail Exchange (MX) Records - if you plan to use email
@       IN  MX  10  mail.fusefoundry.dev.
mail    IN  A       209.74.88.212

; TXT Records for verification and security
@       IN  TXT     "v=spf1 ip4:209.74.88.212 ~all"
@       IN  TXT     "google-site-verification=your-verification-code"

; DMARC policy
_dmarc  IN  TXT     "v=DMARC1; p=quarantine; rua=mailto:dmarc@fusefoundry.dev"

; DKIM (if using email)
default._domainkey IN TXT "v=DKIM1; k=rsa; p=your-dkim-public-key"
```

### DNS Records Summary for Manual Setup
If setting up manually in your DNS provider dashboard:

| Type  | Name/Host | Value/Target      | TTL | Priority |
|-------|-----------|-------------------|-----|----------|
| A     | @         | 209.74.88.212     | 300 | -        |
| A     | www       | 209.74.88.212     | 300 | -        |
| A     | api       | 209.74.88.212     | 300 | -        |
| A     | admin     | 209.74.88.212     | 300 | -        |
| CNAME | www       | fusefoundry.dev   | 300 | -        |
| MX    | @         | mail.fusefoundry.dev | 300 | 10    |
| TXT   | @         | "v=spf1 ip4:209.74.88.212 ~all" | 300 | - |

### DNS Verification Commands
After setting up your DNS zone, verify the configuration:

```bash
# Check A record for root domain
nslookup fusefoundry.dev

# Check A record for www subdomain
nslookup www.fusefoundry.dev

# Check MX records (if configured)
nslookup -type=MX fusefoundry.dev

# Check TXT records
nslookup -type=TXT fusefoundry.dev

# Check all records using dig (if available)
dig fusefoundry.dev ANY

# Test from multiple DNS servers
nslookup fusefoundry.dev 8.8.8.8
nslookup fusefoundry.dev 1.1.1.1
```

### DNS Propagation Check
DNS changes can take time to propagate. Check propagation status:
- Online tools: whatsmydns.net, dnschecker.org
- Expected propagation time: 5-60 minutes for most records

### Custom DNS Server Setup (BIND9)
Since you're using custom nameservers (ns1.fusefoundry.dev, ns2.fusefoundry.dev), you need to set up a DNS server on your VPS:

#### Install BIND9 DNS Server
```bash
# Install BIND9
sudo apt update
sudo apt install bind9 bind9utils bind9-doc

# Enable and start BIND9
sudo systemctl enable bind9
sudo systemctl start bind9
```

#### Configure BIND9 for fusefoundry.dev
```bash
# Create the zone configuration
sudo nano /etc/bind/named.conf.local
```

Add this zone configuration:
```bind
zone "fusefoundry.dev" {
    type master;
    file "/etc/bind/db.fusefoundry.dev";
    allow-transfer { any; };
};
```

#### Create the Zone File
```bash
# Create the zone file
sudo nano /etc/bind/db.fusefoundry.dev
```

Add this zone file content:
```dns
$TTL    300
@       IN      SOA     ns1.fusefoundry.dev. admin.fusefoundry.dev. (
                        2025012301      ; Serial
                        3600            ; Refresh
                        1800            ; Retry
                        604800          ; Expire
                        300             ; Negative Cache TTL
)

; Name servers
@       IN      NS      ns1.fusefoundry.dev.
@       IN      NS      ns2.fusefoundry.dev.

; A Records
@       IN      A       209.74.88.212
ns1     IN      A       209.74.88.212
ns2     IN      A       209.74.88.212
www     IN      A       209.74.88.212
api     IN      A       209.74.88.212
admin   IN      A       209.74.88.212
mail    IN      A       209.74.88.212

; CNAME Records
www     IN      CNAME   fusefoundry.dev.

; MX Records (if using email)
@       IN      MX      10      mail.fusefoundry.dev.

; TXT Records
@       IN      TXT     "v=spf1 ip4:209.74.88.212 ~all"
@       IN      TXT     "google-site-verification=your-verification-code"
```

#### Configure BIND9 Options
```bash
# Edit BIND9 options
sudo nano /etc/bind/named.conf.options
```

Update the options:
```bind
options {
    directory "/var/cache/bind";
    recursion yes;
    listen-on { any; };
    listen-on-v6 { any; };
    allow-query { any; };
    forwarders {
        8.8.8.8;
        8.8.4.4;
    };
    dnssec-validation auto;
    auth-nxdomain no;
};
```

#### Start and Test DNS Server
```bash
# Check BIND9 configuration
sudo named-checkconf
sudo named-checkzone fusefoundry.dev /etc/bind/db.fusefoundry.dev

# Restart BIND9
sudo systemctl restart bind9

# Check status
sudo systemctl status bind9

# Test DNS resolution locally
nslookup fusefoundry.dev 127.0.0.1
nslookup www.fusefoundry.dev 127.0.0.1
```

#### Firewall Configuration for DNS
```bash
# Allow DNS traffic (port 53)
sudo ufw allow 53/udp
sudo ufw allow 53/tcp
sudo ufw reload
```

#### DNS Server Monitoring
```bash
# Check DNS logs
sudo tail -f /var/log/syslog | grep named

# Monitor DNS queries
sudo rndc querylog on
sudo tail -f /var/log/syslog | grep queries
```

### Quick Setup
```bash
# 1. Download and run the setup script
wget https://raw.githubusercontent.com/GreyDragonEnt/FuseFoundry/main/deploy-vps.sh
chmod +x deploy-vps.sh
sudo ./deploy-vps.sh

# 2. Configure your domain in Nginx
sudo nano /etc/nginx/sites-available/fusefoundry
# Replace 'yourdomain.com' with 'fusefoundry.dev'

# 3. Setup SSL certificate
sudo certbot --nginx -d fusefoundry.dev -d www.fusefoundry.dev

# 4. Update environment variables
sudo -u fusefoundry nano /var/www/fusefoundry/.env
# Update NEXT_PUBLIC_SITE_URL=https://fusefoundry.dev

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
