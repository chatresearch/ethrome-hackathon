# 🚀 Deployment & Submission Guide

## Quick Summary

Your **AI Roast Generator** is production-ready for Base miniapp submission! Here's everything you need:

### ✅ What's Done
- Smart Contract: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` (24/24 tests ✅)
- Frontend: https://ai-roast-generator-ivory.vercel.app (deployed ✅)
- Documentation: README, miniapp.json, submission checklist ✅
- Features: AI roasting, on-chain voting, social sharing ✅

---

## 📋 To Submit, You Need

### 1. Visual Assets (Create These)
```
public/
  ├── icon.png (256x256) - App icon
  ├── logo.png (512x512) - Full logo
  ├── banner.png (1200x630) - Store preview
  └── screenshots/
      ├── 1-upload.png - Upload interface
      ├── 2-agent-select.png - Agent selection
      ├── 3-roast-result.png - Roast output
      ├── 4-voting.png - Voting interface
      └── 5-share.png - Social sharing
```

**How to Create:**
- Use screenshots from the live app
- Edit in: Figma, Canva, or Adobe
- Must be crisp and mobile-friendly

### 2. Demo Video (3 minutes)
Record showing:
1. Load app → Connect MetaMask
2. Upload image → Select agent
3. Watch roast generate → Vote on-chain
4. Share to Twitter/Farcaster

**Tools:**
- ScreenFlow (Mac), OBS (Windows), Loom (browser)
- Upload to YouTube unlisted or Vimeo
- Get shareable link for submission

### 3. Update URLs in miniapp.json
```json
{
  "icon": "https://ai-roast-generator-ivory.vercel.app/icon.png",
  "logo": "https://ai-roast-generator-ivory.vercel.app/logo.png",
  "banner": "https://ai-roast-generator-ivory.vercel.app/banner.png"
}
```

---

## 🎯 Submission Steps

### Step 1: Prepare Assets
```bash
# Add to public folder on Vercel
ai-roast-generator/public/
├── icon.png
├── logo.png
├── banner.png
└── screenshots/
    ├── 1-upload.png
    ├── 2-agent-select.png
    ├── 3-roast-result.png
    ├── 4-voting.png
    └── 5-share.png
```

### Step 2: Deploy to Vercel (if not done)
```bash
cd ai-roast-generator
vercel deploy --prod
```

### Step 3: Fill Submission Form
See: `SUBMISSION_CHECKLIST.md` for form template

### Step 4: Submit to Base
- Go to: https://base.org/miniapps
- Or: Check Base forum for submission link
- Attach:
  - miniapp.json
  - Visual assets (URLs)
  - Demo video link
  - GitHub repo

### Step 5: Wait for Review
- Base team reviews submission
- May take 1-2 weeks
- They'll contact you with feedback

---

## 🧪 Pre-Submission Testing (Final Check)

```bash
# 1. Test Frontend Build
cd ai-roast-generator
npm run build  # Should complete with no errors

# 2. Test Smart Contracts
cd eth-ai-asa/packages/foundry
forge test -v  # Should show 24 passed

# 3. Manual Testing Checklist
- [ ] Open https://ai-roast-generator-ivory.vercel.app
- [ ] Connect MetaMask (switch to Base Sepolia)
- [ ] Upload test image
- [ ] Try each roaster agent
- [ ] Vote on each roast
- [ ] Share to Twitter (check OG card)
- [ ] Share to Farcaster (check link)
- [ ] Check leaderboard
- [ ] No console errors
```

---

## 📦 Files Ready for Submission

```
📁 ethrome-hackathon/
├── miniapp.json ✅
├── SUBMISSION_CHECKLIST.md ✅
├── README_BASE_MINIAPP.md ✅
├── DEPLOYMENT_GUIDE.md ✅
├── eth-ai-asa/
│   └── packages/foundry/
│       ├── contracts/AgentRegistry.sol ✅
│       └── test/AgentRegistry.t.sol ✅
└── ai-roast-generator/
    ├── src/ ✅
    └── public/ (← add visual assets here)
```

---

## 🔗 Important Links

- **Live App**: https://ai-roast-generator-ivory.vercel.app
- **Smart Contract**: https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519
- **GitHub**: https://github.com/ballew/ethrome-hackathon
- **Base Docs**: https://docs.base.org
- **Miniapp Registry**: [Find Base's miniapp registry link]

---

## ⚠️ Common Issues & Fixes

### "Assets not loading"
- Check URLs in miniapp.json match Vercel paths
- Images must be in `public/` folder
- Use absolute URLs (https://...)

### "Contract address not verified"
- Go to Basescan
- Contract upload source code (Foundry)
- Verify match to deployed code

### "App doesn't load on Base"
- Ensure MetaMask is set to Base Sepolia (Chain 84532)
- Check browser console for errors
- Verify XMTP agent is running (if using local)

### "Social shares not working"
- Verify `/roast` page loads (check OG tags)
- Use Twitter Card validator
- Check Farcaster link format

---

## 💡 Tips for Better Submission

1. **Demo Video**: Make it engaging! Show personality.
2. **Visual Assets**: Use your app colors/branding. Keep style consistent.
3. **Description**: Be clear but catchy. "Brutally hilarious" works.
4. **Contract**: Make sure it's verified on Basescan for credibility.
5. **Testing**: Reviewers will test your app. Make sure it's bulletproof.

---

## 📞 Support

Questions? Check:
- `README_BASE_MINIAPP.md` - Full docs
- `SUBMISSION_CHECKLIST.md` - Item-by-item guide
- GitHub Issues - Ask questions there
- Base Discord - Community support

---

## ✨ You're Ready!

Everything is set up. Next steps:
1. Create visual assets (1-2 hours)
2. Record demo video (15 mins)
3. Deploy to Vercel (already done!)
4. Submit to Base
5. Wait for approval 🎉

**Estimated time to submission: 2-3 hours**

Good luck! 🚀
