#!/usr/bin/env node
// Emergency production deployment trigger
// This will run on the server via GitHub Actions to force deployment

import { execSync } from 'child_process';

console.log('🚨 EMERGENCY DEPLOYMENT TRIGGER ACTIVATED');
console.log('Timestamp:', new Date().toISOString());

// Force immediate deployment commands
const commands = [
  'cd /var/www/fusefoundry',
  'sudo -u fusefoundry git fetch origin main',
  'sudo -u fusefoundry git reset --hard origin/main',
  'sudo -u fusefoundry npm ci --production=false',
  'sudo -u fusefoundry npm run build',
  'sudo -u fusefoundry pm2 restart fusefoundry',
  'sleep 10',
  'curl -f http://localhost:3000/api/health || echo "Health check failed"'
];

try {
  for (const cmd of commands) {
    console.log('Executing:', cmd);
    execSync(cmd, { stdio: 'inherit' });
  }
  console.log('✅ Emergency deployment completed');
} catch (error) {
  console.error('❌ Emergency deployment failed:', error.message);
  process.exit(1);
}