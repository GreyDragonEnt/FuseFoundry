# FuseFoundry Deployment Guide

## Current Status
- ✅ GitHub Pages: Static site deployment (no server-side features)
- ⚠️ Athena AI: Requires server-side hosting for full functionality

## Deployment Options

### 1. Namecheap VPS/Dedicated (Recommended for Full Features)
**Pros:** Full Next.js functionality, Athena AI works, complete control
**Cons:** Requires server management, higher cost

**Steps:**
1. Set up Node.js environment
2. Clone repository and install dependencies
3. Configure environment variables
4. Set up reverse proxy (Nginx)
5. Use PM2 for process management

### 2. Vercel (Easiest Full-Feature Option)
**Pros:** Zero config, automatic deployments, built for Next.js
**Cons:** Custom domain requires paid plan

**Steps:**
1. Connect GitHub repository to Vercel
2. Add GOOGLE_AI_API_KEY environment variable
3. Deploy automatically on push

### 3. Hybrid Approach (Current + External API)
**Pros:** Keep free GitHub Pages, minimal server costs
**Cons:** More complex setup

**Steps:**
1. Keep GitHub Pages for main site
2. Deploy API separately to Vercel/Railway
3. Update frontend to call external API

## Environment Variables Required
```
GOOGLE_AI_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Current API Key
✅ Available in local .env file
⚠️ Needs to be added to chosen hosting platform
