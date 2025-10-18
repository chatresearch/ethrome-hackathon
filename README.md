# AI Roast Generator - Protocol Council

A Web3 mini application that uses AI agents to generate roasts of user selfies. Built for the Base Mini Apps, XMTP Agent, ENS, BuidlGuidl, and Ethereum Foundation hackathons.

**Live Demo:** https://ai-roast-generator-ivory.vercel.app

---

## Hackathon Bounties & Implementation

### 1. Base Mini Apps 
Challenge: Build an engaging, viral mini app that drives user adoption and social sharing on Base blockchain.

Implementation:
- Whimsical UI/UX with animations
- Mobile-first responsive design
- Viral mechanics with Twitter/Farcaster sharing
- On-chain payments via Base Sepolia
- Leaderboard and voting system
- Fast load times (Vite + React)

---

### 2. Best Use of XMTP Agent SDK 
Challenge: Build agents that communicate via XMTP decentralized messaging.

Implementation:
- XMTP Agent runs as standalone service
- Routes messages to ElizaOS
- Image support via S3 URLs
- Real-time responses using ElizaOS Sessions API
- Intelligent routing by keyword

Technical Flow:
```
User App -> S3 Upload -> XMTP Agent -> ElizaOS Media API -> Vision Agents -> Response
```

---

### 3. Best Miniapp in a Group Chat ($1.5k)
Challenge: Create a mini app that works well in group chat contexts.

Implementation:
- Standalone Web3 mini app with shareable links
- Results shareable to Twitter and Farcaster
- Leaderboard for comparing roasts with friends
- Copy-to-clipboard for easy sharing
- XMTP for private agent communication

---

### 4. ENS Integration ($5k)
Challenge: Use ENS for human-readable names and metadata.

Implementation:
- Agent subdomains:
  - profile-roaster.aiconfig.eth
  - linkedin-roaster.aiconfig.eth
  - vibe-roaster.aiconfig.eth
  - defi-wizard.aiconfig.eth
  - security-guru.aiconfig.eth

- ENS Avatars displayed in agent selector
- Capabilities stored in ENS text records
- ENSIP-TBD-11 root-context for verifiable AI context
  - Standardized entry point for agentic systems
  - Stores context data onchain for discovery
  - Allows agents to verify metadata without proprietary formats
- Preload verification on startup

---

### 5. BuidlGuidl Reputation ($2k)
Challenge: Build cool Web3 apps showcasing blockchain skills.

Implementation:
- Full-stack Web3 with smart contracts, XMTP agents, ENS
- Clean architecture separating frontend/backend/contracts
- Unit tests for agents and contracts
- Well-documented setup and deployment
- Production deployment on Vercel with ngrok

---

### 6. XMTP ($3k)
Challenge: Build novel applications using XMTP for messaging.

Implementation:
- XMTP messaging from mini app to agents
- Private end-to-end encrypted conversations
- Agent-to-user responses
- Cross-domain support (local, ngrok, Vercel)

---

## Architecture

### Frontend (Vite + React)
Located in `ai-roast-generator/`

Components:
- App.tsx: Main app with state and preload checks
- QueryBuilder.tsx: Image upload and multi-agent selection
- ResultsDisplay.tsx: Roasts with social sharing
- Leaderboard.tsx: Top voted roasts
- WalletConnect.tsx: RainbowKit integration

Hooks:
- useXMTP.ts: XMTP messaging
- useAgentPayment.ts: On-chain payments
- useHealthCheck.ts: Backend connectivity
- useS3Upload.ts: Image upload

### Backend (XMTP Agent)
Located in `xmtp-agent/`

- index.ts: XMTP listener and HTTP API server
- ens-resolver.ts: ENS lookups
- Health checks on startup
- Sessions API integration with ElizaOS

### Smart Contract (Foundry)
Located in `packages/foundry/`

- AgentRegistry.sol: Agent registration and payments
- RegisterRoasters.s.sol: Agent deployment and configuration

### ElizaOS Agents
Located in `agent-marketplace/`

5 agents:
- profile-roaster.ts: Dating profile analysis
- linkedin-roaster.ts: LinkedIn headshot critique
- vibe-roaster.ts: Aesthetic evaluation
- defi-wizard.ts: DeFi analysis (fallback)
- security-guru.ts: Security review (fallback)

---

## How It Works

User journey:
1. Upload image (drag-and-drop or file picker)
2. Select roasters (1+ agents, see total cost)
3. Connect wallet on Base Sepolia
4. Pay on-chain via AgentRegistry.sol
5. Image uploaded to S3 (public, shareable)
6. XMTP message sent to XMTP agent with S3 URL
7. Agent uploads to ElizaOS and gets roast
8. View result with voting and sharing options
9. Share to Twitter, Farcaster, or copy link

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Fast, modern UI |
| Styling | CSS with light gradients | Responsive, dark mode |
| Blockchain | Wagmi + RainbowKit | Wallet and transactions |
| RPC | Alchemy | Base Sepolia chain access |
| Messaging | XMTP SDK v3 | Decentralized messaging |
| Agents | ElizaOS + OpenAI | AI with vision |
| Storage | AWS S3 | Image uploads |
| DNS | ENS | Agent discovery |
| Deployment | Vercel | Frontend hosting |
| Tunnel | ngrok | Local agent exposure |

---

## Project Stats

| Metric | Value |
|--------|-------|
| Agents | 5 (3 roasters, 2 fallback) |
| Bounties Targeted | 6 |
| Potential Earnings | $16,500 |
| Price per Roast | 0.00001 ETH |
| Max Batch | 5 agents |
| Response Time | 2-3 seconds |
| Image Formats | PNG, JPG, GIF, WebP |

---

## Features

User Experience:
- Dark/light mode with system preference
- Drag-and-drop image upload
- Confetti animation on first roast
- Real-time agent pricing
- Backend health indicator
- Clear error messages

Gamification:
- 1-5 star voting system
- Top roasts leaderboard
- Agent performance tracking
- Vote persistence via localStorage

Integration:
- Farcaster mini app registration
- Twitter share button
- Copy-to-clipboard with metadata
- ENS-backed agent discovery

---

## Quick Start

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

## Environment Setup

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

## Testing

```bash
# ElizaOS agents
cd agent-marketplace && npm test

# XMTP agent
cd xmtp-agent && npm test

# Smart contracts
cd packages/foundry && forge test -v
```

---

## Documentation

- STARTUP_GUIDE.md: Run all services
- HACKATHON.md: Project status and bounties
- xmtp-agent/README.md: XMTP agent details
- agent-marketplace/README.md: ElizaOS agents

---

## Future Roadmap

- Video recording for viral clips
- NFT badges for top roasters
- Multi-user roasting battles
- Multilingual support
- Custom agent creation
- Native mobile apps

---

## Built With

Protocols and Platforms:
- Base Sepolia (EVM L2)
- XMTP v3 (Decentralized Messaging)
- ENS (Domain and Metadata)
- ENSIP-TBD-11 (root-context for verifiable agent context)
- ElizaOS (Agent Framework)

Infrastructure:
- Vercel (Frontend hosting)
- ngrok (Tunneling)
- AWS S3 (Storage)
- Alchemy (RPC)

Dev Tools:
- Vite and React 18
- Foundry and Solidity
- Node.js and TypeScript
- OpenAI Vision API

---

## License

MIT - Open source for the Web3 community

---

**Status:** Production Ready | Live on Vercel | All Bounties Implemented | $16,500 Potential Earnings
