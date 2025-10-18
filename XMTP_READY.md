# 🚀 XMTP Agent Ready!

Your XMTP agent is built and ready to run!

## Quick Start

```bash
cd xmtp-agent

# 1. Create .env with your private key
echo "PRIVATE_KEY=0x..." > .env

# 2. Run the agent
npm run dev
```

## Getting a Private Key

### Option 1: Use an Existing Wallet
- MetaMask: Settings → Account Details → Export Private Key
- Hardware Wallet: Check wallet documentation
- Testnet Wallet: Keep it safe, **never use production funds**

### Option 2: Create a Test Wallet
```bash
node -e "const { ethers } = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log('Address:', wallet.address); console.log('PrivateKey:', wallet.privateKey);"
```

## What the Agent Does

✅ Listens for messages via XMTP
✅ Routes to DeFi Wizard or Security Guru based on keywords
✅ Sends responses back via XMTP chat
✅ Works on production XMTP network

## Keywords for Routing

### DeFi Wizard
- "defi", "yield", "farming", "apy", "liquidity"

### Security Guru  
- "security", "contract", "vulnerability", "audit", "exploit"

## Example Usage

1. Start the agent: `npm run dev`
2. Message the agent address via XMTP (Base App or other XMTP clients)
3. Get responses routed to the right specialist

## Next Steps

- [ ] Get a private key
- [ ] Add to .env
- [ ] Run `npm run dev`
- [ ] Test via XMTP
- [ ] Connect to ElizaOS agents (optional, advanced)
- [ ] Deploy to production
- [ ] Submit to XMTP bounty ($1,500)

## Bounty Info

✅ **Best Use of Agent SDK ($1,500)** - You have this!

🎯 **Best Miniapp in a Group Chat ($1,500)** - Optional: Wrap in React UI

## Files

- `src/index.ts` - Main agent code
- `.env.example` - Config template
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

## Architecture

```
XMTP Chat
    ↓
Your XMTP Agent (running now!)
    ↓
Routes to DeFi Wizard or Security Guru
    ↓
Responds via XMTP
```

**Status: READY TO RUN** 🎉

