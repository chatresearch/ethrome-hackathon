# ENS Agent Setup Guide

You have 5 agents to register on ENS Sepolia. Follow these steps:

## Quick Start
1. Go to https://app.ens.domains/
2. Connect wallet to **Sepolia testnet**
3. Search for each agent subdomain below
4. Add the text records

---

## Agent 1: DeFi Wizard

**Domain:** `defi-wizard.aiconfig.eth`

**Text Records to Add:**
| Key | Value |
|-----|-------|
| `agent.capabilities` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/defi-wizard-capabilities.json` |
| `agent.description` | `Expert DeFi strategy advisor specializing in yield optimization, protocol analysis, and risk management for decentralized finance` |
| `agent.type` | `eliza-os` |
| `agent.version` | `1.0.0` |
| `avatar` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/defi-wizard.png` |

---

## Agent 2: Security Guru

**Domain:** `security-guru.aiconfig.eth`

**Text Records to Add:**
| Key | Value |
|-----|-------|
| `agent.capabilities` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/security-guru-capabilities.json` |
| `agent.description` | `Smart contract security expert and vulnerability analyzer` |
| `agent.type` | `eliza-os` |
| `agent.version` | `1.0.0` |
| `avatar` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/security-guru.png` |

---

## Agent 3: Profile Roaster

**Domain:** `profile-roaster.aiconfig.eth`

**Text Records to Add:**
| Key | Value |
|-----|-------|
| `agent.capabilities` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/profile-roaster-capabilities.json` |
| `agent.description` | `Hilarious AI roaster specializing in witty critiques of dating profiles and selfies with entertaining observations` |
| `agent.type` | `eliza-os` |
| `agent.version` | `1.0.0` |
| `avatar` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/profile-roaster.png` |

---

## Agent 4: LinkedIn Roaster

**Domain:** `linkedin-roaster.aiconfig.eth`

**Text Records to Add:**
| Key | Value |
|-----|-------|
| `agent.capabilities` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/linkedin-roaster-capabilities.json` |
| `agent.description` | `Corporate culture expert delivering sharp satire and business humor for professional headshots and startup vibes` |
| `agent.type` | `eliza-os` |
| `agent.version` | `1.0.0` |
| `avatar` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/linkedin-roaster.png` |

---

## Agent 5: Vibe Roaster

**Domain:** `vibe-roaster.aiconfig.eth`

**Text Records to Add:**
| Key | Value |
|-----|-------|
| `agent.capabilities` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/vibe-roaster-capabilities.json` |
| `agent.description` | `Fashion and aesthetic expert roasting overall vibes, lifestyle choices, and design decisions with humorous precision` |
| `agent.type` | `eliza-os` |
| `agent.version` | `1.0.0` |
| `avatar` | `https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/vibe-roaster.png` |

---

## Manual Steps via ENS Manager

1. **Create subdomains** (if not already created):
   - Go to `aiconfig.eth`
   - Click "Create subdomain"
   - Create: `defi-wizard`, `security-guru`, `profile-roaster`, `linkedin-roaster`, `vibe-roaster`

2. **For each subdomain:**
   - Click on the subdomain name
   - Click "Edit"
   - Go to "Text records" section
   - Click "Add record"
   - Add all 4 text records above
   - Save changes

3. **Verify:**
   - Check that all records are visible on https://etherscan.io/
   - Search for the ENS name and verify resolver

---

## Testing

Once records are set, test via:

```bash
# Resolve ENS name
curl https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_resolveName",
    "params": ["defi-wizard.aiconfig.eth"],
    "id": 1
  }'
```

Or via ethers.js:
```javascript
const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY');
const resolver = await provider.getResolver('defi-wizard.aiconfig.eth');
const capabilities = await resolver.getText('agent.capabilities');
console.log(capabilities);
```

---

## Integration

Once records are live, your XMTP agent will automatically:
1. Resolve ENS names
2. Fetch capabilities from URLs
3. Route queries to appropriate agents
4. Format responses with agent metadata

Done! ✅
