# FuseFoundry PWA Icons

This directory contains the PWA icons for the FuseFoundry application.

## Required Icons

The following icons need to be created and added to this directory:

- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon.png (180x180)

## Icon Design Guidelines

- Use the FuseFoundry brand gradient: #FF6A2C → #FFC84A → #18E0DF
- Include the "FF" monogram or full logo
- Ensure adequate contrast and readability at small sizes
- Follow Apple and Android icon guidelines for maskable icons

## Tools for Icon Generation

You can use tools like:
- Favicon.io
- RealFaviconGenerator.net
- Figma/Sketch with icon export plugins

## Implementation

These icons are referenced in:
- `/public/manifest.json`
- `/src/app/layout.tsx` (apple-touch-icon)
- PWA install prompts
