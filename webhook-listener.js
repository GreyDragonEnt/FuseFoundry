#!/usr/bin/env node
// GitHub webhook listener for auto-deployment
// Run this on your VPS to listen for GitHub push events


import http from 'http';
import crypto from 'crypto';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

// Gemini API integration
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || '';
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    return 'Google AI API key not set.';
  }
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
const DEPLOY_SCRIPT = '/var/www/fusefoundry/deploy-webhook.sh';

// Safety configuration
const ALLOWED_BRANCHES = ['main', 'master']; // Only deploy from these branches
const MAX_CONCURRENT_DEPLOYMENTS = 1; // Prevent overlapping deployments
let isDeploying = false;

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
  // Health check endpoint for the webhook listener
  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      isDeploying: isDeploying,
      timestamp: new Date().toISOString(),
      allowedBranches: ALLOWED_BRANCHES
    }));
    return;
  }

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
      
      // Check if deployment is in progress
      if (isDeploying) {
        log('⚠️ Deployment already in progress, ignoring webhook');
        res.writeHead(429);
        res.end('Deployment in progress');
        return;
      }

      // Extract branch name from ref
      const branch = payload.ref ? payload.ref.replace('refs/heads/', '') : '';
      
      // Only deploy from allowed branches
      if (!ALLOWED_BRANCHES.includes(branch)) {
        log(`ℹ️ Ignoring push to ${payload.ref} - not in allowed branches`);
        res.writeHead(200);
        res.end('OK - Branch not allowed for deployment');
        return;
      }

      // Additional safety checks
      if (!payload.head_commit) {
        log('⚠️ No head commit in payload, ignoring');
        res.writeHead(400);
        res.end('Invalid payload - no head commit');
        return;
      }


      log(`🚀 Received push to ${branch} branch. Commit: ${payload.head_commit.id}`);
      log(`📝 Commit message: ${payload.head_commit.message}`);
      log(`👤 Author: ${payload.head_commit.author.name} <${payload.head_commit.author.email}>`);

      // Use Gemini to summarize the commit message
      (async () => {
        try {
          const summary = await callGemini(`Summarize this commit message for deployment notes: ${payload.head_commit.message}`);
          log(`🤖 Gemini summary: ${summary}`);
        } catch (error) {
          log(`⚠️ Gemini API error: ${error.message}`);
        }
      })();

      // Set deployment flag
      isDeploying = true;

      // Execute deployment script
      try {
        execSync(`bash ${DEPLOY_SCRIPT}`, { 
          stdio: 'inherit',
          timeout: 600000 // 10 minute timeout for safe deployment
        });
        
        log('✅ Safe deployment completed successfully');
        res.writeHead(200);
        res.end('Safe deployment successful');
      } catch (error) {
        log(`❌ Safe deployment failed: ${error.message}`);
        res.writeHead(500);
        res.end('Safe deployment failed');
      } finally {
        // Reset deployment flag
        isDeploying = false;
      }

    } catch (error) {
      log(`❌ Error processing webhook: ${error.message}`);
      res.writeHead(400);
      res.end('Bad request');
      isDeploying = false; // Reset flag on error
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
