# Deployment Guide - AI Roast Generator

## Quick Deploy to Vercel

```bash
./deploy-vercel.sh
```

This script automatically:
1. ✅ Checks if ngrok is running (starts if needed)
2. ✅ Gets the current live ngrok URL
3. ✅ Updates Vercel environment variable (`VITE_REACT_APP_XMTP_API`)
4. ✅ Deploys to Vercel production

**No more stale ngrok URLs!** 🎉

## Why This Matters

- **ngrok URLs expire** - They change every time the tunnel restarts
- **Vercel needs the latest URL** - Frontend can't reach the backend if URL is stale
- **Automation prevents errors** - No manual env var updates needed

## Prerequisites

```bash
# 1. Install ngrok globally
npm install -g ngrok

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Ensure XMTP agent env vars are set in .env
```

## Full Deployment Workflow

### Option A: Full Stack Deployment (Recommended)
```bash
# Start all services
bash start-all.sh start all

# Wait for ngrok to initialize (~3 seconds)
sleep 5

# Deploy to Vercel with ngrok sync
./deploy-vercel.sh
```

### Option B: Just Deploy (ngrok must be running)
```bash
# Assuming ngrok is already running via start-all.sh
./deploy-vercel.sh
```

## What Gets Deployed

✅ **Frontend**
- React app built with Vite
- All hooks (useXMTP, useAgentPayment, useS3Upload, etc.)
- Components and styling
- Farcaster manifest

✅ **Environment Variables**
- `VITE_REACT_APP_XMTP_API` - Current ngrok URL (auto-synced)
- `AWS_ACCESS_KEY_ID` - For S3 uploads
- `AWS_SECRET_ACCESS_KEY` - For S3 uploads
- `AWS_REGION` - eu-south-1 for Milan region

## Verifying Deployment

```bash
# Check Vercel deployment
vercel --prod --confirm

# Check environment vars synced correctly
vercel env ls | grep VITE_REACT_APP_XMTP_API

# Test S3 upload endpoint
curl "https://[ngrok-url]/api/s3-upload-url?filename=test.png"

# Visit live app
open https://ai-roast-generator.vercel.app/
```

## Troubleshooting

**"ngrok not found"**
```bash
npm install -g ngrok
```

**"Vercel CLI not found"**
```bash
npm install -g vercel
```

**"Failed to get ngrok URL"**
```bash
# Make sure ngrok is running
pgrep -f ngrok

# Or restart it
bash start-all.sh stop xmtp
bash start-all.sh start xmtp
```

**"S3 upload failed"**
- Vercel env vars are stale
- Run: `./deploy-vercel.sh` again

## Monitoring

Check deployment logs:
```bash
vercel logs --tail
```

Check ngrok tunnel status:
```bash
# List all tunnels
curl http://localhost:4040/api/tunnels

# View ngrok web dashboard
open http://localhost:4040
```

## Tips

1. **Before important demos** - Always run `./deploy-vercel.sh` first
2. **Share ngrok URL** - Give the URL to team members to test
3. **Monitor ngrok** - Check `http://localhost:4040` for request logs
4. **Keep it simple** - This script handles all the manual steps

---

**Pro Tip**: Run `./deploy-vercel.sh` whenever you restart XMTP or ngrok to keep Vercel in sync! 🚀
