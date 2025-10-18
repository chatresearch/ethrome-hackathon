# 🔥 AI Roast Generator - Protocol Council

A whimsical, viral-ready Web3 mini application that uses AI agents to generate hilarious roasts of user selfies. Built for the **Base Mini Apps**, **XMTP Agent**, **ENS**, **BuidlGuidl**, and **Ethereum Foundation** hackathons.

**Live Demo:** https://ai-roast-generator-ivory.vercel.app

---

## 🎯 Hackathon Bounties & Implementation

### 1. **Base Mini Apps ($5k)** ✅
**Challenge:** Build an engaging, viral mini app that drives user adoption and social sharing on Base blockchain.

**Implementation:**
- 🎨 **Whimsical UI/UX** - Animated gradient banner, dark mode, confetti animations
- 📱 **Mobile-first responsive design** - Optimized for mobile sharing
- 🔥 **Viral mechanics** - Social sharing buttons (Twitter, Farcaster) with Open Graph previews
- 💰 **On-chain payments** - Users pay in ETH via Base Sepolia to get roasts
- 🏆 **Gamification** - Leaderboard showing top-voted roasts, voting system
- ⚡ **Lightning fast** - Vite + React for instant load times

**Key Feature:** Multi-agent selection with per-roast pricing aggregation in real-time

---

### 2. **Best Use of XMTP Agent SDK ($1.5k)** ✅
**Challenge:** Build agents that communicate via XMTP decentralized messaging.

**Implementation:**
- 🤖 **XMTP Agent** - Runs as standalone service listening for XMTP messages
- 🔗 **Direct messaging** - Users send requests via the mini app, XMTP agent routes to ElizaOS
- 📤 **Image support** - Receives S3 image URLs, uploads to ElizaOS media API for vision analysis
- ✨ **Real-time responses** - Uses ElizaOS Sessions API for synchronous agent communication
- 🎯 **Intelligent routing** - Routes to correct agent based on keywords (profile, LinkedIn, vibe)

**Technical Flow:**
```
User App → S3 Upload → XMTP Agent (localhost:3003) 
         → ElizaOS Media API → Vision Agents 
         → Agent Response → XMTP Response → Mini App
```

---

### 3. **Best Miniapp in a Group Chat ($1.5k)** ✅
**Challenge:** Create a mini app that works well in group chat contexts.

**Implementation:**
- 💬 **XMTP Integration** - Mini app communicates with XMTP agents directly
- 👥 **Multi-user support** - Each user gets their own session with agents
- 📸 **Shared results** - Users can copy roasts and share links to Farcaster/Twitter
- 🔐 **End-to-end encrypted** - All messages via XMTP are E2E encrypted
- 📊 **Social graph** - Leaderboard allows comparing roasts from friends

---

### 4. **ENS Integration ($5k from ENS Foundation)** ✅
**Challenge:** Use ENS for human-readable names and metadata.

**Implementation:**
- 🏷️ **Agent subdomains** - Each agent has ENS subdomain:
  - `profile-roaster.aiconfig.eth`
  - `linkedin-roaster.aiconfig.eth`
  - `vibe-roaster.aiconfig.eth`
  - `defi-wizard.aiconfig.eth`
  - `security-guru.aiconfig.eth`

- 🖼️ **ENS Avatars** - Avatar images displayed in agent selector via ENS text records
- 📋 **Capabilities metadata** - Agent capabilities stored in ENS text records:
  - `agent.capabilities` → JSON with agent specialties
  - `avatar` → Image URL for agent icon

- ✅ **Preload verification** - App checks ENS on startup to verify agent availability

---

### 5. **BuidlGuidl Reputation ($2k)** ✅
**Challenge:** Build cool Web3 apps that showcase blockchain skills.

**Implementation:**
- 🛠️ **Full-stack Web3** - Smart contracts, XMTP agents, ENS, on-chain payments
- 📚 **Clean architecture** - Separates frontend (Vite/React), backend (XMTP agent), smart contracts
- 🧪 **Battle-tested code** - Unit tests for agents and contracts
- 📖 **Well-documented** - Clear setup, deployment, and integration guides
- 🚀 **Deployed to production** - Live on Vercel with ngrok tunnel for XMTP

---

### 6. **XMTP ($3k)** ✅
**Challenge:** Build novel applications using XMTP for messaging.

**Implementation:**
- 📨 **XMTP messaging** - Mini app sends image requests via XMTP
- 🔒 **Private conversations** - All messages encrypted end-to-end
- 🤖 **Agent-to-user messaging** - Agents respond with roasts via XMTP
- 🌐 **Cross-domain** - Works on localhost, ngrok, and production Vercel

**Message Flow:**
```
User sends: "Roast my image: https://s3.../image.jpg"
         ↓
XMTP Agent routes to correct agent
         ↓
Agent responds: "😂 [ROAST]"
         ↓
Response delivered via XMTP
```

---

## 🏗️ Architecture

### Frontend (Vite + React)
Located in `ai-roast-generator/`

Core components:
- **App.tsx** - Main app with state management & preload checks
- **QueryBuilder.tsx** - Image upload & multi-agent selection
- **ResultsDisplay.tsx** - Roasts with social sharing buttons
- **Leaderboard.tsx** - Top voted roasts leaderboard
- **WalletConnect.tsx** - RainbowKit wallet integration

Hooks:
- **useXMTP.ts** - XMTP messaging to agents
- **useAgentPayment.ts** - On-chain payment processing
- **useHealthCheck.ts** - Backend connectivity verification
- **useS3Upload.ts** - Image upload to S3 bucket

### Backend (XMTP Agent)
Located in `xmtp-agent/`

