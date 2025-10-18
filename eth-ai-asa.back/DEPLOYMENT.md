# Deployment Guide

Complete walkthrough for deploying the Agent Registry and setting up ENS integration.

## Prerequisites

### 1. Create Wallet

```bash
# Generate encrypted keystore wallet
cast wallet new-mnemonic
# Save password (we use "ai")
# This creates ~/.foundry/keystores/ai

# Show the address
cast wallet list
```

### 2. Fund Wallet

Get ETH from faucets:

- **Ethereum Sepolia** (for ENS): ~0.1 ETH
  - https://www.alchemy.com/faucets/ethereum-sepolia

- **Base Sepolia** (for contract): ~0.5 ETH
  - https://faucet.quicknode.com/base/sepolia

Verify balances:

```bash
cast balance YOUR_ADDRESS --rpc-url https://eth-sepolia.public.blastapi.io
cast balance YOUR_ADDRESS --rpc-url https://sepolia.base.org
```

## Phase 1: Deploy Smart Contract to Base Sepolia

```bash
cd packages/foundry

# Deploy AgentRegistry
forge script script/DeployAgentRegistry.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai
```

The contract is now deployed. Note the address from the output.

Update `packages/nextjs/contracts/deployedContracts.ts` if needed.

## Phase 2: Register Agents

Register demo agents on Base Sepolia:

```bash
forge script script/RegisterAgents.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai
```

This registers:
- `defi-wizard.aiconfig.eth` at 0.00001 ETH per query
- `security-guru.aiconfig.eth` at 0.00001 ETH per query

Verify registration:

```bash
cast call $CONTRACT_ADDRESS \
  "getAgent(string)" \
  "defi-wizard.aiconfig.eth" \
  --rpc-url https://sepolia.base.org
```

## Phase 3: Set Up ENS (Optional but Recommended)

ENS integration allows agents to have standardized metadata discoverable on-chain.

### Step 1: Create ENS Name on Ethereum Sepolia

1. Visit https://app.ens.domains
2. Connect wallet and switch to Sepolia network
3. Search for a name (e.g., `aiconfig.eth`)
4. Register it (costs ~0.002 ETH/year on testnet)

### Step 2: Create Subdomains

In app.ens.domains, go to your domain and create subdomains:
- `defi-wizard`
- `security-guru`

### Step 3: Set ENS Text Records

Get the namehashes for your subdomains (from ENS UI or use namehash tool).

Update `packages/foundry/script/ScriptConstants.sol`:

```solidity
bytes32 constant DEFI_WIZARD_NAMEHASH = 0x...; // From ENS UI
bytes32 constant SECURITY_GURU_NAMEHASH = 0x...; // From ENS UI
```

Run the script to set text records on Ethereum Sepolia:

```bash
forge script script/SetENSTextRecords.s.sol \
  --rpc-url https://eth-sepolia.public.blastapi.io \
  --broadcast \
  --account ai \
  --password ai
```

This sets:
- `agent.capabilities` → GitHub URL to capabilities JSON
- `agent.endpoint` → Agent API endpoint
- `agent.description` → Human-readable description
- `agent.type` → "eliza-os"
- `agent.version` → "1.0.0"

Verify text records:

```bash
cast call ENS_RESOLVER \
  "text(bytes32,string)" \
  $NAMEHASH \
  "agent.capabilities" \
  --rpc-url https://eth-sepolia.public.blastapi.io
```

## Phase 4: Start Frontend

```bash
cd packages/nextjs
yarn dev
```

Visit http://localhost:3001 to see the marketplace.

## Script Reference

### ScriptConstants.sol

Central configuration file. Update here to change:
- Contract addresses
- Agent names and prices
- ENS namehashes
- GitHub URLs

### RegisterAgents.s.sol

Registers agents on the AgentRegistry contract.

**Usage:**
```bash
forge script script/RegisterAgents.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai
```

**What it does:**
- Gets AgentRegistry at `AGENT_REGISTRY_BASE_SEPOLIA`
- Calls `registerAgent()` for each demo agent
- Sets query price from `AGENT_QUERY_PRICE`

### SetENSTextRecords.s.sol

Sets ENSIP-TBD-11 compliant text records on ENS.

**Usage:**
```bash
forge script script/SetENSTextRecords.s.sol \
  --rpc-url https://eth-sepolia.public.blastapi.io \
  --broadcast \
  --account ai \
  --password ai
```

**What it does:**
- Connects to ENS Public Resolver on Ethereum Sepolia
- Sets `agent.capabilities`, `agent.endpoint`, etc. for each agent
- Uses helper function `_setAgentRecords()` to reduce duplication

### UpdateAgentPrices.s.sol

Updates agent query prices on the contract.

**Usage:**
```bash
forge script script/UpdateAgentPrices.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --account ai \
  --password ai
```

**What it does:**
- Calls `updateAgent()` to change price and active status
- Useful for price adjustments or disabling agents

## Troubleshooting

### Error: "Device not configured"
Check your keystore password is correct. Should be "ai" for our setup.

### Error: "Agent not active"
Agents must be registered via `RegisterAgents.s.sol` before querying.

### Contract not showing in frontend
- Verify `deployedContracts.ts` has correct contract address
- Check `scaffold.config.ts` targets `chains.baseSepolia`
- Clear browser cache and restart dev server

### ENS text records not updating
- Verify you have the correct ENS resolver address
- Check namehashes match your actual subdomains
- Wait ~30 seconds for changes to propagate

