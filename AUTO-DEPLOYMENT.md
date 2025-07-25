# Auto-Deployment Setup for FuseFoundry VPS

This document explains how to set up automatic deployments from GitHub to your Namecheap VPS.

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)
Automatically deploy when you push to the main branch.

#### Setup Steps:

1. **Generate SSH Key on VPS:**
```bash
# On your VPS, generate SSH key for GitHub Actions
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions  # Copy this private key
```

2. **Add GitHub Secrets:**
Go to: https://github.com/GreyDragonEnt/FuseFoundry/settings/secrets/actions

Add these secrets:
- `VPS_HOST`: Your VPS IP address (e.g., 123.456.789.0)
- `VPS_USERNAME`: root (or your SSH username)
- `VPS_SSH_KEY`: The private key from step 1
- `GOOGLE_AI_API_KEY`: AIzaSyB2C0RGwtFAqgaZJIwPp4Hp7M7kLaLSO8A
- `NEXT_PUBLIC_SITE_URL`: https://fusefoundry.dev

⚠️ **Note:** Until these secrets are configured, the GitHub Actions workflow will show warnings about "Context access might be invalid." This is normal and the warnings will disappear once you add the secrets.

3. **Enable the Workflow:**
The workflow file is already created at `.github/workflows/deploy-vps.yml`

#### How it works:
- ✅ Push to main branch → Automatic deployment
- ✅ Builds and tests before deploying
- ✅ Creates backups before updating
- ✅ Runs health checks after deployment
- ✅ Automatic rollback if deployment fails

### Option 2: Webhook Listener (Alternative)
Set up a webhook listener on your VPS.

#### Setup Steps:

1. **Install webhook listener on VPS:**
```bash
# Copy files to VPS
scp deploy-webhook.sh root@your-vps:/var/www/fusefoundry/
scp webhook-listener.mjs root@your-vps:/var/www/fusefoundry/

# Make executable
chmod +x /var/www/fusefoundry/deploy-webhook.sh

# Install webhook listener as PM2 service
cd /var/www/fusefoundry
npm install # Installs dependencies
# Start webhook listener with PM2
pm2 start webhook-listener.mjs --name "fusefoundry-webhook"
pm2 save
```

2. **Configure Nginx for webhook:**
Add to your Nginx config:
```nginx
location /webhook {
    proxy_pass http://localhost:9000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

3. **Set up GitHub webhook:**
- Go to: https://github.com/GreyDragonEnt/FuseFoundry/settings/hooks
- Add webhook: `https://yourdomain.com/webhook`
- Secret: Generate a secure secret
- Events: Just the push event

## 🔧 Manual Updates (Current Method)

If you prefer manual control:

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update FuseFoundry
cd /var/www/fusefoundry
sudo -u fusefoundry git pull
sudo -u fusefoundry npm ci
sudo -u fusefoundry npm run build
sudo -u fusefoundry pm2 restart fusefoundry
```

## 📊 Monitoring Deployments

### View deployment logs:
```bash
# GitHub Actions logs: Available in GitHub Actions tab
# Webhook logs: sudo tail -f /var/log/fusefoundry-deploy.log
# Application logs: sudo -u fusefoundry pm2 logs fusefoundry
```

### Health check endpoint:
```bash
# Check if deployment was successful
curl https://yourdomain.com/api/health
```

## 🎯 Recommended Workflow

1. **Start with GitHub Actions** (Option 1) - it's more reliable and secure
2. **Test locally first** before pushing to main
3. **Monitor deployments** through GitHub Actions tab
4. **Set up branch protection** to prevent direct pushes to main

## 🔒 Security Considerations

- ✅ SSH key authentication (no passwords)
- ✅ Webhook signature verification
- ✅ Backup before deployment
- ✅ Health checks and rollback
- ✅ User separation (fusefoundry user)
- ✅ Firewall configuration

## 🐛 Troubleshooting

### Deployment fails:
```bash
# Check GitHub Actions logs
# Check VPS logs: sudo tail -f /var/log/fusefoundry-deploy.log
# Check application: sudo -u fusefoundry pm2 logs fusefoundry
```

### Rollback manually:
```bash
cd /var/www/fusefoundry
sudo -u fusefoundry git reset --hard HEAD~1
sudo -u fusefoundry npm run build
sudo -u fusefoundry pm2 restart fusefoundry
```
