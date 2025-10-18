# Quickstart Guide

ENSIP-TBD-11 reference implementation: AI agents on ENS with payments on Base Sepolia.

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## What We Built

- **AgentRegistry.sol** - Smart contract for agent registration, payment, and earnings
- **ENS Integration** - Agent metadata in ENS text records (ENSIP-TBD-11)
- **Frontend** - Agent marketplace UI on Next.js + Scaffold-ETH 2
- **Demo Agents** - DeFi Wizard and Security Guru with A2A-style capabilities

## Quick Setup

```bash
# 1. Install dependencies
yarn install

# 2. Create wallet
cd packages/foundry
cast wallet new-mnemonic

# 3. Fund wallet with Sepolia ETH (for ENS) and Base Sepolia ETH (for contract)
# Ethereum Sepolia: https://www.alchemy.com/faucets/ethereum-sepolia
# Base Sepolia: https://faucet.quicknode.com/base/sepolia

# 4. Deploy contract
forge script script/DeployAgentRegistry.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai

# 5. Register agents
forge script script/RegisterAgents.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai

# 6. (Optional) Set up ENS text records
forge script script/SetENSTextRecords.s.sol \
  --rpc-url https://eth-sepolia.public.blastapi.io \
  --broadcast \
  --account ai \
  --password ai

# 7. Start frontend
cd ../nextjs
yarn dev
```

Visit http://localhost:3001 to see the marketplace.

## Architecture

Contract on Base Sepolia handles payments. ENS on Ethereum Sepolia provides agent metadata via text records.

```
User → Frontend → Contract query → Agent response
                 (Base Sepolia)

ENS text records → agent.capabilities → capabilities.json
(Ethereum Sepolia)    agent.endpoint → agent API
```

## Key Files

- `packages/foundry/contracts/AgentRegistry.sol` - Payment and discovery logic
- `packages/foundry/script/ScriptConstants.sol` - Shared configuration
- `packages/foundry/script/RegisterAgents.s.sol` - Register agents
- `packages/foundry/script/SetENSTextRecords.s.sol` - Set ENSIP-TBD-11 metadata
- `packages/nextjs/app/agents/page.tsx` - Marketplace UI

## Testing

```bash
cd packages/foundry
forge test -v
```

19 tests passing: registration, payments, withdrawals, access control, discovery.

## Demo Agents

**defi-wizard.aiconfig.eth**
- Yield opportunity analysis
- Risk assessment
- Protocol comparisons

**security-guru.aiconfig.eth**
- Smart contract vulnerability analysis
- Security best practices
- Audit recommendations

## ENSIP-TBD-11 Schema

Agent metadata in ENS text records:

| Key | Value |
|-----|-------|
| `agent.capabilities` | URL to A2A capabilities JSON |
| `agent.endpoint` | Agent API endpoint |
| `agent.description` | Human-readable description |
| `agent.type` | Framework type (e.g., "eliza-os") |
| `agent.version` | Agent version |

## Next Steps

1. Customize agent names and capabilities in `ScriptConstants.sol`
2. Set your own ENS text records via `SetENSTextRecords.s.sol`
3. Integrate your ElizaOS agents
4. Deploy to mainnet when ready

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## References

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full setup guide
- [TESTING.md](./TESTING.md) - Test documentation
- [Smart Contract Source](./packages/foundry/contracts/AgentRegistry.sol)
- [ENSIP-TBD-11](https://github.com/nxt3d/ensips/blob/ensip-ideas/ensips/ensip-TBD-11.md)
