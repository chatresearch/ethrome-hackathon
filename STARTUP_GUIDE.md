# Project Startup Guide

## Quick Start

This project consists of three main services that run on different ports.

### Port Configuration

- **BuidlGuidl Frontend (NextJS)**: `http://localhost:3000`
- **ElizaOS Agents**: `http://localhost:3001` (configured in `agent-marketplace/.env`)
- **Vite Dev Server** (if running frontend from agent-marketplace): `http://localhost:5173`

## Starting Services

### 1. Start the BuidlGuidl Frontend (eth-ai-asa)

```bash
cd eth-ai-asa

# Install dependencies
yarn install

# Start the frontend (runs on port 3000)
yarn start
```

### 2. Start the ElizaOS Agents (agent-marketplace)

In a new terminal:

```bash
cd agent-marketplace

# Install dependencies
bun install

# Make sure .env file exists with SERVER_PORT=3001
cat .env

# Start the agents (runs on port 3001)
bun run start
# or
elizaos start
```

### 3. Test the Agents

In a new terminal, test that agents are running:

```bash
# Test DeFi Wizard agent
curl -X POST http://localhost:3001/api/agents/defi-wizard/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is yield farming?"}'

# Test Security Guru agent
curl -X POST http://localhost:3001/api/agents/security-guru/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What are common smart contract vulnerabilities?"}'
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Find what's using the port
lsof -i :3000  # or :3001, :3001, etc.

# Kill the process if needed
kill -9 <PID>
```

### Setting OpenAI API Key

The agents require an OpenAI API key:

```bash
# In agent-marketplace directory
echo "OPENAI_API_KEY=sk-your-api-key-here" >> .env
```

### ElizaOS Not Starting

Check the logs:
- Ensure `SERVER_PORT=3001` is set in `agent-marketplace/.env`
- Ensure `OPENAI_API_KEY` is configured
- Run with debug: `DEBUG=* bun run start`

## Architecture

```
User Browser (http://localhost:3000)
    ↓
BuidlGuidl Frontend (NextJS)
    ↓ (queries via /api proxy)
ElizaOS Server (http://localhost:3001)
    ├─ DeFi Wizard Agent
    └─ Security Guru Agent
        ↓
    OpenAI API (GPT-4)
```

## Integration

The frontend automatically proxies `/api` requests to `http://localhost:3001` (or whatever `SERVER_PORT` is configured to).

When you query an agent from the frontend, the flow is:
1. User enters message in UI
2. Frontend sends POST to `/api/agents/defi-wizard/message`
3. Vite/NextJS dev server proxies to `http://localhost:3001/api/agents/defi-wizard/message`
4. ElizaOS server processes with agent
5. Response returned to frontend
