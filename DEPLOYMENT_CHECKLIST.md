# 🚀 AI Roast Generator - Deployment & Submission Checklist

## ✅ Pre-Deployment Verification

### Backend Services
- [x] ElizaOS agents running (port 3002)
  - profile-roaster
  - linkedin-roaster
  - vibe-roaster
  - defi-wizard
  - security-guru

- [x] XMTP Agent running (port 3003)
  - Message routing working
  - S3 presigned URL endpoint live
  - AWS credentials configured

- [x] ngrok tunnel active
  - Public URL accessible
  - Forwarding to XMTP agent

### Frontend
- [x] Miniapp building successfully
- [x] No TypeScript errors
- [x] All dependencies installed

### Smart Contracts
- [x] AgentRegistry deployed on Base Sepolia
- [x] All 5 agents registered with prices
- [x] ENS subdomains set up (aiconfig.eth)

### AWS Setup
- [x] S3 bucket created (irc-ai-roaster)
- [x] IAM user configured (irc-roaster-app)
- [x] Presigned URL generation working
- [x] Public read access enabled

### Farcaster
- [x] Manifest created at `.well-known/farcaster.json`
- [ ] Manifest signed with your Farcaster account
- [ ] Registered in Farcaster directory

---

## 🎬 Final Deployment Steps

### 1. Deploy to Vercel
```bash
cd ai-roast-generator
vercel --prod
```

Verify Vercel env vars are set:
- ✅ VITE_REACT_APP_XMTP_API (ngrok URL)
- ✅ AWS_ACCESS_KEY_ID
- ✅ AWS_SECRET_ACCESS_KEY
- ✅ AWS_REGION

### 2. Test Live at https://ai-roast-generator.vercel.app/
- Upload test image
- Connect wallet (Base Sepolia)
- Pay for roast
- Get roasts
- Share on Twitter/Farcaster

### 3. Verify Manifest Endpoint
```bash
curl https://ai-roast-generator.vercel.app/.well-known/farcaster.json
```

### 4. Sign Farcaster Manifest
Go to: https://miniapps.farcaster.xyz/
- Upload manifest
- Sign with your account
- Replace unsigned version with signed version

### 5. Test Sharing
- Get a roast
- Click "🎭 Cast"
- Verify Farcaster preview shows image + text

---

## 📹 Demo Video Script (3 minutes)

1. **Intro (10s)**
   - "AI Roast Generator - Get your selfies roasted by AI agents"

2. **Upload & Payment (30s)**
   - Upload selfie
   - Connect wallet
   - Show payment (0.00001 ETH)
   - Confirm transaction

3. **AI Roasts (60s)**
   - Show 3-4 different roasts loading
   - Read out funny roasts
   - Highlight different agents (profile, LinkedIn, vibe)

4. **Social Sharing (40s)**
   - Click "🎭 Cast" button
   - Show Farcaster share dialog
   - Show OG preview with image + text
   - Post roast

5. **Viewing Shared Roast (20s)**
   - Show the `/api/roast` page rendering beautifully
   - Click "Get Your Own Roast" CTA
   - Show viral loop potential

6. **Outro (20s)**
   - Show leaderboard
   - "Built on Base, ElizaOS agents, XMTP messaging"

---

## 🏆 Bounties Checklist

### Base Mini Apps ($5k)
- [x] Built on Base (Sepolia for testing)
- [x] On-chain payments via AgentRegistry
- [x] Social sharing with OG meta tags
- [x] Deployed to Vercel
- [x] Farcaster integration ready
- [x] Demo video (3 mins)

### BuidlGuidl ($2k)
- [x] Using Scaffold-ETH 2 components
- [x] RainbowKit + Wagmi integration
- [x] Smart contract testing

### ENS ($5k)
- [x] Agent discovery via ENS
- [x] Capability lookups from ENS text records
- [x] Subdomain setup (*.aiconfig.eth)

### XMTP ($3k)
- [x] Agent-to-Agent communication
- [x] XMTP messaging infrastructure
- [x] Message routing by capabilities

### ElizaOS (implicit)
- [x] Multiple specialized agents
- [x] Vision capabilities (image analysis)
- [x] HTTP API integration

---

## 📋 Submission Links

Update with your actual links before submitting:

- **Base Mini Apps**: https://miniapps.base.org/
  - URL: https://ai-roast-generator.vercel.app/
  - Repo: https://github.com/chatresearch/ethrome-hackathon
  - Demo: [Upload video link]

- **BuidlGuidl**: https://buidlguidl.com/
  - Repo: https://github.com/chatresearch/ethrome-hackathon
  - Live: https://ai-roast-generator.vercel.app/

- **ENS**: https://explore.ens.domains/
  - ENS domains: profile-roaster.aiconfig.eth, etc.
  - Repo: https://github.com/chatresearch/ethrome-hackathon

- **XMTP**: https://xmtp.org/
  - XMTP agent: https://github.com/chatresearch/ethrome-hackathon/tree/main/xmtp-agent
  - Live agent: Running on Base Sepolia

---

## 🎯 Final Checklist Before Submission

- [ ] All code committed and pushed
- [ ] Vercel deployment working
- [ ] Demo video recorded and hosted
- [ ] Farcaster manifest signed
- [ ] All bounty requirements verified
- [ ] Links tested and working
- [ ] README updated with instructions

**You're ready to submit! 🚀**
