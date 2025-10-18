# Farcaster Mini App Registration

## 📋 Steps to Complete Registration

### 1. ✅ Manifest Created
The manifest file is ready at: `public/.well-known/farcaster.json`

This includes:
- App name and description
- Logo and icon URLs (from GitHub)
- Home URL pointing to Vercel deployment
- Metadata (keywords, categories, chain ID)

### 2. 🔐 Sign the Manifest (Required)
To register the app, you need to sign the manifest with your Farcaster account.

**Option A: Use Farcaster Account Association Tool**
1. Go to: https://miniapps.farcaster.xyz/
2. Upload/paste the manifest
3. Sign with your Farcaster wallet
4. Copy the signed manifest

**Option B: Manual Signing (If you have private key)**
```bash
# Install farcaster-js or use ethers.js to sign
npm install --save farcaster-js

# Then sign the manifest...
```

### 3. 🚀 Deploy Manifest
Once signed, the manifest needs to be served at:
```
https://ai-roast-generator.vercel.app/.well-known/farcaster.json
```

This is automatically handled since we added it to `public/`.

### 4. 📢 Register in Farcaster Directory
After manifest is live:
1. Go to: https://warpcast.com/ or https://miniapps.farcaster.xyz/
2. Submit your app for listing
3. Include the manifest URL

## 📖 Resources
- [Farcaster Mini Apps Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)
- [Base Mini Apps Docs](https://docs.base.org/mini-apps/)
- [Account Association](https://docs.base.org/mini-apps/features/sign-manifest)

## ✨ What This Enables
- ✅ App discoverable in Farcaster clients
- ✅ Native sharing with OG preview
- ✅ Support for Farcaster Frames
- ✅ Base Mini Apps directory listing
- ✅ Better viral reach