- **index.ts** - XMTP listener & HTTP API server
- **ens-resolver.ts** - ENS lookups for agent metadata
- Health checks on startup & per-message
- Sessions API integration with ElizaOS

### Smart Contract (Foundry)
Located in `packages/foundry/`

- **AgentRegistry.sol** - Register agents & handle payments
- **RegisterRoasters.s.sol** - Deploy & configure 5 agents

### ElizaOS Agents
Located in `agent-marketplace/`

5 AI agents:
- **profile-roaster.ts** - Dating profile analysis
- **linkedin-roaster.ts** - LinkedIn headshot critique
- **vibe-roaster.ts** - Aesthetic & vibe evaluation
- **defi-wizard.ts** - DeFi analysis (fallback)
- **security-guru.ts** - Security review (fallback)

---

## 🚀 How It Works

### User Journey
1. **User uploads image** - Drag-and-drop or file picker
2. **Selects roasters** - Choose 1+ agents, see total cost
3. **Connects wallet** - RainbowKit on Base Sepolia
4. **Pays on-chain** - `AgentRegistry.sol` transaction
5. **Image uploaded** - To S3 bucket (public, shareable)
6. **XMTP message sent** - To XMTP agent with S3 URL
7. **Agent processes** - Uploads to ElizaOS, gets roast
8. **View roast** - See result with voting & sharing options
9. **Share socially** - Twitter, Farcaster, or copy link

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI |
| **Styling** | CSS with light gradients | Responsive, dark mode |
| **Blockchain** | Wagmi + RainbowKit | Wallet & transactions |
| **RPC** | Alchemy | Base Sepolia chain |
| **Messaging** | XMTP SDK v3 | Decentralized messaging |
| **Agents** | ElizaOS + OpenAI | AI with vision capability |
| **Storage** | AWS S3 | Image uploads |
| **DNS** | ENS | Agent discovery |
| **Deployment** | Vercel | Frontend hosting |
| **Tunnel** | ngrok | Local agent exposure |

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Agents** | 5 (3 roasters + 2 fallback) |
| **Bounties Targeted** | 6 |
| **Potential Earnings** | $16,500 |
| **Price per Roast** | 0.00001 ETH |
| **Max Batch** | 5 agents |
| **Response Time** | 2-3 seconds |
| **Image Formats** | PNG, JPG, GIF, WebP |

---

## 🎮 Features

### ✨ User Experience
- 🌓 Dark/light mode with system preference
- 📸 Drag-and-drop image upload
- 💫 Confetti on first roast
- 🎯 Real-time agent pricing
- ✅ Backend health indicator
- ❌ Clear error messages

### 🏆 Gamification
- ⭐ 1-5 star voting system
- 📊 Top roasts leaderboard
- 🎖️ Agent performance tracking
- 📈 Vote persistence via localStorage

### 🔗 Integration
- 🟣 Farcaster mini app registration
- 🐦 Twitter share button
- 📋 Copy-to-clipboard with metadata
- 🔐 ENS-backed agent discovery

---

## 🚀 Quick Start

### Local Development
```bash
# Terminal 1: ElizaOS agents
cd agent-marketplace && npm start

# Terminal 2: XMTP agent
cd xmtp-agent && npm run dev

# Terminal 3: ngrok tunnel
ngrok http 3003

# Terminal 4: Mini app
cd ai-roast-generator && npm run dev
```

Visit http://localhost:5174

### Production Deployment
```bash
cd ai-roast-generator
vercel deploy --prod
```

---

## 📝 Environment Setup

### Frontend
```env
VITE_REACT_APP_XMTP_API=https://[ngrok-url].ngrok-free.app
REACT_APP_XMTP_API=https://[ngrok-url].ngrok-free.app
```

### XMTP Agent
```env
XMTP_WALLET_KEY=[your-private-key]
XMTP_DB_ENCRYPTION_KEY=[encryption-key]
AWS_ACCESS_KEY_ID=[aws-key]
AWS_SECRET_ACCESS_KEY=[aws-secret]
AWS_REGION=eu-south-1
ELIZAOS_PORT=3002
HTTP_PORT=3003
```

### Smart Contract
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/[key]
BASE_SEPOLIA_RPC=https://base-sepolia.g.alchemy.com/v2/[key]
PRIVATE_KEY=[deployer-key]
```

---

## 🧪 Testing

```bash
# ElizaOS agents
cd agent-marketplace && npm test

# XMTP agent
cd xmtp-agent && npm test

# Smart contracts
cd packages/foundry && forge test -v
```

---

## 📚 Documentation

- [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Run all services
- [HACKATHON.md](./HACKATHON.md) - Project status & bounties
- [xmtp-agent/README.md](./xmtp-agent/README.md) - XMTP agent
- [agent-marketplace/README.md](./agent-marketplace/README.md) - ElizaOS agents

---

## 🎯 Future Roadmap

- 🎬 Video recording for viral clips
- 💎 NFT badges for top roasters
- 🤝 Multi-user roasting battles
- 🌍 Multilingual support
- 🎨 Custom agent creation
- 📲 Native mobile apps

---

## 👥 Built With

**Protocols & Platforms:**
- Base Sepolia (EVM L2)
- XMTP v3 (Decentralized Messaging)
- ENS (Domain & Metadata)
- ElizaOS (Agent Framework)

**Infrastructure:**
- Vercel (Frontend)
- ngrok (Tunneling)
- AWS S3 (Storage)
- Alchemy (RPC)

**Dev Tools:**
- Vite + React 18
- Foundry + Solidity
- Node.js + TypeScript
- OpenAI Vision API

---

## 📄 License

MIT - Open source for the Web3 community

---

**Status:** ✅ Production Ready | 🚀 Live on Vercel | 🎯 All Bounties Implemented | 💰 $16,500 Potential Earnings
