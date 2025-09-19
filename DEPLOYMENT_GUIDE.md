# Deployment Guide - AWS RMM Dashboard

## 🚀 Multiple Deployment Options

### Option 1: Vercel (Primary)
```bash
# Standard Next.js deployment
npm run build
# Deploy via Vercel dashboard or CLI
```

**Vercel Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub: `aws-rmm-dashboard2025`
3. Use default Next.js settings
4. Deploy automatically

### Option 2: Netlify (Backup)
```bash
# Static export for Netlify
npm run deploy:netlify
```

**Netlify Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`
   - Node version: `18`

### Option 3: Manual Static Deploy
```bash
# Generate static files
npm run build:netlify
npm run export
# Upload 'out' folder to any static host
```

## 🔧 Configuration Files

### For Vercel:
- `next.config.js` (current) - Standard Next.js config
- No `vercel.json` needed

### For Netlify:
- `netlify.toml` - Netlify configuration
- `next.config.netlify.js` - Static export config
- Automatically copied during build

## 🌐 Live Demo URLs

**Expected URLs:**
- Vercel: `https://aws-rmm-dashboard2025.vercel.app`
- Netlify: `https://aws-rmm-dashboard2025.netlify.app`

## 🐛 Troubleshooting

### Routes Manifest Error (Vercel):
- Ensure no `output: 'export'` in main `next.config.js`
- Remove conflicting `vercel.json`
- Use standard Next.js build process

### Build Errors:
- Check Node version (18+)
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm ci`

### Static Export Issues (Netlify):
- Use `next.config.netlify.js` for static builds
- Ensure `images.unoptimized: true`
- Remove server-side features

## 📊 Features Included

- ✅ Responsive dashboard
- ✅ Real-time monitoring simulation
- ✅ AI agent status display
- ✅ Server management interface
- ✅ Incident timeline
- ✅ Analytics charts
- ✅ Settings panel

## 🎯 Deployment Status

Both platforms support:
- SSR (Vercel) or Static (Netlify)
- Custom domains
- Automatic Git deployments
- Environment variables
- Analytics and monitoring
