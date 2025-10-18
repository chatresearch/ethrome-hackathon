# ENS Agent Marketplace - ENSIP-TBD-11 Reference Implementation

AI Agent-as-a-Service platform using ENS for decentralized agent discovery and payment.

Built for ETHRome 2025 | Targets ENS, BuidlGuidl, and Base bounties.

## What This Does

Agents are identified by ENS names (e.g., `defi-wizard.aiconfig.eth`). Their capabilities are stored in ENS text records. Payments are tracked on Base Sepolia. No central database needed.

```
ENS (Ethereum Sepolia)          AgentRegistry (Base Sepolia)      Agent Runtime
- agent.capabilities            - Payment tracking                - ElizaOS
- agent.endpoint                - Query counting                  - OpenAI integration
- agent.description             - Earnings management             - Custom personalities
```

## Tech Stack

- **Smart Contracts**: Solidity + Foundry
- **Deployment**: Base Sepolia (L2)
- **Identity**: ENS (Ethereum Sepolia)
- **Frontend**: Next.js + Scaffold-ETH 2 + Tailwind
- **Agent Runtime**: ElizaOS + OpenAI
- **Standards**: ENSIP-TBD-11, A2A Protocol

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd eth-ai-asa
yarn install

# Deploy contract to Base Sepolia
cd packages/foundry
yarn deploy

# Start frontend
cd ../nextjs
yarn dev
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## ENSIP-TBD-11 Schema

Agent metadata uses ENS text records as the standard:

| Key | Purpose | Example |
|-----|---------|---------|
| `agent.capabilities` | A2A capabilities JSON URL | `https://github.com/.../capabilities.json` |
| `agent.endpoint` | Agent API endpoint | `https://api.agents.com/defi-wizard` |
| `agent.description` | Human-readable description | "Expert DeFi strategy advisor" |
| `agent.type` | Framework type | "eliza-os" |
| `agent.version` | Agent version | "1.0.0" |

This enables:
1. Lookup agent ENS name
2. Read capabilities from text records
3. Fetch capabilities JSON
4. Discover agent capabilities
5. Call agent endpoint
6. No proprietary API or central database

## Smart Contract: AgentRegistry

Core functions:

```solidity
registerAgent(string ensName, uint256 queryPrice)
queryAgent(string ensName) payable
updateAgent(string ensName, uint256 newPrice, bool active)
withdrawEarnings(string ensName)
deleteAgent(string ensName)
getAgent(string ensName)
getTotalAgents()
```

Key design: Payment data on-chain, metadata in ENS text records.

## Demo Agents

**DeFi Wizard** (`defi-wizard.aiconfig.eth`)
- Yield opportunity analysis
- Risk assessment
- Protocol comparisons
- Gas optimization

**Security Guru** (`security-guru.aiconfig.eth`)
- Smart contract vulnerability analysis
- Security best practices
- Audit recommendations
- Red team simulation

## User Flow

1. User visits dApp
2. Browses agents via `getTotalAgents()`
3. Selects agent and reads ENS text records for capabilities
4. Pays to query agent via `queryAgent{value}()`
5. Contract records payment and updates earnings
6. Frontend calls agent endpoint via HTTP
7. ElizaOS responds with AI-generated answer
8. Result displayed to user

## Testing

```bash
cd packages/foundry
forge test -v          # Run all tests
forge test --gas-report # Gas analysis
```

All tests passing: 24/24

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Full setup and deployment
- [Testing Guide](./TESTING.md) - Test suite documentation
- [Smart Contract Source](./packages/foundry/contracts/AgentRegistry.sol)
- [ENSIP-TBD-11 Proposal](https://github.com/nxt3d/ensips/blob/ensip-ideas/ensips/ensip-TBD-11.md)

## Project Files

- `packages/foundry/contracts/AgentRegistry.sol` - Main contract
- `packages/foundry/script/ScriptConstants.sol` - Shared script configuration
- `packages/foundry/script/RegisterAgents.s.sol` - Register agents on Base Sepolia
- `packages/foundry/script/SetENSTextRecords.s.sol` - Set ENS text records on Ethereum Sepolia
- `packages/nextjs/app/agents/page.tsx` - Agent marketplace UI

## License

MIT
