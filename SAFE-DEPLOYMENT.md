# Safe Auto-Deployment Configuration
# FuseFoundry Production Deployment

## 🛡️ Safety Features Enabled

### 1. Pre-Deployment Checks
- ✅ Git fetch and commit validation
- ✅ Dependency installation verification
- ✅ Build process validation
- ✅ Build artifact testing

### 2. Health Monitoring
- ✅ PM2 process status check
- ✅ Health endpoint response validation
- ✅ Main application response validation
- ✅ JavaScript error detection
- ✅ Multi-attempt retry logic (10 attempts)

### 3. Rollback Capabilities
- ✅ Automatic backup creation before deployment
- ✅ Full rollback on health check failure
- ✅ Rollback validation
- ✅ Last known good commit tracking
- ✅ Emergency application stop on critical failure

### 4. Monitoring & Logging
- ✅ Comprehensive deployment logging
- ✅ Timestamped log entries
- ✅ Notification system ready
- ✅ Backup cleanup (keeps 5 latest)

## 🔧 Configuration

### Webhook Listener Settings
- Port: 9000 (configurable via WEBHOOK_PORT)
- Secret: Set via WEBHOOK_SECRET environment variable
- Deploy Script: /var/www/fusefoundry/deploy-webhook-safe.sh

### Health Check Settings
- Health Endpoint: http://localhost:3000/api/health
- Main App Endpoint: http://localhost:3000
- Max Retry Attempts: 10
- Retry Delay: 5 seconds
- Request Timeout: 10 seconds

### Backup Management
- Backup Location: .next.backup.YYYYMMDD_HHMMSS
- Retention: 5 latest backups
- Rollback Support: Yes

## 🚀 Deployment Process

1. **Validation Phase**
   - Check for new commits
   - Validate deployment prerequisites
   - Create backup of current build

2. **Deployment Phase**
   - Pull latest code
   - Install dependencies with validation
   - Build application with error checking
   - Validate build artifacts

3. **Health Check Phase**
   - Restart application
   - Wait for startup (3 seconds)
   - Run comprehensive health checks
   - Validate all endpoints

4. **Success/Rollback Phase**
   - On Success: Clean old backups, update tracking
   - On Failure: Automatic rollback with validation
   - On Critical Failure: Emergency stop

## 🔒 Safety Guarantees

- **No Broken Deployments**: Failed builds prevent deployment
- **No Downtime on Failure**: Automatic rollback maintains service
- **Health Validation**: Multi-layer health checking
- **Emergency Stops**: Critical failures stop service rather than serve broken content
- **Audit Trail**: Complete logging of all deployment activities

## 📝 Usage

### Enable Safe Deployment
Replace the current deployment script with the enhanced version:
```bash
# On your VPS
sudo cp deploy-webhook-safe.sh /var/www/fusefoundry/deploy-webhook.sh
sudo chmod +x /var/www/fusefoundry/deploy-webhook.sh
```

### Setup Webhook Secret
```bash
# On your VPS
export WEBHOOK_SECRET="your-secure-webhook-secret"
# Add to ~/.bashrc or /etc/environment for persistence
```

### Start Webhook Listener
```bash
# On your VPS
cd /var/www/fusefoundry
node webhook-listener.js
# Or with PM2
pm2 start webhook-listener.js --name webhook-listener
```

### Configure GitHub Webhook
- URL: https://fusefoundry.dev:9000/webhook
- Content-Type: application/json
- Secret: (your webhook secret)
- Events: Just push events
- Active: Yes

## 🔍 Monitoring

### Check Deployment Logs
```bash
tail -f /var/log/fusefoundry-deploy.log
```

### Check Application Status
```bash
pm2 status
pm2 logs fusefoundry
```

### Manual Health Check
```bash
curl https://fusefoundry.dev/api/health
```

## 🚨 Emergency Procedures

### Manual Rollback
```bash
cd /var/www/fusefoundry
# Find latest backup
ls -la .next.backup.*
# Restore specific backup
rm -rf .next
mv .next.backup.YYYYMMDD_HHMMSS .next
pm2 restart fusefoundry
```

### Stop Auto-Deployment
```bash
pm2 stop webhook-listener
```

### Emergency Application Stop
```bash
pm2 stop fusefoundry
```

This configuration ensures only working code reaches production while maintaining high availability and providing comprehensive monitoring and rollback capabilities.
