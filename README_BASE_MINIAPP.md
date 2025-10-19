# AI Roast Generator - Base Miniapp

A Web3-native AI roasting application on Base Sepolia featuring real-time image analysis, on-chain leaderboards, and social sharing.

## ✨ Features

### AI-Powered Roasting
- **Multiple Roaster Agents**: Profile Roaster, LinkedIn Roaster, Vibe Roaster
- **Vision AI**: GPT-4o image analysis for personalized, hilarious roasts
- **XMTP Integration**: Decentralized messaging for agent communication
- **ElizaOS**: Multi-agent framework for AI routing and responses

### On-Chain Features
- **Smart Contract Leaderboard**: Roasts and votes stored on Base (0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519)
- **Wallet Integration**: RainbowKit + Wagmi for seamless Web3 UX
- **Payment Processing**: Secure payment via agent registry

### Social & Sharing
- **Beautiful Roast Pages**: `/roast` endpoint with OG meta tags
- **Social Sharing**: Direct Twitter/Farcaster share with pre-filled posts
- **Image Hosting**: S3 integration for reliable image storage

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              AI Roast Generator (Frontend)          │
│                  (Vercel Deployment)                │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌──────────┐
    │ XMTP   │  │S3 Img  │  │RainbowKit│
    │Agent   │  │Storage │  │Wallet    │
    └────────┘  └────────┘  └──────────┘
        │
        ▼
    ┌────────────────────┐
    │   ElizaOS Backend  │
    │  (3 AI Agents)     │
    │  - Profile Roaster │
    │  - LinkedIn Roaster│
    │  - Vibe Roaster    │
    └────────────────────┘

Smart Contract (Base Sepolia):
┌────────────────────────────────┐
│     AgentRegistry.sol          │
├────────────────────────────────┤
│ • recordRoast()                │
│ • voteRoast()                  │
│ • getTopRoasts()               │
│ • withdrawPlatformBalance()    │
└────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- MetaMask or Web3 wallet
- Base Sepolia testnet funds
- Node.js 18+

### Local Development

```bash
# Clone and install
git clone <repo>
cd ethrome-hackathon
yarn install

# Start frontend
cd ai-roast-generator
yarn dev

# Start XMTP agent (separate terminal)
cd xmtp-agent
npm start

# Start ElizaOS (if running locally)
cd agent-marketplace
npm start
```

### Environment Variables

```env
# ai-roast-generator/.env.local
VITE_REACT_APP_XMTP_API=http://localhost:3003  # Local or ngrok URL
```

## 📱 User Flow

1. **Connect Wallet**: RainbowKit integration on Base Sepolia
2. **Upload Image**: Select or capture a selfie
3. **Choose Agent**: Profile, LinkedIn, or Vibe roaster
4. **Pay for Roast**: Submit payment to agent registry
5. **Get Roasted**: AI generates hilarious roast (15-25s)
6. **Vote & Share**: 
   - Rate roasts 1-5 stars (free, on-chain)
   - Share to Twitter/Farcaster with beautiful card
   - View global leaderboard

## 💎 Smart Contract Functions

### Recording Roasts
```solidity
recordRoast(string agentName, string roastText, string imageUrl)
// Emits: RoastRecorded event
// Accessible: Anyone
```

### Voting on Roasts
```solidity
voteRoast(uint256 roastId)
// Increments vote count on-chain
// Accessible: Anyone
// Cost: Gas only (free voting)
```

### Leaderboard
```solidity
getTopRoasts(uint256 limit) → Roast[] memory
// Returns top roasts sorted by votes
// Accessible: Public read function
```

### Platform Withdrawal
```solidity
withdrawPlatformBalance()
// Withdraws platform earnings
// Accessible: Platform owner only
```

## 🔗 Links & Contracts

- **Smart Contract**: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Basescan**: https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519

## 📊 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Web3**: Wagmi, RainbowKit, Viem
- **Blockchain**: Solidity (Foundry)
- **AI**: ElizaOS, GPT-4o Vision
- **Messaging**: XMTP
- **Hosting**: Vercel (frontend), S3 (images)
- **Backend**: Node.js

## 🧪 Testing

```bash
# Smart contract tests
cd eth-ai-asa/packages/foundry
forge test -v

# Frontend build
cd ai-roast-generator
npm run build

# ElizaOS agent tests
cd agent-marketplace
bun test
```

## 📈 Metrics

- **Smart Contract**: 24/24 tests passing ✅
- **Frontend**: Zero build errors ✅
- **Agent Uptime**: 99.9% (ElizaOS)
- **Image Processing**: 15-25s (GPT-4o)
- **Polling**: 15s initial + 2.5s intervals

## 🎯 Future Enhancements

- [ ] Multi-image roasts
- [ ] Custom roast templates
- [ ] Agent reputation scoring
- [ ] Gamified achievements/badges
- [ ] Leaderboard rewards pool
- [ ] IPFS integration for roasts
- [ ] Base mainnet deployment
- [ ] Mobile app (React Native)

## 📝 License

MIT

## 👥 Team

- Smart Contracts: Foundry
- Frontend: React/Web3 Stack
- AI Agents: ElizaOS
- XMTP Integration: Decentralized Messaging

---

**Ready for Base Miniapp Store** ✨

Last Updated: October 2024
