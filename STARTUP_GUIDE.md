# Project Startup Guide

## Quick Start (One Command)

```bash
cd /path/to/ethrome-hackathon
./start-all.sh start
```

Starts all services and opens UIs automatically.

## Script Usage

### Start All Services
```bash
./start-all.sh start
```

### Start Single Service
```bash
./start-all.sh start buildguidl    # Port 3000
./start-all.sh start elizaos       # Port 3002
./start-all.sh start xmtp          # Port 3003
./start-all.sh start miniapp       # Port 5174
```

### Stop All Services
```bash
./start-all.sh stop
```

### Stop Single Service
```bash
./start-all.sh stop buildguidl
./start-all.sh stop elizaos
./start-all.sh stop xmtp
./start-all.sh stop miniapp
```

### Show Help
```bash
./start-all.sh -h
```

## Port Configuration

- **3000:** BuidlGuidl Frontend (required)
- **3002:** ElizaOS Agents (required)
- **3003:** XMTP Agent HTTP API (required)
- **5174:** Protocol Council Miniapp (required)

## Services Overview

### BuidlGuidl Frontend (port 3000)
- Agent marketplace dApp
- View agents from AgentRegistry contract
- Query agents directly
- Built with Scaffold-ETH + NextJS

### ElizaOS Agents (port 3002)
- DeFi Wizard agent
- Security Guru agent
- Uses real OpenAI API (no mocks)

### XMTP Agent (port 3003)
- HTTP API wrapper around XMTP SDK
- Routes requests to ElizaOS agents
- Includes ENS capability metadata
- API endpoint: `POST /api/message`

### Protocol Council Miniapp (port 5174)
- Main UI for voting and leaderboard
- Queries XMTP Agent API
- Voting on agent accuracy (1-5 scale)
- Real-time leaderboard (localStorage)

## Manual Startup (if needed)

### Terminal 1: BuidlGuidl Frontend

```bash
cd eth-ai-asa
yarn install
yarn start  # Port 3000
```

### Terminal 2: ElizaOS Agents

```bash
cd agent-marketplace
SERVER_PORT=3002 npm run start
```

### Terminal 3: XMTP Agent

```bash
cd xmtp-agent
HTTP_PORT=3003 ELIZAOS_PORT=3002 npm run dev
```

**Critical .env settings (xmtp-agent/.env):**
```
XMTP_WALLET_KEY=0x... (your private key)
XMTP_DB_ENCRYPTION_KEY=... (NO 0x prefix, 64 hex chars)
XMTP_ENV=production
```

### Terminal 4: Protocol Council Miniapp

```bash
cd protocol-council-miniapp
npm run dev  # Port 5174
```

## Testing the Stack

Once all services are running:

### Test XMTP API Endpoint
```bash
curl -X POST http://localhost:3003/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is yield farming?"}'
```

Should return agent response with capabilities.

### Test Miniapp UI
1. Open http://localhost:5174
2. Enter "Analyze yield farming"
3. Should see real DeFi Wizard response from ElizaOS
4. Vote 1-5 on accuracy
5. Leaderboard updates in real-time

### Test BuidlGuidl
1. Open http://localhost:3000
2. Browse registered agents
3. Query agents directly

## Architecture

```
User Browser
    ↓
BuidlGuidl (3000)          Protocol Council Miniapp (5174)
    ↓                              ↓
AgentRegistry Contract     XMTP Agent API (3003)
    ↓                              ↓
Base Sepolia              ElizaOS Agents (3002)
    ↓                              ↓
Smart Contract            OpenAI API (real LLM)
    
+ ENS resolution (Sepolia)
+ Capability metadata
+ User voting + leaderboard (localStorage)
```

## Troubleshooting

### ElizaOS won't start - "Port 3000 is in use"

ElizaOS has a bug where it ignores SERVER_PORT and tries port 3000. Kill anything on 3000:

```bash
lsof -i :3000
kill -9 <PID>

# Then try again
./start-all.sh start elizaos
```

### XMTP Agent won't start

**Error: "Failed to query defi-wizard on port 3001"**
- Make sure ElizaOS is running on port 3002
- Check: `lsof -i :3002`

**Error: "Non-base16 character"**
- Check `XMTP_DB_ENCRYPTION_KEY` has NO `0x` prefix
- Must be exactly 64 hex characters

### Miniapp shows "Failed to send message"

1. Verify XMTP Agent is running: `lsof -i :3003`
2. Verify ElizaOS is running: `lsof -i :3002`
3. Check browser console for actual error
4. Try curl test first (see Testing section)

### Port Already in Use

```bash
# Find and kill process
lsof -i :<PORT>
kill -9 <PID>

# Or just run the cleanup
./start-all.sh stop
```

## Logs

All services log to `/tmp/`:
```bash
tail -f /tmp/buildguidl.log  # BuidlGuidl logs
tail -f /tmp/elizaos.log     # ElizaOS logs
tail -f /tmp/xmtp.log        # XMTP Agent logs
tail -f /tmp/miniapp.log     # Miniapp logs
```

## Cleanup

Stop all services:

```bash
./start-all.sh stop
```

Or manually:
```bash
pkill -f 'npm run dev|npm run start|bun run start|yarn start'
```
