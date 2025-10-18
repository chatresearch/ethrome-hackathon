# Documentation Map

Clean, terse documentation without emojis. All guides consolidated and consistent.

## Core Documentation

**README.md** (3.9 KB)
- Project overview in 50 lines
- What the project does
- Tech stack, quick start, ENSIP-TBD-11 schema
- Architecture and demo agents
- Links to detailed guides

**QUICKSTART.md** (3.4 KB)
- 7-step deployment workflow
- What was built
- Testing and demo agents
- References DEPLOYMENT.md for detailed instructions

**DEPLOYMENT.md** (5.1 KB)
- Prerequisites: wallet creation and funding
- Phase 1: Deploy contract to Base Sepolia
- Phase 2: Register agents
- Phase 3: Set up ENS (optional)
- Phase 4: Start frontend
- Script reference and troubleshooting

**TESTING.md** (4.9 KB)
- Test suite documentation
- How to run tests
- Key test concepts
- Coverage summary

**CONTRIBUTING.md** (3.7 KB)
- Contribution guidelines

## Deleted Files

Removed duplicate/outdated docs:
- `ENS-SETUP.md` (consolidated into DEPLOYMENT.md)
- `ENS-REGISTRATION-GUIDE.md` (consolidated into DEPLOYMENT.md)

## Key Updates

### Naming Convention
All agents now use `aiconfig.eth` consistently:
- `defi-wizard.aiconfig.eth`
- `security-guru.aiconfig.eth`

(No more `ballew.eth` - that's on mainnet)

### Agent Configuration
All shared values in `packages/foundry/script/ScriptConstants.sol`:
- Contract addresses
- Agent names and prices
- ENS namehashes
- GitHub URLs
- Text record keys

Update this one file to configure all scripts.

### Scripts Reference
See DEPLOYMENT.md "Script Reference" section for:
- RegisterAgents.s.sol - Register agents on Base Sepolia
- SetENSTextRecords.s.sol - Set ENSIP-TBD-11 metadata
- UpdateAgentPrices.s.sol - Update agent prices

## Reading Guide

**Just want to deploy?**
→ QUICKSTART.md (7 steps)

**Need detailed setup?**
→ DEPLOYMENT.md (complete walkthrough)

**Want to understand the code?**
→ README.md (architecture and overview)

**Need test documentation?**
→ TESTING.md (test coverage)

**Want to contribute?**
→ CONTRIBUTING.md (guidelines)
