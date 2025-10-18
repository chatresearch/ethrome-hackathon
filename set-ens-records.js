const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/7U4mbJajvpp6GzozCw6z6kMEGAqKcXkG';
const ENS_RESOLVER = '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Resolver ABI (minimal)
const RESOLVER_ABI = [
  'function setText(bytes32 node, string key, string value) external',
];

// Agent data
const agents = [
  {
    name: 'defi-wizard',
    description: 'Expert DeFi strategy advisor specializing in yield optimization, protocol analysis, and risk management for decentralized finance',
    capabilitiesUrl: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/defi-wizard-capabilities.json',
    avatar: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/defi-wizard.png',
    namehash: '0xcc8d67d267418ddf688ea6584cb37b7585ad68b8ba96abe7fc1e171f06b3aac8',
  },
  {
    name: 'security-guru',
    description: 'Smart contract security expert and vulnerability analyzer',
    capabilitiesUrl: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/security-guru-capabilities.json',
    avatar: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/security-guru.png',
    namehash: '0x4d2087036941ac174b2487fe484c53da33efe56a75f0bb03a8ba53de7eda21f9',
  },
  {
    name: 'profile-roaster',
    description: 'Hilarious AI roaster specializing in witty critiques of dating profiles and selfies with entertaining observations',
    capabilitiesUrl: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/profile-roaster-capabilities.json',
    avatar: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/profile-roaster.png',
    namehash: '0x45ca6a6f01892386a42e394aceac5ef800db2d72ff20c4b1ec3a86678b88a97c',
  },
  {
    name: 'linkedin-roaster',
    description: 'Corporate culture expert delivering sharp satire and business humor for professional headshots and startup vibes',
    capabilitiesUrl: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/linkedin-roaster-capabilities.json',
    avatar: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/linkedin-roaster.png',
    namehash: '0x9ab497bab10c19e6a68242f4285c78180d09611d0c2abeb40d7277155be52905',
  },
  {
    name: 'vibe-roaster',
    description: 'Fashion and aesthetic expert roasting overall vibes, lifestyle choices, and design decisions with humorous precision',
    capabilitiesUrl: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/vibe-roaster-capabilities.json',
    avatar: 'https://raw.githubusercontent.com/chatresearch/ethrome-hackathon/refs/heads/main/eth-ai-asa/agent-capabilities/vibe-roaster.png',
    namehash: '0xfa8ae6d9d236c730d97a804d0331ee26fbff0c2496c91f6f5e403d07110665cc',
  },
];

async function setENSRecords() {
  if (!PRIVATE_KEY) {
    console.error('ERROR: PRIVATE_KEY env var not set');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const resolver = new ethers.Contract(ENS_RESOLVER, RESOLVER_ABI, signer);

  console.log(`Setting ENS records for ${agents.length} agents...\n`);
  console.log(`Signer: ${signer.address}\n`);

  for (const agent of agents) {
    console.log(`[${agent.name}]`);
    try {
      // Set capabilities URL
      let tx = await resolver.setText(agent.namehash, 'agent.capabilities', agent.capabilitiesUrl);
      await tx.wait();
      console.log('  ✓ agent.capabilities set');

      // Set description
      tx = await resolver.setText(agent.namehash, 'agent.description', agent.description);
      await tx.wait();
      console.log('  ✓ agent.description set');

      // Set type
      tx = await resolver.setText(agent.namehash, 'agent.type', 'eliza-os');
      await tx.wait();
      console.log('  ✓ agent.type set');

      // Set version
      tx = await resolver.setText(agent.namehash, 'agent.version', '1.0.0');
      await tx.wait();
      console.log('  ✓ agent.version set');

      // Set avatar
      tx = await resolver.setText(agent.namehash, 'avatar', agent.avatar);
      await tx.wait();
      console.log('  ✓ avatar set');

      console.log('');
    } catch (error) {
      console.error(`  ERROR: ${error.message}\n`);
    }
  }

  console.log('=== COMPLETE ===');
  console.log('All ENS records have been set!');
}

setENSRecords().catch(console.error);
