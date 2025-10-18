# Protocol Council Miniapp

Base App miniapp for collaborative DeFi protocol analysis with voting and leaderboards.

## Components

- **QueryBuilder** - Input protocol names for analysis
- **ResultsDisplay** - Show agent responses with capabilities  
- **Voting Interface** - Accuracy voting (1-5 scale)
- **useXMTP Hook** - Message sending/receiving

## Features

- Query specialist agents (DeFi Wizard, Security Guru)
- See capability metadata for each agent
- Vote on analysis accuracy
- Track votes in localStorage (MVP)

## Dev

```bash
npm install
npm run dev    # port 5174
npm run build
```

## Integration

- Proxies to XMTP agent on port 3002
- localStorage for vote tracking
- Next: Add Leaderboard component (Priority 3)
