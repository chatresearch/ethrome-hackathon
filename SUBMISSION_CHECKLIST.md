# Base Miniapp Submission Checklist

## ✅ Pre-Submission Requirements

### Code & Smart Contracts
- [x] All smart contract tests passing (24/24)
- [x] Frontend builds without errors
- [x] No console errors or warnings
- [x] TypeScript types strict mode enabled
- [x] Smart contract deployed to Base Sepolia
- [x] Contract address: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519`

### Features Implemented
- [x] AI image roasting (GPT-4o Vision)
- [x] Multi-agent routing (3 roasters)
- [x] On-chain voting
- [x] Roast leaderboard
- [x] Social sharing (Twitter/Farcaster)
- [x] Wallet integration (RainbowKit)
- [x] Beautiful share pages with OG tags
- [x] Loading dialogs with messaging
- [x] Payment processing

### Documentation
- [x] README_BASE_MINIAPP.md - Comprehensive guide
- [x] miniapp.json - Manifest with metadata
- [x] Architecture diagram
- [x] Tech stack documented
- [x] Quick start guide
- [x] Smart contract ABI and functions documented

---

## 📋 Submission Materials Needed

### 1. Visual Assets (Required)
- [ ] **Icon (256x256 PNG)**
  - High contrast, recognizable at small sizes
  - File: `public/icon.png`
  - Upload to: Vercel public directory
  - URL: `https://ai-roast-generator-ivory.vercel.app/icon.png`

- [ ] **Logo (512x512 PNG)**
  - Full application logo
  - File: `public/logo.png`
  - URL: `https://ai-roast-generator-ivory.vercel.app/logo.png`

- [ ] **Banner (1200x630 PNG)**
  - Used in Base Store preview
  - File: `public/banner.png`
  - URL: `https://ai-roast-generator-ivory.vercel.app/banner.png`

- [ ] **Screenshots (3-5 images)**
  - 1. Upload image step
  - 2. Agent selection
  - 3. Roast result
  - 4. Voting interface
  - 5. Share preview
  - Size: 1080x1920 or similar mobile format
  - Save to: `public/screenshots/`

### 2. Demo Video (Recommended)
- [ ] **3-minute walkthrough video**
  - Show: Upload → Select Agent → Get Roasted → Vote → Share
  - Include: MetaMask connection, on-chain voting
  - File format: MP4, max 100MB
  - Upload to: YouTube/Vimeo (get shareable link)
  - Add link to submission form

### 3. Metadata & Links
- [ ] GitHub repository link
- [ ] Live URL: `https://ai-roast-generator-ivory.vercel.app`
- [ ] Smart contract address: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519`
- [ ] Team Twitter (optional)
- [ ] Team Discord (optional)

---

## 🚀 Submission Platforms

### Base Miniapp Store
- **URL**: https://base.org/miniapps (or registry link)
- **Requirements**:
  - miniapp.json manifest ✅
  - Metadata (name, description, icon) ✅
  - Smart contract details ✅
  - Live URL pointing to deployed app
  - Visual assets

### ENS Agent Marketplace
- **URL**: https://agents.ensname.org (if participating)
- **Requirements**:
  - Agent metadata
  - ENS names: `profile-roaster.aiconfig.eth`, etc.
  - Pricing info
  - Capabilities list

### Farcaster/Frame Support
- **URL**: https://warpcast.com
- **Test**: Share button creates valid Farcaster frame
- **Requirement**: OG tags working on `/roast` page ✅

---

## 📝 Submission Form Template

```
Application Name: AI Roast Generator

Description:
Get brutally hilarious AI-powered roasts on Base. Upload a photo and let 
GPT-4o vision roast your vibe. Vote on roasts on-chain and share to 
Twitter/Farcaster.

Category: Entertainment / Gaming

Website: https://ai-roast-generator-ivory.vercel.app

Smart Contract Address: 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519

Features:
- AI Image Analysis (GPT-4o Vision)
- On-Chain Voting & Leaderboard
- Social Sharing (Twitter/Farcaster)
- MetaMask Integration
- Real-time Agent Routing (XMTP)

Tech Stack: React, TypeScript, Solidity, ElizaOS, XMTP

GitHub: https://github.com/ballew/ethrome-hackathon

Demo Video: [YouTube/Vimeo Link]

Icon: [Upload 256x256 PNG]
Logo: [Upload 512x512 PNG]
Banner: [Upload 1200x630 PNG]
Screenshots: [Upload 3-5 mobile screenshots]
```

---

## 🧪 Pre-Submission Testing

### Testnet Verification
- [ ] Connect MetaMask to Base Sepolia
- [ ] Upload test image
- [ ] Select all 3 agents (test each roast)
- [ ] Vote on roasts (verify on-chain)
- [ ] Check leaderboard updates
- [ ] Share to Twitter (verify OG card appears)
- [ ] Share to Farcaster (verify link works)

### Contract Verification
- [ ] View contract on Basescan
- [ ] Call `getTotalRoasts()` returns > 0
- [ ] Call `getTopRoasts(10)` returns data
- [ ] Verify events logged

### Frontend Checks
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images load from S3
- [ ] Share links work
- [ ] Wallet connection smooth

---

## 📬 Submission Checklist

Before submitting:
- [ ] All visual assets uploaded and URLs correct
- [ ] Demo video recorded and hosted
- [ ] miniapp.json is valid JSON
- [ ] README is comprehensive
- [ ] No hardcoded test data in production
- [ ] Environment variables configured on Vercel
- [ ] Smart contract verified on Basescan
- [ ] Testnet flow tested end-to-end
- [ ] Social media links updated
- [ ] Team contact info provided

---

## 🎯 Submission Link

**Base Miniapp Store**: [Add link from Base]

**Status**: 🟢 Ready for Submission

---

## Support & Questions

- **GitHub Issues**: Create issue in repo
- **Discord**: [Add team Discord]
- **Twitter**: [Add team Twitter]

---

Last Updated: October 2024
Version: 1.0.0
