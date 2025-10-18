# XMTP Agent Setup - DeFi Wizard & Security Guru

## Project Created

New XMTP agent project in `/xmtp-agent/` that:
- Listens for messages via XMTP
- Routes to DeFi Wizard or Security Guru based on keywords
- Sends responses back via XMTP chat

## Quick Start

```bash
cd xmtp-agent

# 1. Install dependencies
npm install

# 2. Create .env
cp .env.example .env
# Edit .env and add your PRIVATE_KEY

# 3. Run the agent
npm run dev
```

## What It Does

1. Connects to XMTP network with your wallet
2. Listens for incoming messages
3. Routes messages based on keywords:
   - **DeFi Wizard**: "defi", "yield", "farming"
   - **Security Guru**: "security", "contract", "vulnerability"
4. Sends responses back via XMTP

## Next Steps

### 1. Integrate with ElizaOS Agents

Replace the mock responses in `src/index.ts` `callAgent()` function:

```typescript
// Currently mock responses - replace with:
const response = await fetch(
  `http://localhost:3002/api/agents/defi-wizard/message`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query })
  }
);
```

### 2. Get an Agent Wallet/Private Key

You need a wallet to run the XMTP agent:
```bash
# Generate a test wallet:
npx ethers-cli createwallet

# Or use an existing private key from MetaMask/hardware wallet
```

### 3. Test with XMTP

- Message your agent address in XMTP
- See responses come back

### 4. Create a Base Mini App (Optional - for $1,500 bounty)

- Wrap this agent in a React mini app UI
- Users interact via group chat with the mini app

## Bounty Opportunities

✅ **Best Use of Agent SDK ($1,500)** - You have this with XMTP agent

🎯 **Best Miniapp in a Group Chat ($1,500)** - Optional: wrap in React UI

## Files

- `src/index.ts` - Main agent code
- `.env` - Configuration (PRIVATE_KEY)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

## Architecture

```
XMTP Chat
    ↓
XMTP Agent (this project)
    ↓
ElizaOS Agents (agent-marketplace)
    ↓
OpenAI LLM
    ↓
Response back to user in XMTP
```

## Test Without Running ElizaOS

The mock responses in `callAgent()` work without running ElizaOS, so you can test the XMTP integration first!

## Integration Checklist

- [ ] Install dependencies
- [ ] Create .env with PRIVATE_KEY
- [ ] Run `npm run dev`
- [ ] Test sending message via XMTP
- [ ] Replace mock responses with actual ElizaOS calls
- [ ] Deploy agent to persistent host
- [ ] Submit to bounty

