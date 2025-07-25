#!/usr/bin/env node
// GitHub webhook listener for auto-deployment
// Run this on your VPS to listen for GitHub push events

import http from 'http';
import crypto from 'crypto';
import { execSync } from 'child_process';

const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
const DEPLOY_SCRIPT = '/var/www/fusefoundry/deploy-webhook.sh';

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  const calculatedSignature = `sha256=${hmac.digest('hex')}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}

// Log function
function log(message) {
  console.log(`${new Date().toISOString()} - ${message}`);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }

  if (req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const signature = req.headers['x-hub-signature-256'];
      
      if (!signature || !verifySignature(body, signature)) {
        log('❌ Invalid signature');
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }

      const payload = JSON.parse(body);
      
      // Only deploy on push to main branch
      if (payload.ref !== 'refs/heads/main') {
        log(`ℹ️ Ignoring push to ${payload.ref}`);
        res.writeHead(200);
        res.end('OK - Branch ignored');
        return;
      }

      log(`🚀 Received push to main branch. Commit: ${payload.head_commit.id}`);
      log(`📝 Commit message: ${payload.head_commit.message}`);

      // Execute deployment script
      try {
        execSync(`bash ${DEPLOY_SCRIPT}`, { 
          stdio: 'inherit',
          timeout: 300000 // 5 minute timeout
        });
        
        log('✅ Deployment completed successfully');
        res.writeHead(200);
        res.end('Deployment successful');
      } catch (error) {
        log(`❌ Deployment failed: ${error.message}`);
        res.writeHead(500);
        res.end('Deployment failed');
      }

    } catch (error) {
      log(`❌ Error processing webhook: ${error.message}`);
      res.writeHead(400);
      res.end('Bad request');
    }
  });
});

server.listen(PORT, () => {
  log(`🎣 Webhook listener started on port ${PORT}`);
  log(`🔒 Using webhook secret: ${SECRET ? 'SET' : 'NOT SET'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  log('🛑 Shutting down webhook listener...');
  server.close(() => {
    log('✅ Webhook listener stopped');
    process.exit(0);
  });
});
