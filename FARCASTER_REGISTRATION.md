# Farcaster Mini App Registration

## 📋 Steps to Complete Registration

### 1. ✅ Manifest Created
The manifest file is ready at: `public/.well-known/farcaster.json`

This includes:
- App name and description
- Logo and icon URLs (from GitHub)
- Home URL pointing to Vercel deployment
- Account association structure (for signing)
- Metadata (keywords, categories)

### 2. 🔐 Sign the Manifest (Required)

**Use the Official Farcaster Manifest Tool:**

1. Go to: https://dev.warpcast.com/account-associations
2. Follow these steps:
   - **Option A: Sign with Existing Farcaster Account**
     - Sign in to Warpcast with your account
     - Select "Mini App" as the app type
     - Enter your domain: `ai-roast-generator.vercel.app`
     - The tool will generate the signed account association JSON

   - **Option B: Manual Signing (Advanced)**
     - Use Farcaster's CLI or SDK to sign the manifest
     - This requires your private key (not recommended)

3. Copy the generated `accountAssociation` object (header, payload, signature)

4. Replace the placeholder values in `.well-known/farcaster.json`:
   ```json
   {
     "accountAssociation": {
       "header": "[paste_generated_header]",
       "payload": "[paste_generated_payload]",
       "signature": "[paste_generated_signature]"
     },
     ...
   }
   ```

### 3. 🚀 Deploy Manifest
Once signed, the manifest needs to be served at:
```
https://ai-roast-generator.vercel.app/.well-known/farcaster.json
```

Verify it's live:
```bash
curl https://ai-roast-generator.vercel.app/.well-known/farcaster.json
```

### 4. 📢 Register in Farcaster Directory
After manifest is live:
1. Go to: https://miniapps.base.org/ or https://warpcast.com/
2. Submit your app for listing
3. Include the manifest URL
4. Add description and demo video

## 🔗 Reference Repos
- [Base MiniKit Starter](https://github.com/builders-garden/base-minikit-starter) - Great example
- [MiniKit Documentation](https://docs.base.org/base-app/build-with-minikit/overview)
- [Farcaster Frames Docs](https://docs.farcaster.xyz/developers/frames/spec)

## ✨ What This Enables
- ✅ App discoverable in Farcaster clients (Warpcast, Base App)
- ✅ Native sharing with OG preview
- ✅ Support for Farcaster Frames and MiniKit
- ✅ Base Mini Apps directory listing
- ✅ Better viral reach within Farcaster network
- ✅ Account association for notifications (optional)
